const path = require('path');

module.exports = {
    THIS_PLUGIN: {
        name: 'vs-compat-ts-plugin',
        path: path.resolve(__dirname, '..', '..', 'index.js'),
        namelessPath: '../index.js' // For loading the plugin without having the package name in the path
    },
    LOG_CWD_PLUGIN: {
        name: 'logCwdPlugin', path: path.resolve(__dirname, 'plugins', 'logCwdPlugin.js')
    },
    LOG_LOADTIME_CWD_PLUGIN: {
        name: 'logLoadtimeCwdPlugin', path: path.resolve(__dirname, 'plugins', 'logLoadtimeCwdPlugin.js')
    },
    LOG_TS_VERSIONS_PLUGIN: {
        name: 'logTsVersionsPlugin', path: path.resolve(__dirname, 'plugins', 'logTsVersionsPlugin.js')
    },
    LOG_TOP_TS_VERSIONS_PLUGIN: {
        name: 'logTopTsVersionsPlugin', path: path.resolve(__dirname, 'plugins', 'logTopTsVersionsPlugin.js')
    },
    BREAK_MOCK_REQUIRE_PLUGIN: {
        name: 'breakMockRequirePlugin', path: path.resolve(__dirname, 'plugins', 'breakMockRequirePlugin.js')
    },
    TS_VERSIONS: { 
        '3.8': { version: '3.8.3', path: path.resolve(__dirname, '..', '..', 'node_modules', 'typescript38') },
        'default': { version: '3.7.5', path: path.resolve(__dirname, '..', '..', 'node_modules', 'typescript') }
    }
};