from fastapi import FastAPI, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import aiofiles
import os
import json
import uvicorn
import socket
import threading
import torch
import shutil
import time
from utils import getSoundNextId, getDirectoryList, separateSound, writeJson, readJson

port = 3001
root = os.path.abspath('')
soundPath = os.path.join(root, 'tmp')
infoFileName = 'info.json'

app = FastAPI()
soundLock = threading.Lock()

if not os.path.exists(soundPath):
    os.makedirs(soundPath)

app.add_middleware(
    CORSMiddleware,
    allow_origins='*',
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

def findPendingSound():
    for id in getDirectoryList(soundPath):
        info = readJson(os.path.join(soundPath, id, infoFileName))
        if info['status'] == 'pending':
            return info
        
def handleSeparation():
    info = None
    id = None
    fileName = None
    with soundLock:
        info = findPendingSound()
        if info is None:
            return False
        id, fileName  = (info['id'], info['fileName'])
        info['status'] = 'progress'
        writeJson(os.path.join(soundPath, id, infoFileName), info)

    separateSound(os.path.join(soundPath, id), fileName)
    with soundLock:
        info['status'] = 'done'
        writeJson(os.path.join(soundPath, id, infoFileName), info)
    return True

def runBackgroundThread():
    while True:
        isNext = handleSeparation()
        if isNext:
            continue
        time.sleep(1)

backgroundThread = threading.Thread(target=runBackgroundThread)
backgroundThread.setDaemon(True)
backgroundThread.start()

@app.get('/ping')
async def ping():
    return ''

@app.get('/sound/list')
async def getList():
    def getInfo(id):
        with open(os.path.join(soundPath, id, infoFileName)) as infoFile:
            info = json.load(infoFile)
            return info

    with soundLock:
        list = [getInfo(id) for id in getDirectoryList(soundPath)]
        return list

@app.post('/sound')
async def addSound(file: UploadFile):
    with soundLock:
        id = getSoundNextId(soundPath)
        dirPath = os.path.join(soundPath, id)
        if not os.path.exists(dirPath):
            os.makedirs(dirPath)

        fileName = file.filename
        async with aiofiles.open(os.path.join(dirPath, fileName), 'wb') as outFile:
            content = await file.read()
            await outFile.write(content)
        info = {
            'id': id,
            'fileName': fileName,
            'status': 'pending',
        }
        writeJson(os.path.join(dirPath, infoFileName), info)
        return info

@app.delete('/sound/{id}')
async def removeSound(id: str):
    with soundLock:
        shutil.rmtree(os.path.join(soundPath, id))

@app.get('/sound/{id}/{stem}/{stemCount}')
async def getSoundStem(id, stem, stemCount):
    fileName = f'{stemCount}_{stem}.flac'
    path = os.path.join(soundPath, id, fileName)
    return FileResponse(path=path, filename=fileName, media_type='audio/flac')

ipv4 = socket.gethostbyname(socket.gethostname())
print(f'http://{ipv4}:{port}')
print(f'http://{ipv4}:{port}/docs')
print(f'cuda: {str(torch.cuda.is_available())}')

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=port, reload=True)
