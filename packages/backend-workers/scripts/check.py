import subprocess
import sys


def runCommands(commands):
    for cmd in commands:
        if isinstance(cmd, str):
            result = subprocess.run(cmd, shell=True)
        else:
            result = subprocess.run(cmd)

        if result.returncode != 0:
            sys.exit(1)


def check():
    commands = [
        "uv run ruff check . --no-cache",
        "uv run isort . --check-only",
        "uv run black . --check",
    ]
    runCommands(commands)


def fix():
    commands = [
        ["ruff", "check", ".", "--fix", "--no-cache"],
        ["isort", "."],
        ["black", "."],
    ]
    runCommands(commands)
