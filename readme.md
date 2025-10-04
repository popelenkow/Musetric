# Musetric

Musetric is a vocal training application.

## Development

```bash
yarn
yarn dev
```

## Check

```bash
yarn
yarn check:deps
yarn check:ts
yarn check:lint
yarn check:format
yarn test
```

## Docker

```bash
yarn
yarn docker:build
yarn docker:start
```

## Third-party Components

### FFT Algorithm (CPU & GPU)

- **Source:** https://github.com/indutny/fft.js by Fedor Indutny (MIT)
- **Usage:** Fast Fourier Transform - CPU implementation adapted, GPU version ported

### BSRoformer Neural Network

- **Source:** https://github.com/lucidrains/BS-RoFormer by Phil Wang (MIT)
- **Usage:** Audio source separation model (adapted)

### Research & Development Support

- **Thanks to:** https://github.com/nomadkaraoke/python-audio-separator (MIT)
- **Usage:** Research tool that helped validate BSRoformer approach and integration patterns

## License

Musetric is [MIT licensed](https://github.com/popelenkow/Musetric/blob/main/license.md).
