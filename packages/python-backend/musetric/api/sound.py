from io import BytesIO
from urllib.parse import quote

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import StreamingResponse

from musetric.db.base import connectDbTransaction
from musetric.db.sound import Sound, SoundType, addOriginalSound, getSound

soundRouter = APIRouter(prefix="/api/sound", tags=["sound"])


@soundRouter.post("/{projectId}/original")
def addOriginalSoundApi(
    projectId: int,
    file: UploadFile = File(...),
):
    with connectDbTransaction() as (cursor, _):
        sound = Sound(
            data=file.file.read(), filename=file.filename, contentType=file.content_type
        )
        addOriginalSound(cursor, projectId, sound)


@soundRouter.get("/{projectId}/{soundType}")
def getSoundApi(projectId: int, soundType: SoundType):
    with connectDbTransaction() as (cursor, _):
        sound = getSound(cursor, projectId, soundType)
        return StreamingResponse(
            content=BytesIO(sound.data),
            media_type=sound.contentType,
            headers={
                "Content-Disposition": f'attachment; filename="{quote(sound.filename)}"'
            },
        )
