import json
import os
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
        modelsDir: str,
        modelName: str,
        sampleRate: int,
        outputFormat: str,
        contentType: str,
    ):
        self.modelPath = os.path.join(modelsDir, modelName)
        self.configPath = os.path.join(modelsDir, modelName.replace(".ckpt", ".yaml"))
        self.sampleRate = sampleRate
        self.outputFormat = outputFormat
        self.contentType = contentType
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
        with open(self.configPath, "r") as f:
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
        self, inputPath: str, vocalOutput: str, instrumentalOutput: str
    ) -> Dict[str, Dict[str, str]]:
        with tempfile.TemporaryDirectory():
            self._loadModel()

            mixture = utils.normalize(
                readAudioFile(inputPath, self.sampleRate, 2),
                maxPeak=0.9,
                minPeak=0.0,
            )

            separatedSources = self._deMix(mixture)

            for stemName, sourceAudio in separatedSources.items():
                normalizedSource = utils.normalize(
                    sourceAudio, maxPeak=0.9, minPeak=0.0
                ).T
                outputPath = vocalOutput if "Vocal" in stemName else instrumentalOutput
                if outputPath and ("Vocal" in stemName or "Instrumental" in stemName):
                    writeAudioFile(
                        outputPath,
                        normalizedSource.astype(np.float32),
                        self.sampleRate,
                        self.outputFormat,
                    )

        metadata = {
            "vocal": {
                "filename": os.path.basename(vocalOutput),
                "contentType": self.contentType,
            },
            "instrumental": {
                "filename": os.path.basename(instrumentalOutput),
                "contentType": self.contentType,
            },
        }
        print(json.dumps({"type": "metadata", **metadata}), flush=True)
        return metadata
