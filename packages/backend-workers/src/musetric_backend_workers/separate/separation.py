import sys
from typing import Dict


# Real progress tracker that only reports actual neural network processing progress
class ProgressTracker:
    def __init__(self):
        self.last_progress = 0.0

    def update_progress(self, progress: float):
        """Update progress ensuring it only goes forward and reports real progress"""
        if progress > self.last_progress:
            self.last_progress = progress
            report_progress(progress, "separating")


# Custom tqdm replacement that tracks ONLY real progress from neural network processing
class CustomTqdm:
    _progress_tracker = None

    def __init__(self, *args, **kwargs):
        # Get real total from tqdm parameters - NO default values
        self.total = kwargs.get("total", None)
        self.n = 0
        self.desc = kwargs.get("desc", "")
        self.iterable = args[0] if args else None

        # If iterable provided, get total from iterable length
        if self.iterable and hasattr(self.iterable, "__len__"):
            self.total = len(self.iterable)
        elif args and hasattr(args[0], "__len__"):
            self.total = len(args[0])

    def update(self, n=1):
        self.n += n
        if self.total and CustomTqdm._progress_tracker:
            # Calculate ONLY real progress from neural network chunk/batch processing
            real_progress = min(self.n / self.total, 1.0)
            CustomTqdm._progress_tracker.update_progress(real_progress)

    def close(self):
        pass  # Don't jump to 100% on close

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

    def __iter__(self):
        if self.iterable:
            for item in self.iterable:
                self.update(1)
                yield item
        else:
            return self

    def __next__(self):
        raise StopIteration


# tqdm is replaced by CustomTqdm - no need to import original tqdm

from musetric_backend_workers.envs import envs
from musetric_backend_workers.separate.bs_roformer_separator import (
    AudioSeparator as BSRoformerAudioSeparator,
)
from musetric_backend_workers.separate.progress import report_progress


class AudioSeparator:

    def __init__(self) -> None:
        self.separator = BSRoformerAudioSeparator()

    def separate_audio(
        self, input_path: str, vocal_output: str, instrumental_output: str
    ) -> Dict[str, Dict[str, str]]:

        # Create real progress tracker for neural network processing
        tracker = ProgressTracker()
        CustomTqdm._progress_tracker = tracker

        return self.separator.separate_audio(
            input_path, vocal_output, instrumental_output
        )
