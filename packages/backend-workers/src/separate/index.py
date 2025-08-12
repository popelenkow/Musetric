import argparse

from separate.separation import AudioSeparator
from separate.systemInfo import (
    ensureFfmpeg,
    printAccelerationInfo,
    setupTorchOptimization,
)


def main() -> None:
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

    args = parser.parse_args()

    ensureFfmpeg()
    printAccelerationInfo()
    setupTorchOptimization()


    separator = AudioSeparator()
    separator.separateAudio(
        inputPath=args.input,
        vocalOutput=args.vocal_output,
        instrumentalOutput=args.instrumental_output,
    )


if __name__ == "__main__":
    main()
