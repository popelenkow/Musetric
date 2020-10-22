[![Build Status](https://dev.azure.com/popelenkow/musetric/_apis/build/status/web)](https://dev.azure.com/popelenkow/musetric/_build/latest?definitionId=2)
![License](https://img.shields.io/github/license/popelenkow/musetric)

# <img src="https://user-images.githubusercontent.com/7475599/87945559-1c49ec80-cacb-11ea-8f24-42c0738d1dcd.png" width="26" height="26"> Musetric Web Application

Musetric is a web application for exploration of sounds. There is support for localization and themes. 

At the moment, the application is at the initial stage of development, so can play the game of life and wait for updates :)

<img src="https://user-images.githubusercontent.com/7475599/87945435-ec024e00-caca-11ea-8c82-0bc8920bcb0e.png">

## Vision

- Sound spectrum visualization
- Playing and recording the staff (tab)

## Using

Docker pull & run
```
docker pull popelenkow/musetric:latest
docker run -p 8080:3000 -d popelenkow/musetric:latest
```
## Development

Electron application with react & typescript & sass & webpack. Node >= v12.

Dev
```
yarn
yarn dev
```

Build
```
yarn
yarn build
```

Docker build & run
```
docker build -t musetric .
docker run -p 8080:3000 -d musetric
```

## Licence

Musetric is [MIT licensed](licence.txt).