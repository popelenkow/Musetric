from sqlite3 import Cursor
from typing import Optional

from musetric.common.error import NotFoundError
from musetric.common.model import Model


class Preview(Model):
    data: bytes
    filename: str
    contentType: str


def changePreview(cursor: Cursor, projectId: str, preview: Optional[Preview]):
    cursor.execute(
        "DELETE FROM preview WHERE projectId = ?",
        (projectId,),
    )
    if preview is None:
        return
    cursor.execute(
        "INSERT INTO preview (projectId, data, filename, contentType) VALUES (?, ?, ?, ?)",
        (projectId, preview.data, preview.filename, preview.contentType),
    )


def getPreview(cursor: Cursor, previewId: str) -> Preview:
    cursor.execute(
        "SELECT * FROM preview WHERE id = ?",
        (previewId,),
    )
    row = cursor.fetchone()
    if row is None:
        raise NotFoundError(f"Preview with previewId {previewId} not found")
    return Preview(
        data=row["data"], filename=row["filename"], contentType=row["contentType"]
    )
