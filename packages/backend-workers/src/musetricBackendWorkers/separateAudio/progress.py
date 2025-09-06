import json
from typing import Literal

StageType = Literal[
    "initializing",
    "loading_model",
    "separating",
    "processing",
    "finalizing",
    "completed",
]


def reportProgress(progress: float, stage: StageType) -> None:
    data = {"type": "progress", "progress": progress, "stage": stage}
    print(json.dumps(data), flush=True)


def progressCallback(currentStep: int, totalSteps: int, stage: StageType) -> None:
    if totalSteps > 0:
        reportProgress(currentStep / totalSteps, stage)
