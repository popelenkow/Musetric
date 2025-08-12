import json
import tempfile
from typing import Dict

import numpy as np
import torch
import yaml

from musetricBackendWorkers.separateAudio import utils
from musetricBackendWorkers.separateAudio.bsRoformerUtils import (
    AudioProcessor,
    dictToNamespace,
)
from musetricBackendWorkers.separateAudio.ffmpeg.read import readAudioFile
from musetricBackendWorkers.separateAudio.ffmpeg.write import writeAudioFile
from musetricBackendWorkers.separateAudio.roformer.bsRoformer import BSRoformer


class BSRoformerSeparator:
    def __init__(
        self,
        modelPath: str,
        modelConfigPath: str,
        sampleRate: int,
        outputFormat: str,
    ):
        self.modelPath = modelPath
        self.modelConfigPath = modelConfigPath
        self.sampleRate = sampleRate
        self.outputFormat = outputFormat
        self.device = self._getDevice()
        self.model = None
        self.config = None
        self.audioProcessor = None

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.backends.cudnn.benchmark = True

    def _getDevice(self) -> torch.device:
        if torch.cuda.is_available():
            return torch.device("cuda")
        if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return torch.device("mps")
        return torch.device("cpu")

    def _loadConfig(self):
        with open(self.modelConfigPath, "r") as f:
            return dictToNamespace(yaml.load(f, Loader=yaml.FullLoader))

    def _loadModel(self):
        if self.model is not None:
            return

        self.config = self._loadConfig()
        model = BSRoformer(**vars(self.config.model))
        checkpoint = torch.load(self.modelPath, map_location="cpu", weights_only=True)
        model.load_state_dict(checkpoint)
        self.model = model.to(self.device)
        self.model.eval()

        self.audioProcessor = AudioProcessor(self.device, self.config)

    def _deMix(self, mix: np.ndarray) -> dict:
        return self.audioProcessor.demix(mix, self.model)

    def separateAudio(
        self, sourcePath: str, vocalPath: str, instrumentalPath: str
    ) -> Dict[str, str]:
        with tempfile.TemporaryDirectory():
            self._loadModel()

            mixture = utils.normalize(
                readAudioFile(sourcePath, self.sampleRate, 2),
                maxPeak=0.9,
                minPeak=0.0,
            )

            separatedSources = self._deMix(mixture)

            for stemName, sourceAudio in separatedSources.items():
                normalizedSource = utils.normalize(
                    sourceAudio, maxPeak=0.9, minPeak=0.0
                ).T
                outputPath = vocalPath if "Vocal" in stemName else instrumentalPath
                if outputPath and ("Vocal" in stemName or "Instrumental" in stemName):
                    writeAudioFile(
                        outputPath,
                        normalizedSource.astype(np.float32),
                        self.sampleRate,
                        self.outputFormat,
                    )

        result = {
            "vocal": vocalPath,
            "instrumental": instrumentalPath,
        }
        print(json.dumps({"type": "result", **result}), flush=True)
        return result
