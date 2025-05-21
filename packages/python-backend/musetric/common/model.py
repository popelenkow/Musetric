from pydantic import BaseModel, ConfigDict


class Model(BaseModel):
    model_config = ConfigDict(exclude_none=True, exclude_unset=True)
