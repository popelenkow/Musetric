import json
import os
import sys
import tempfile
from typing import Dict

import librosa
import numpy as np
import torch
import yaml
from ml_collections import ConfigDict

from musetric_backend_workers.envs import envs
from musetric_backend_workers.separate import utils
from musetric_backend_workers.separate.roformer.bs_roformer import BSRoformer
from musetric_backend_workers.separate.separation import CustomTqdm, ProgressTracker

progress_bar = CustomTqdm


class BSRoformerSeparator:
    def __init__(self):
        import os

        absolute_models_dir = os.path.abspath(envs["modelsDir"])
        self.model_path = os.path.join(absolute_models_dir, envs["model"])
        self.config_path = os.path.join(
            absolute_models_dir, envs["model"].replace(".ckpt", ".yaml")
        )
        self.device = self._setup_device()
        self.model = None
        self.model_config = None

    def _setup_device(self):
        if torch.cuda.is_available():
            return torch.device("cuda")
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return torch.device("mps")
        else:
            return torch.device("cpu")

    def _load_config(self):
        with open(self.config_path, "r") as f:
            config = yaml.load(f, Loader=yaml.FullLoader)
        return ConfigDict(config)

    def _load_model(self):
        if self.model is not None:
            return

        self.model_config = self._load_config()

        model_params = self.model_config.model
        model = BSRoformer(**model_params)

        checkpoint = torch.load(self.model_path, map_location="cpu", weights_only=True)
        model.load_state_dict(checkpoint)
        model.to(self.device).eval()

        self.model = model

    def _prepare_mix(self, audio_file_path):
        mix, sr = librosa.load(audio_file_path, mono=False, sr=44100)

        if mix.ndim == 1:
            mix = np.asfortranarray([mix, mix])

        return mix

    def _demix(self, mix: np.ndarray) -> dict:
        orig_mix = mix

        mix = torch.tensor(mix, dtype=torch.float32)

        segment_size = self.model_config.inference.dim_t
        num_stems = self.model_config.model.num_stems
        chunk_size = self.model_config.audio.hop_length * (segment_size - 1)
        step = int(8 * self.model_config.audio.sample_rate)

        window = torch.hamming_window(chunk_size, dtype=torch.float32)

        with torch.no_grad():
            req_shape = (len(self.model_config.training.instruments),) + tuple(
                mix.shape
            )
            result = torch.zeros(req_shape, dtype=torch.float32)
            counter = torch.zeros(req_shape, dtype=torch.float32)

            for i in progress_bar(range(0, mix.shape[1], step)):
                part = mix[:, i : i + chunk_size]
                length = part.shape[-1]
                if i + chunk_size > mix.shape[1]:
                    part = mix[:, -chunk_size:]
                    length = chunk_size
                part = part.to(self.device)
                x = self.model(part.unsqueeze(0))[0]
                x = x.cpu()

                if i + chunk_size > mix.shape[1]:
                    result = self._overlap_add(
                        result, x, window, result.shape[-1] - chunk_size, length
                    )
                    counter[..., result.shape[-1] - chunk_size :] += window[:length]
                else:
                    result = self._overlap_add(result, x, window, i, length)
                    counter[..., i : i + length] += window[:length]

        inferenced_outputs = result / counter.clamp(min=1e-10)

        sources = {}
        for key, value in zip(
            self.model_config.training.instruments,
            inferenced_outputs.cpu().detach().numpy(),
        ):
            sources[key] = value

        # Create secondary source
        primary_stem = self.model_config.training.target_instrument
        secondary_stem = "Instrumental" if primary_stem == "Vocals" else "Vocals"

        if primary_stem in sources:
            sources[primary_stem] = utils.match_array_shapes(
                sources[primary_stem], orig_mix
            )
            sources[secondary_stem] = orig_mix - sources[primary_stem]

        return sources

    def _overlap_add(self, result, x, weights, start, length):
        result[..., start : start + length] += x[..., :length] * weights[:length]
        return result

    def separate_audio(
        self, input_path: str, vocal_output: str, instrumental_output: str
    ) -> Dict[str, Dict[str, str]]:
        tracker = ProgressTracker()
        CustomTqdm._progress_tracker = tracker

        with tempfile.TemporaryDirectory() as temp_dir:
            self._load_model()

            mix = self._prepare_mix(input_path)
            mix = utils.normalize(wave=mix, max_peak=0.9, min_peak=0.0)

            sources = self._demix(mix=mix)

            # Find output files
            vocal_source = None
            instrumental_source = None

            for stem_name, source in sources.items():
                if "Vocal" in stem_name:
                    vocal_source = source
                elif "Instrumental" in stem_name:
                    instrumental_source = source

            if vocal_source is not None:
                vocal_source = utils.normalize(
                    wave=vocal_source, max_peak=0.9, min_peak=0.0
                ).T
                self._write_audio(vocal_output, vocal_source)

            if instrumental_source is not None:
                instrumental_source = utils.normalize(
                    wave=instrumental_source, max_peak=0.9, min_peak=0.0
                ).T
                self._write_audio(instrumental_output, instrumental_source)

        metadata = self._generate_metadata(vocal_output, instrumental_output)
        print(json.dumps(metadata))
        return metadata

    def _write_audio(self, output_path: str, audio_data: np.ndarray):
        import soundfile as sf

        if audio_data.dtype != np.float32:
            audio_data = audio_data.astype(np.float32)

        sf.write(output_path, audio_data, 44100, format="FLAC")

    def _generate_metadata(
        self, vocal_output: str, instrumental_output: str
    ) -> Dict[str, Dict[str, str]]:
        return {
            "vocal": {
                "filename": os.path.basename(vocal_output),
                "contentType": envs["contentType"],
            },
            "instrumental": {
                "filename": os.path.basename(instrumental_output),
                "contentType": envs["contentType"],
            },
        }


class AudioSeparator:
    def __init__(self) -> None:
        self.separator = BSRoformerSeparator()

    def separate_audio(
        self, input_path: str, vocal_output: str, instrumental_output: str
    ) -> Dict[str, Dict[str, str]]:
        return self.separator.separate_audio(
            input_path, vocal_output, instrumental_output
        )
