# vs-compat-ts-plugin

[![Node version](https://img.shields.io/node/v/vs-compat-ts-plugin.svg?style=flat)](http://nodejs.org/download/)
[![Known Vulnerabilities](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin?targetFile=package.json)
[![Dependencies](https://david-dm.org/andyrooger/vs-compat-ts-plugin.svg)](https://david-dm.org/andyrooger/vs-compat-ts-plugin)
[![Dev Dependencies](https://david-dm.org/andyrooger/vs-compat-ts-plugin/dev-status.svg)](https://david-dm.org/andyrooger/vs-compat-ts-plugin/?type=dev)

TypeScript language service plugin to let more plugins work in Visual Studio.

Many language service plugins work perfectly in VS Code, but using them in Visual Studio will break due to various niggles. Ideally these would all be fixed by the plugin maintainers but this plugin can be used as a temporary measure until then.

Installation

```shell
npm install --save-dev vs-compat-ts-plugin
```

Enable the plugin in your tsconfig.json file

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "vs-compat-ts-plugin",
        "workingDirectory": ".",
        "useVSTypescript": true
      },
      { "name": "other-plugin" },
      ...
    ]
  }
}
```

Always make sure this is the first plugin in the list, as it effects how other plugins will be loaded.

**You will likely need to restart Visual Studio for any of these settings to take effect**

## Configuration

### workingDirectory (string - default null)

This can set the working directory for the rest of the plugins. In many editors this seems to default to the workspace, but in Visual Studio it tends to be System32.

Relative to the tsconfig. Null means do not set a working directory.

### useVSTypescript (bool - default false)

By default `require('typescript')` will pick up the locally installed version of typescript. Plugins are supposed to use the version provided by the language service which will likely be different. Self contained plugins are typically fine, but those using other modules such as tslint or eslint often use require and can break if the two versions differ.

Turn this on to mock `require('typescript')` to point to the version running in the TS language service from the IDE.

## License

MIT
