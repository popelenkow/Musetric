import json
from typing import Literal

StageType = Literal[
    "initializing",
    "loadingModel",
    "separating",
    "processing",
    "finalizing",
    "completed",
]


def reportProgress(progress: float, stage: StageType) -> None:
    progressData = {"progress": progress, "stage": stage}
    print(json.dumps(progressData), flush=True)


def progressCallback(
    currentStep: int, totalSteps: int, stage: StageType = "separating"
) -> None:
    if totalSteps > 0:
        progressFraction = currentStep / totalSteps
        reportProgress(progressFraction, stage)
