# Musetric

Musetric is a vocal training application.

## Development

```bash
yarn
yarn gen:db
yarn dev
```

## Check

```bash
yarn
yarn gen:db
yarn check:ts
yarn check:lint
yarn check:format
```

### Audio player package

For `@musetric/audio-in-out` you can run the same checks only for this
package:

```bash
yarn workspace @musetric/audio-in-out check:ts
yarn workspace @musetric/audio-in-out check:lint
```

## Docker

```bash
yarn build:frontend
yarn build:docker
yarn start:docker
```

## License

Musetric is [MIT licensed](https://github.com/popelenkow/Musetric/blob/main/license.md).
