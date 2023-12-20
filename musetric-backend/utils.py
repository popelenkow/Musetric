import os
import demucs.api
import torch
import json

def readJson(path):
    with open(path, 'r') as file:
        data = json.load(file)
        return data

def writeJson(path, data):
    with open(path, 'w') as file:
            json.dump(data, file, indent=4)

def getDirectoryList(directoryPath):
    names = [os.path.basename(x.path) for x in os.scandir(directoryPath) if x.is_dir()]
    return names

def getSoundNextId(soundPath):
    names = getDirectoryList(soundPath)
    values = [int(name) for name in names]
    values.append(-1)
    return str(max(values) + 1).zfill(6)

def makeMinusStem(dict):
    minusDict = dict.copy()
    minusDict.pop('vocals')
    minus = torch.zeros_like(next(iter(minusDict.values())))
    for value in minusDict.values():
        minus += value
    return minus

def separateSound(dirPath, fileName):
    separator6 = demucs.api.Separator(model='htdemucs_6s', device='cuda', progress=True)
    _, separated6 = separator6.separate_audio_file(os.path.join(dirPath, fileName))
    separated6['minus'] = makeMinusStem(separated6)
    for stem, source in separated6.items():
        demucs.api.save_audio(source, os.path.join(dirPath, f'6_{stem}.flac'), samplerate=separator6.samplerate)

    separator = demucs.api.Separator(model='htdemucs_ft', device='cuda', progress=True)
    _, separated = separator.separate_audio_file(os.path.join(dirPath, fileName))
    separated['minus'] = makeMinusStem(separated)
    for stem, source in separated.items():
        demucs.api.save_audio(source, os.path.join(dirPath, f'4_{stem}.flac'), samplerate=separator.samplerate)
