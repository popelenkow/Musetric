from sqlite3 import Cursor
from typing import Literal, Optional

from musetric.common.model import Model

ProjectStage = Literal["init", "pending", "progress", "done"]


class ProjectInfo(Model):
    id: int
    name: str
    stage: ProjectStage
    previewId: Optional[int]


def createProject(cursor: Cursor, name: str) -> int:
    stage: ProjectStage = "init"
    cursor.execute("INSERT INTO project (name, stage) VALUES (?, ?)", (name, stage))
    projectId = cursor.lastrowid
    return projectId


def renameProject(cursor: Cursor, projectId: int, name: str) -> bool:
    cursor.execute("UPDATE project SET name = ? WHERE id = ?", (name, projectId))
    return cursor.rowcount > 0


def deleteProject(cursor: Cursor, projectId: int) -> bool:
    cursor.execute("DELETE FROM project WHERE id = ?", (projectId,))
    return cursor.rowcount > 0


def getProjectInfos(cursor: Cursor) -> list[ProjectInfo]:
    cursor.execute(
        """--sql
        SELECT
            x.id,
            x.name,
            x.stage,
            y.id AS previewId
        FROM project x
        LEFT JOIN preview y ON y.projectId = x.id
        ORDER BY x.id DESC
        """
    )
    rows = cursor.fetchall()
    return [ProjectInfo.model_validate(dict(row)) for row in rows]


def getProjectInfo(cursor: Cursor, projectId: int) -> Optional[ProjectInfo]:
    cursor.execute(
        """--sql
        SELECT
            x.id,
            x.name,
            x.stage,
            y.id AS previewId
        FROM project x
        LEFT JOIN preview y ON y.projectId = x.id
        WHERE x.id = ?
        """,
        (projectId,),
    )
    row = cursor.fetchone()
    if row is None:
        return None
    return ProjectInfo.model_validate(dict(row))
