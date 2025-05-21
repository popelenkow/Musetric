import subprocess
import sys

port = sys.argv[1] if len(sys.argv) > 1 else "3001"
script = f"fastapi dev musetric/index.py --host 0.0.0.0 --port {port}"

sys.exit(subprocess.run(script, shell=True).returncode)
