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


def report_progress(progress: float, stage: StageType) -> None:
    progress_data = {"progress": progress, "stage": stage}
    print(json.dumps(progress_data), flush=True)


def progress_callback(
    current_step: int, total_steps: int, stage: StageType = "separating"
) -> None:
    if total_steps > 0:
        progress_fraction = current_step / total_steps
        report_progress(progress_fraction, stage)
