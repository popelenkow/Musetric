import os
from pathlib import Path


class EnvsConfig:
    def __init__(self):
        rootPath = Path(__file__).parent.parent.parent.parent
        self.model = "model_bs_roformer_ep_368_sdr_12.9628.ckpt"
        self.modelsDir = os.path.abspath(str(rootPath / "tmp" / "models"))
        self.outputFormat = "FLAC"
        self.contentType = "audio/flac"
        self.sampleRate = 44100


envs = EnvsConfig()
