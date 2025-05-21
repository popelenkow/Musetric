from io import BytesIO
from typing import Optional
from urllib.parse import quote

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse

from musetric.db.base import connectDbTransaction
from musetric.db.preview import Preview, changePreview, getPreview
from musetric.db.project import getProjectInfo

previewRouter = APIRouter(prefix="/api/preview", tags=["preview"])


@previewRouter.post("/project/{projectId}")
def changePreviewApi(
    projectId: int,
    file: Optional[UploadFile] = File(None),
):
    with connectDbTransaction() as (cursor, _):
        preview = (
            Preview(
                data=file.file.read(),
                filename=file.filename,
                contentType=file.content_type,
            )
            if file is not None
            else None
        )
        changePreview(cursor, projectId, preview)
        return getProjectInfo(cursor, projectId)


@previewRouter.get("/{previewId}")
def getPreviewApi(previewId: int):
    with connectDbTransaction() as (cursor, _):
        preview = getPreview(cursor, previewId)
        return StreamingResponse(
            content=BytesIO(preview.data),
            media_type=preview.contentType,
            headers={
                "Content-Disposition": f'attachment; filename="{quote(preview.filename)}"'
            },
        )
