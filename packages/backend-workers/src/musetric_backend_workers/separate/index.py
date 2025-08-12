import argparse

from musetric_backend_workers.separate.separation import AudioSeparator
from musetric_backend_workers.separate.system_info import (
    ensure_ffmpeg,
    print_acceleration_info,
    setup_torch_optimization,
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

    ensure_ffmpeg()
    print_acceleration_info()
    setup_torch_optimization()

    separator = AudioSeparator()
    separator.separate_audio(
        input_path=args.input,
        vocal_output=args.vocal_output,
        instrumental_output=args.instrumental_output,
    )


if __name__ == "__main__":
    main()
