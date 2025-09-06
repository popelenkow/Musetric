import argparse

from musetricBackendWorkers.common.envs import envs
from musetricBackendWorkers.common.logger import setupLogging
from musetricBackendWorkers.separateAudio.bsRoformerSeparator import BSRoformerSeparator
from musetricBackendWorkers.separateAudio.systemInfo import (
    ensureFfmpeg,
    printAccelerationInfo,
    setupTorchOptimization,
)


def parseArguments():
    parser = argparse.ArgumentParser(
        description="Separate audio into vocal and instrumental parts"
    )
    parser.add_argument("--input", required=True, help="Path to input audio file")
    parser.add_argument(
        "--vocal-output", required=True, help="Path for vocal output file"
    )
    parser.add_argument(
        "--instrumental-output", required=True, help="Path for instrumental output file"
    )
    parser.add_argument(
        "--log-level",
        default="info",
        choices=["debug", "info", "warn", "error"],
        help="Set the logging level",
    )

    return parser.parse_args()


def main() -> None:
    args = parseArguments()

    setupLogging(args.log_level)
    ensureFfmpeg()
    printAccelerationInfo()
    setupTorchOptimization()

    separator = BSRoformerSeparator(
        modelsDir=envs.modelsDir,
        modelName=envs.model,
        sampleRate=envs.sampleRate,
        outputFormat=envs.outputFormat,
        contentType=envs.contentType,
    )
    separator.separateAudio(
        inputPath=args.input,
        vocalOutput=args.vocal_output,
        instrumentalOutput=args.instrumental_output,
    )


if __name__ == "__main__":
    main()
