import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from musetric.api.index import includeRouters
from musetric.common.path import frontendPath
from musetric.db.base import initDb


async def lifespan(app: FastAPI):
    initDb()
    yield


app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

includeRouters(app)

if os.path.exists(frontendPath):
    app.mount("/", StaticFiles(directory=frontendPath, html=True), name="frontend")
else:
    print("Run without frontend files")
