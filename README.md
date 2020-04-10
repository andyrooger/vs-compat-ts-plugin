# vs-compat-ts-plugin

[![Known Vulnerabilities](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin?targetFile=package.json)
[![Build](https://circleci.com/gh/andyrooger/vs-compat-ts-plugin.svg?style=shield)](https://circleci.com/gh/andyrooger/vs-compat-ts-plugin)
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
        "workingDirectory": "."
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

**workingDirectory (string - default null)**

This can set the working directory for the rest of the plugins. In many editors this seems to default to the workspace, but in Visual Studio it tends to be System32.

Relative to the tsconfig. Null means do not set a working directory.

## License

MIT
