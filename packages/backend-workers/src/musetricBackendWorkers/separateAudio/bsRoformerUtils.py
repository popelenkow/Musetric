from argparse import Namespace
from typing import Any

import numpy as np
import torch

from musetricBackendWorkers.separateAudio.progress import reportProgress


def updateProgress(current: int, total: int) -> None:
    if total > 0:
        progress = min(current / total, 1.0)
        reportProgress(progress)


def dictToNamespace(data: Any) -> Any:
    if isinstance(data, dict):
        return Namespace(**{k: dictToNamespace(v) for k, v in data.items()})
    if isinstance(data, list):
        return [dictToNamespace(item) for item in data]
    return data


class AudioProcessor:
    def __init__(self, device: torch.device, config):
        self.device = device
        self.config = config

    def demix(self, mix: np.ndarray, model) -> dict:
        from musetricBackendWorkers.separateAudio import utils

        originalMix = mix
        mixTensor = torch.from_numpy(mix).to(dtype=torch.float32, device=self.device)

        segmentSize = self.config.inference.dim_t
        chunkSize = self.config.audio.hop_length * (segmentSize - 1)
        step = int(8 * self.config.audio.sample_rate)
        window = torch.hamming_window(
            chunkSize, dtype=torch.float32, device=self.device
        )

        instrumentsCount = len(self.config.training.instruments)
        resultShape = (instrumentsCount,) + mixTensor.shape
        result = torch.zeros(resultShape, dtype=torch.float32, device=self.device)
        counter = torch.zeros(resultShape, dtype=torch.float32, device=self.device)

        totalSteps = (mixTensor.shape[1] + step - 1) // step
        progressInterval = max(1, totalSteps // 100)

        with torch.no_grad():
            for stepIdx, i in enumerate(range(0, mixTensor.shape[1], step)):
                if stepIdx % progressInterval == 0:
                    updateProgress(stepIdx, totalSteps)

                if i + chunkSize > mixTensor.shape[1]:
                    part = mixTensor[:, -chunkSize:]
                    startPos = result.shape[-1] - chunkSize
                    length = chunkSize
                else:
                    part = mixTensor[:, i : i + chunkSize]
                    startPos = i
                    length = part.shape[-1]

                x = model(part.unsqueeze(0), target=None, return_loss_breakdown=False)[
                    0
                ]
                windowSlice = window[:length]
                result[..., startPos : startPos + length] += (
                    x[..., :length] * windowSlice
                )
                counter[..., startPos : startPos + length] += windowSlice

        outputs = (result / counter.clamp(min=1e-10)).cpu().numpy()
        sources = dict(zip(self.config.training.instruments, outputs))

        primaryStem = self.config.training.target_instrument
        secondaryStem = "Instrumental" if primaryStem == "Vocals" else "Vocals"

        if primaryStem in sources:
            sources[primaryStem] = utils.matchArrayShapes(
                sources[primaryStem], originalMix
            )
            sources[secondaryStem] = originalMix - sources[primaryStem]

        return sources
