[![npm version](https://badge.fury.io/js/device-rotation-prompt.svg)](https://badge.fury.io/js/device-rotation-prompt)
[![docs](https://badgen.net/badge/docs/online/orange)](https://device-rotation-prompt.netlify.app)
![npm bundle size](https://img.shields.io/bundlephobia/min/device-rotation-prompt)
![NPM](https://img.shields.io/npm/l/device-rotation-prompt)
[![GitHub Workflow Status](https://github.com/raiper34/device-rotation-prompt/actions/workflows/test.yml/badge.svg)](https://github.com/Raiper34/device-rotation-prompt)
[![Coverage Status](https://coveralls.io/repos/github/Raiper34/device-rotation-prompt/badge.svg?branch=main)](https://coveralls.io/github/Raiper34/device-rotation-prompt?branch=main)
[![npm](https://img.shields.io/npm/dt/device-rotation-prompt)](https://badge.fury.io/js/device-rotation-prompt)
[![npm](https://img.shields.io/npm/dm/device-rotation-prompt)](https://badge.fury.io/js/device-rotation-prompt)
[![npm](https://img.shields.io/npm/dw/device-rotation-prompt)](https://badge.fury.io/js/device-rotation-prompt)
[![](https://data.jsdelivr.com/v1/package/npm/device-rotation-prompt/badge?style=rounded)](https://www.jsdelivr.com/package/npm/device-rotation-prompt)
[![GitHub Repo stars](https://img.shields.io/github/stars/raiper34/device-rotation-prompt)](https://github.com/Raiper34/device-rotation-prompt)

# Device rotation prompt

The device rotation prompt is the library to show a fullscreen prompt message when device orientation is different than you expect.
It is designed to be used in html5 games, but it can be used on any website.

### Content
- [🚀 Installation](#-instalation)
- [📚 Documentation](#-documentation)
- [💻 Usage](#-usage)
- [⚖️ License](#-license)

# 🚀 Instalation
Install **Device rotation prompt** library using `npm`
```sh
npm install device-rotation-prompt --save
```
and import library like
```ts
import {DeviceRotationPrompt} from "device-rotation-prompt";
```
Or add directly into an HTML file with `jsdelivr` CDN
```html
<script src="https://cdn.jsdelivr.net/npm/device-rotation-prompt@4.0.0/dist/device-rotation-prompt.iife.js"></script>
<script>
  const DeviceRotationPrompt = deviceRotationPrompt.DeviceRotationPrompt;
  ...
</script>
```

# 📚 Documentation
For more details and complete documentation check: https://device-rotation-prompt.netlify.app/

# 💻 Usage
If you do not need to configure and the default style and setting are enough, you can just instantiate the class and you are done.
```javascript
const prompt = new DeviceRotationPrompt();
```
and you get

![Device rotation prompt demo](demo.gif)

If you do not need this functionality anymore, you can destroy it using `destroy` method.
```javascript
prompt.destroy();
```

If you want to configure the behavior and style of the prompt, you can pass the config object during instantiation.
```javascript
const prompt = new DeviceRotationPrompt({
    orientation: DeviceOrientation.Landscape,
    backgroundColor: '#000000',
    imageColor: '#ffffff',
    ...
});
```
The properties are as follows and all are optional: https://device-rotation-prompt.netlify.app/interfaces/iconfig

# ⚖️ License
[MIT](https://choosealicense.com/licenses/mit/)