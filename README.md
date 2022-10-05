<h1 align="center">
  <a href="https://github.com/colorfy-software/detoxify/" target="_blank" rel="noopener noreferrer">
    🧪 Detoxify
  </a>
</h1>

<h4 align="center">
  <strong>Useful helpers for E2E testing in React Native with Detox.</strong>
</h4>

<p align="center">
  <a href="https://github.com/colorfy-software/detoxify/actions">
    <img src="https://github.com/colorfy-software/detoxify/workflows/Test%20Suite/badge.svg?branch=main" alt="Current GitHub Actions build status." />
  </a>
  <a href="https://www.npmjs.org/package/@colorfy-software/detoxify">
    <img src="https://badge.fury.io/js/@colorfy-software%2Fdetoxify.svg" alt="Current npm package version." />
  </a>
  <a href="https://github.com/colorfy-software/detoxify/contributing">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>

## 🎯 Purpose

[Detox](https://wix.github.io/Detox/) is a library that provides gray box end-to-end testing and automation for React Native apps. Detoxify has been built on top of it to provide a useful set of tools to make that experience even more delightful.

## 🏗️ Installation

```sh
yarn add @colorfy-software/detoxify
```

Also install and set up:

1. [detox](https://wix.github.io/Detox/docs/introduction/getting-started)
2. [jest](https://wix.github.io/Detox/docs/guide/jest)


## 💻 Usage

### Setup

```ts
// ./e2e/environment.js

const DetoxHelpers = require('@colorfy-software/detoxify')
const { DetoxCircusEnvironment, SpecReporter, WorkerAssignReporter } = require('detox/runners/jest-circus')

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context)

    // 👇👇👇
    DetoxHelpers.init({
      translations: require('../src/locales/en.ts'),
      // optional
      // runOnly: []
    })
    // 👆👆👆

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter,
    })
  }
}

module.exports = CustomDetoxEnvironment
```

### Use cases

_Content coming soon._

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 💖 Code of Conduct

This library has adopted a Code of Conduct that we expect project participants to adhere to. Please read the [full text](https://github.com/colorfy-software/detoxify/blob/main/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## 📰 License

detoxify is licensed under the [MIT License](https://github.com/colorfy-software/detoxify/blob/master/LICENSE).
