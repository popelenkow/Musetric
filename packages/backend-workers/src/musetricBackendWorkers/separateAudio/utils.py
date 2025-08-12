import numpy as np


def normalize(wave, maxPeak, minPeak):
    maxVal = np.abs(wave).max()
    if maxVal > maxPeak:
        return wave * (maxPeak / maxVal)
    if minPeak is not None and maxVal < minPeak:
        return wave * (minPeak / maxVal)
    return wave


def matchArrayShapes(sourceArray, targetArray):
    if sourceArray.shape == targetArray.shape:
        return sourceArray

    sourceLen = sourceArray.shape[1]
    targetLen = targetArray.shape[1]

    if sourceLen > targetLen:
        return sourceArray[:, :targetLen]
    if sourceLen < targetLen:
        padding = ((0, 0), (0, targetLen - sourceLen))
        return np.pad(sourceArray, padding, mode="constant")

    return sourceArray
