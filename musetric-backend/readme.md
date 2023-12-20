Musetric Python Backend

### Scripts

Python 3.11.6

https://pytorch.org/get-started/locally/

Install
```
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
choco install python
choco install ffmpeg
choco install git
python -m pip install -U git+https://github.com/facebookresearch/demucs#egg=demucs
pip3 install torch==2.0.1+cu118 torchvision torchaudio==2.0.2+cu118 --index-url https://download.pytorch.org/whl/cu118
pip install -r requirements.txt
```
Run
```
python main.py
```
Other
```
python --version
pip list
pip freeze | Out-File -Encoding UTF8 requirements.txt
pip uninstall -r requirements.txt -y


python -m pip install --user virtualenv
pip install virtualenv
virtualenv venv --python=python2.7
python -m venv .venv
```
