# <img src="https://user-images.githubusercontent.com/7475599/87945559-1c49ec80-cacb-11ea-8f24-42c0738d1dcd.png" width="26" height="26"> Musetric

[![Build Status](https://dev.azure.com/popelenkow/musetric/_apis/build/status/musetric)](https://dev.azure.com/popelenkow/musetric/_build/latest?definitionId=1)
[![npm version](https://img.shields.io/npm/v/musetric)](https://www.npmjs.com/package/musetric)
![License](https://img.shields.io/github/license/popelenkow/musetric)

[**Live Demo**](https://popelenkow.github.io/Musetric)

Musetric is a application for exploration of sounds. The application supports Web and Windows. There is support for localization and themes.

<img src="https://user-images.githubusercontent.com/7475599/104832178-d75c1280-58c1-11eb-81a5-3164b90c48cf.png">

## Features

- Recorder
- Audio Visualizer (Sonogram, Frequency, Waveform)

### in future

- Player
- Vocal Remover
- Score and Tabs Generator

## Installing

The sound analyzer module is also available as a [npm package](https://www.npmjs.com/package/musetric) you can use in your own JavaScript projects.

For the latest stable version:

```bash
npm install musetric
```

For our nightly builds:

```bash
npm install musetric@next
```

## Building

In order to build the Musetric Web Application, ensure that you have [Node.js](https://nodejs.org/) installed.

Build
```
cd web-app
yarn
yarn build
```

Dev
```bash
cd web-app
yarn
yarn dev
```

## Licence

Musetric is [MIT licensed](licence.txt).