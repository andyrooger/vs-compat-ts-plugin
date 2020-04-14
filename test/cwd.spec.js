const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, pluginTest } = require('./tempProject');
const { THIS_PLUGIN, LOG_CWD_PLUGIN, LOG_LOADTIME_CWD_PLUGIN } = require('./fixtures');

const SERVER_CWD = path.resolve(__dirname, '..');
const PLUGIN_CWD = path.resolve(__dirname, '..', '..');

pluginTest('cwd is set before the next plugin init', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: PLUGIN_CWD },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});

pluginTest('cwd is set before the next plugin is loaded', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: PLUGIN_CWD },
        { name: LOG_LOADTIME_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_LOADTIME_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});

pluginTest('cwd not changed when null', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: null },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, SERVER_CWD));
    }
});

pluginTest('invalid cwd does not break everything else', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: '/\\not.*valid' },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not set working directory'));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Meddling completed'));
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, SERVER_CWD));
    }
});

tape('cwd relative to the tsconfig directory', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = path.join('.', 'workingDir');

    const tempDir = setupTemp();
    const fullPluginCwd = path.resolve(tempDir, pluginCwd);
    fs.mkdirSync(fullPluginCwd);
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: pluginCwd },
        { name: LOG_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, fullPluginCwd));
        cleanupTemp();
        t.end();
    });
});

tape('cwd can use forward slashes (in all OS)', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = './workingDirectory';

    const tempDir = setupTemp();
    const fullPluginCwd = path.resolve(tempDir, pluginCwd);
    fs.mkdirSync(fullPluginCwd);
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: pluginCwd },
        { name: LOG_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, fullPluginCwd));
        cleanupTemp();
        t.end();
    });
});