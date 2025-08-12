import os
from pathlib import Path

currentDir = Path(__file__).parent

envs = {
    "model": "model_bs_roformer_ep_368_sdr_12.9628.ckpt",
    "modelsDir": str(currentDir.parent.parent / "tmp" / "models"),
    "outputFormat": "FLAC",
    "contentType": "audio/flac",
}
