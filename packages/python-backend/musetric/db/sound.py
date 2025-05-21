from sqlite3 import Cursor
from typing import Literal

from musetric.common.error import NotFoundError
from musetric.common.model import Model
from musetric.db.project import ProjectStage

SoundType = Literal["original", "vocal", "instrumental"]


class Sound(Model):
    data: bytes
    filename: str
    contentType: str


def addOriginalSound(cursor: Cursor, projectId: str, sound: Sound):
    soundType: SoundType = "original"
    cursor.execute(
        "INSERT INTO sound (projectId, type, data, filename, contentType) VALUES (?, ?, ?, ?, ?)",
        (projectId, soundType, sound.data, sound.filename, sound.contentType),
    )
    stage: ProjectStage = "pending"
    cursor.execute(
        "UPDATE project SET stage = ? WHERE id = ?",
        (stage, projectId),
    )


def getSound(cursor: Cursor, projectId: str, soundType: SoundType) -> Sound:
    cursor.execute(
        "SELECT * FROM sound WHERE projectId = ? AND type = ?",
        (projectId, soundType),
    )
    row = cursor.fetchone()
    if row is None:
        raise NotFoundError(
            f"Sound with type {soundType} and projectId {projectId} not found"
        )
    return Sound(
        data=row["data"], filename=row["filename"], contentType=row["contentType"]
    )
