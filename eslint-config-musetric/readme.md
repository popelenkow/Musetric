# eslint-config-musetric

This package provides musetric's .eslintrc as an extensible shared config.

## Usage

We export three ESLint configurations for musetric project usage.

### eslint-config-musetric

Our default export contains all of ESLint rules based on [eslint-config-airbnb](https://npmjs.com/eslint-config-airbnb), including ECMAScript 6+ and React. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y`.

1. Install package:

```sh
yarn add --dev eslint-config-musetric
```

2. Add `"extends": "musetric"` to your `.eslintrc`