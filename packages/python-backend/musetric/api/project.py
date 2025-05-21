from fastapi import APIRouter, HTTPException

from musetric.common.model import Model
from musetric.db.base import connectDbTransaction
from musetric.db.project import (
    ProjectInfo,
    createProject,
    deleteProject,
    getProjectInfo,
    getProjectInfos,
    renameProject,
)

projectRouter = APIRouter(prefix="/api/project", tags=["project"])


class CreateProjectArgs(Model):
    name: str


@projectRouter.post("")
def createProjectApi(args: CreateProjectArgs) -> ProjectInfo:
    with connectDbTransaction() as (cursor, _):
        projectId = createProject(cursor, args.name)
        return getProjectInfo(cursor, projectId)


@projectRouter.post("/{projectId}/rename")
def renameProjectApi(projectId: int, args: CreateProjectArgs) -> ProjectInfo:
    with connectDbTransaction() as (cursor, _):
        isExists = renameProject(cursor, projectId, args.name)
        if not isExists:
            raise HTTPException(
                status_code=404, detail=f"Project with id {projectId} not found"
            )
        return getProjectInfo(cursor, projectId)


@projectRouter.delete("/{projectId}")
def deleteProjectApi(projectId: int):
    with connectDbTransaction() as (cursor, _):
        isExists = deleteProject(cursor, projectId)
        if not isExists:
            raise HTTPException(
                status_code=404, detail=f"Project with id {projectId} not found"
            )


@projectRouter.get("/list")
def getProjectInfosApi() -> list[ProjectInfo]:
    with connectDbTransaction() as (cursor, _):
        return getProjectInfos(cursor)


@projectRouter.get("/{projectId}")
def getProjectInfoApi(projectId: int) -> ProjectInfo:
    with connectDbTransaction() as (cursor, _):
        project = getProjectInfo(cursor, projectId)
        if project is None:
            raise HTTPException(
                status_code=404, detail=f"Project with id {projectId} not found"
            )
        return project
