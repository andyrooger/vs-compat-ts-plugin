# vs-compat-ts-plugin

[![Known Vulnerabilities](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin/badge.svg?targetFile=package.json)](https://snyk.io/test/github/andyrooger/vs-compat-ts-plugin?targetFile=package.json)
[![Build](https://circleci.com/gh/andyrooger/vs-compat-ts-plugin.svg?style=shield)](https://circleci.com/gh/andyrooger/vs-compat-ts-plugin)
[![Dependencies](https://david-dm.org/andyrooger/vs-compat-ts-plugin.svg)](https://david-dm.org/andyrooger/vs-compat-ts-plugin)
[![Dev Dependencies](https://david-dm.org/andyrooger/vs-compat-ts-plugin/dev-status.svg)](https://david-dm.org/andyrooger/vs-compat-ts-plugin/?type=dev)

TypeScript language service plugin to let more plugins work in Visual Studio.

Many language service plugins work perfectly in VS Code, but using them in Visual Studio will break due to various niggles. Ideally these would all be fixed without hacks like this but this plugin can be used as a temporary measure until then.

## Installation

```shell
npm install --save-dev vs-compat-ts-plugin
```

Enable the plugin in your tsconfig.json file

```json
{
  "compilerOptions": {
    "plugins": [
      { "name": "vs-compat-ts-plugin" },
      { "name": "other-plugin" },
      ...
    ]
  }
}
```

or with configuration as

```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "vs-compat-ts-plugin",
        "workingDirectory": ".",
        "useVSTypescript": true,
        "onByDefault": true
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

**workingDirectory (string or null - default '.')**

This can set the working directory for the rest of the plugins. In many editors this seems to default to the workspace, but in Visual Studio it tends to be System32.

Relative to the tsconfig. Null means do not set a working directory.

**useVSTypescript (bool - default true)**

Language service plugins should be using the version of typescript that's passed to them by tsserver. Tools they use, such as linters, tend to use the standard `require('typescript')` to pick up typescript.
When tsserver is running from local npm depencencies, this is fine and both typescripts will be the same module. In Visual Studio, tsserver runs from a separate installation and so these modules are likely to be different. The result is various difficult to diagnose errors in plugins.

This option mocks `require('typescript')` so that tools pick up the same typescript version that tsserver is running from.

**onByDefault (bool - default true)**

By default, all options are enabled with sensible defaults. This means new features could be enabled in minor releases updates. These changes should not break functionality but since this whole plugin is a hack, there is a small risk. If you don't want this behaviour, turn this option off. You can then enable features individually.

## License

MIT
