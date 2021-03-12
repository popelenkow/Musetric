# <img src="https://user-images.githubusercontent.com/7475599/87945559-1c49ec80-cacb-11ea-8f24-42c0738d1dcd.png" width="26" height="26"> Musetric Application

[![example branch parameter](https://github.com/popelenkow/Musetric/actions/workflows/musetric-app.yml/badge.svg?branch=develop)](https://github.com/popelenkow/Musetric/actions/workflows/musetric.yml)
[![npm version](https://img.shields.io/npm/v/musetric-app)](https://www.npmjs.com/package/musetric-app)
![License](https://img.shields.io/github/license/popelenkow/musetric)

[**Live Demo**](https://popelenkow.github.io/Musetric)

Musetric is a application for exploration of sounds. The application supports Web and Windows. There is support for localization and themes.

<img src="https://user-images.githubusercontent.com/7475599/104832178-d75c1280-58c1-11eb-81a5-3164b90c48cf.png">

# Features

- Recorder
- Audio Visualizer (Sonogram, Frequency, Waveform)

## in future

- Player
- Vocal Remover
- Score and Tabs Generator

# Using

Docker pull & run
```
docker pull popelenkow/musetric:latest
docker run -p 8080:3000 -d popelenkow/musetric:latest
```
# Building

Electron application with react & typescript & sass & webpack. Node >= v12.

Build
```bash
yarn
yarn build
```

Dev
```bash
yarn
yarn dev
```

Docker build & run
```bash
docker build -t musetric .
docker run -p 8080:3000 -d musetric
```

# Licence

Musetric is [MIT licensed](licence.txt).