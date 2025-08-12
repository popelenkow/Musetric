import json
import os
import shutil
import sys
import tempfile
import time
from typing import Dict, List


# Real progress tracker that only reports actual neural network processing progress
class ProgressTracker:
    def __init__(self):
        self.last_progress = 0.0
        
    def updateProgress(self, progress: float):
        """Update progress ensuring it only goes forward and reports real progress"""
        if progress > self.last_progress:
            self.last_progress = progress
            reportProgress(progress, "separating")

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
        if self.iterable and hasattr(self.iterable, '__len__'):
            self.total = len(self.iterable)
        elif args and hasattr(args[0], '__len__'):
            self.total = len(args[0])
            

    def update(self, n=1):
        self.n += n
        if self.total and CustomTqdm._progress_tracker:
            # Calculate ONLY real progress from neural network chunk/batch processing
            realProgress = min(self.n / self.total, 1.0)
            CustomTqdm._progress_tracker.updateProgress(realProgress)

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


# Replace tqdm before any imports
try:
    import tqdm

    tqdm.tqdm = CustomTqdm
    sys.modules["tqdm"].tqdm = CustomTqdm
except:
    pass

from audio_separator.separator import Separator

from separate.config import contentType, model, modelsDir, outputFormat
from separate.progress import reportProgress




class AudioSeparator:

    def __init__(self) -> None:
        self.separator: Separator | None = None

    def separateAudio(
        self, inputPath: str, vocalOutput: str, instrumentalOutput: str
    ) -> Dict[str, Dict[str, str]]:

        # Create real progress tracker for neural network processing
        tracker = ProgressTracker()
        CustomTqdm._progress_tracker = tracker


        with tempfile.TemporaryDirectory() as tempDir:
            separator = Separator(
                model_file_dir=modelsDir,
                output_dir=tempDir,
                output_format=outputFormat,
            )

            # Load model silently
            separator.load_model(model_filename=model)

            # Run separation - progress will be unified
            outputFiles = separator.separate(inputPath)

            vocalFile, instrumentalFile = self._findOutputFiles(outputFiles, tempDir)
            shutil.move(vocalFile, vocalOutput)
            shutil.move(instrumentalFile, instrumentalOutput)


        metadata = self._generateMetadata(vocalOutput, instrumentalOutput)
        print(json.dumps(metadata))

        return metadata

    def _findOutputFiles(self, outputFiles: List[str], tempDir: str) -> tuple[str, str]:
        vocalFile = None
        instrumentalFile = None

        for filePath in outputFiles:
            fullPath = os.path.join(tempDir, os.path.basename(filePath))

            if os.path.exists(fullPath):
                if "(Vocals)" in filePath:
                    vocalFile = fullPath
                elif "(Instrumental)" in filePath:
                    instrumentalFile = fullPath
            elif os.path.exists(filePath):
                if "(Vocals)" in filePath:
                    vocalFile = filePath
                elif "(Instrumental)" in filePath:
                    instrumentalFile = filePath

        if not vocalFile or not instrumentalFile:
            print(
                f"Error: Could not find vocal or instrumental files in output: {outputFiles}",
                file=sys.stderr,
            )
            sys.exit(1)

        return vocalFile, instrumentalFile

    def _generateMetadata(
        self, vocalOutput: str, instrumentalOutput: str
    ) -> Dict[str, Dict[str, str]]:
        return {
            "vocal": {
                "filename": os.path.basename(vocalOutput),
                "contentType": contentType,
            },
            "instrumental": {
                "filename": os.path.basename(instrumentalOutput),
                "contentType": contentType,
            },
        }
