const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins } = require('./tempProject');
const { THIS_PLUGIN, LOG_CWD_PLUGIN, LOG_LOADTIME_CWD_PLUGIN } = require('./fixtures');

tape('cwd is set before the next plugin init', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = path.resolve(__dirname, '..', '..');

    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: pluginCwd },
        { name: LOG_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, pluginCwd));
        cleanupTemp();
        t.end();
    });
});

tape('cwd is set before the next plugin is loaded', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = path.resolve(__dirname, '..', '..');

    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: pluginCwd },
        { name: LOG_LOADTIME_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_LOADTIME_CWD_PLUGIN.name, pluginCwd));
        cleanupTemp();
        t.end();
    });
});

tape('cwd not changed when null', t => {
    const serverCwd = path.resolve(__dirname, '..');

    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: null },
        { name: LOG_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, serverCwd));
        cleanupTemp();
        t.end();
    });
});

tape('invalid cwd does not break everything else', t => {
    const serverCwd = path.resolve(__dirname, '..');

    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, workingDirectory: '/\\not.*valid' },
        { name: LOG_CWD_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not set working directory'));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Meddling completed'));
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, serverCwd));
        cleanupTemp();
        t.end();
    });
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