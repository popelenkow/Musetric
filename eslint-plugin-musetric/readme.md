# eslint-plugin-musetric

[![example branch parameter](https://github.com/popelenkow/Musetric/actions/workflows/eslint-config-musetric.yml/badge.svg?branch=develop)](https://github.com/popelenkow/Musetric/actions/workflows/eslint-config-musetric.yml)

This package provides musetric's .eslintrc as an extensible shared config.

## Develop

Write custom eslint rules. Check it by https://astexplorer.net/

## Usage

We export three ESLint configurations for musetric project usage.

### eslint-plugin-musetric

Our default export contains all of ESLint rules based on [eslint-config-airbnb](https://npmjs.com/eslint-config-airbnb), including ECMAScript 6+ and React. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-jsx-a11y`.

1. Install package:

```sh
yarn add --dev eslint-plugin-musetric
```

2. Add to your `.eslintrc`:

```js
module.exports = {
	plugins: [
		'musetric',
	],
	extends: [
		'plugin:musetric/recommended',
	],
}
```