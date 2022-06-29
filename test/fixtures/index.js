const path = require('path');

module.exports = {
    THIS_PLUGIN: {
        name: 'vs-compat-ts-plugin',
        path: 'vs-compat-ts-plugin',
        alias: '@vs-compat-ts-plugin/this'
    },
    LOG_CWD_PLUGIN: {
        name: 'logCwdPlugin', path: '@vs-compat-ts-plugin/log-cwd-plugin'
    },
    LOG_LOADTIME_CWD_PLUGIN: {
        name: 'logLoadtimeCwdPlugin', path: '@vs-compat-ts-plugin/log-loadtime-cwd-plugin'
    },
    LOG_TS_VERSIONS_PLUGIN: {
        name: 'logTsVersionsPlugin', path: '@vs-compat-ts-plugin/log-ts-versions-plugin'
    },
    LOG_TOP_TS_VERSIONS_PLUGIN: {
        name: 'logTopTsVersionsPlugin', path: '@vs-compat-ts-plugin/log-top-ts-versions-plugin'
    },
    BREAK_MOCK_REQUIRE_PLUGIN: {
        name: 'breakMockRequirePlugin', path: '@vs-compat-ts-plugin/break-mock-require-plugin'
    },
    TS_VERSIONS: { 
        // Latest and oldest of each major release
        '4.2': { version: '4.7.4', path: path.resolve(__dirname, 'workspace', 'node_modules', 'typescript47') },
        '4.0': { version: '4.0.7', path: path.resolve(__dirname, 'workspace', 'node_modules', 'typescript40') },
        '3.9': { version: '3.9.9', path: path.resolve(__dirname, 'workspace', 'node_modules', 'typescript39') },
        '3.0': { version: '3.0.1', path: path.resolve(__dirname, 'workspace', 'node_modules', 'typescript30') },
        '2.9': { version: '2.9.1', path: path.resolve(__dirname, 'workspace', 'node_modules', 'typescript29') },
         // Can't go back further than 2.9 because the tsconfig warnings stop appearing

        // Has to be a different version to all the others for the tsversion tests
        'default': { version: '3.7.5', path: path.resolve(__dirname, '..', '..', 'node_modules', 'typescript') }
    },
    EMPTY_DIRS: [
        path.resolve(__dirname, 'dirs', 'dir1'),
        path.resolve(__dirname, 'dirs', 'dir2')
    ],
    PROJECT_DIR: path.resolve(__dirname, 'workspace'),
    PROJECT_FILE: path.resolve(__dirname, 'workspace', 'tsconfig.json'),
    PROJECT_CONTENT: path.resolve(__dirname, 'workspace', 'file.ts')
};