import numpy as np


def normalize(wave, max_peak=1.0, min_peak=None):
    """Normalize (or amplify) audio waveform to a specified peak value.

    Args:
        wave (array-like): Audio waveform.
        max_peak (float): Maximum peak value for normalization.

    Returns:
        array-like: Normalized or original waveform.
    """
    maxv = np.abs(wave).max()
    if maxv > max_peak:
        wave *= max_peak / maxv
    elif min_peak is not None and maxv < min_peak:
        wave *= min_peak / maxv

    return wave


def match_array_shapes(source_array, target_array):
    """
    Match the shape of the source array to the target array.
    """
    if source_array.shape != target_array.shape:
        if source_array.shape[1] > target_array.shape[1]:
            source_array = source_array[:, : target_array.shape[1]]
        elif source_array.shape[1] < target_array.shape[1]:
            padding = target_array.shape[1] - source_array.shape[1]
            source_array = np.pad(source_array, ((0, 0), (0, padding)), mode="constant")

    return source_array
