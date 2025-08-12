import json


def reportProgress(progress: float) -> None:
    data = {"type": "progress", "progress": progress}
    print(json.dumps(data), flush=True)
