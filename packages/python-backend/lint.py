import subprocess
import sys

script = "ruff check . --fix --no-cache && isort . && black ."

sys.exit(subprocess.run(script, shell=True).returncode)
