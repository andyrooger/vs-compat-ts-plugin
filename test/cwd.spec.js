const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, createTempPlugin } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');
const thisPluginName = 'vs-compat-ts-plugin';
const testPluginName = 'test-plugin';

tape('cwd is set before the next plugin init', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = path.resolve(__dirname, '..', '..');

    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin, workingDirectory: pluginCwd },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(testPluginName, pluginCwd));
        cleanupTemp();
        t.end();
    });
});

tape('cwd is set before the next plugin is loaded', t => {
    const serverCwd = path.resolve(__dirname, '..');
    const pluginCwd = path.resolve(__dirname, '..', '..');

    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(topCwd);
    }, 'const topCwd = process.cwd();');
    const plugins = [
        { name: thisPlugin, workingDirectory: pluginCwd },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(testPluginName, pluginCwd));
        cleanupTemp();
        t.end();
    });
});

tape('cwd not changed when null', t => {
    const serverCwd = path.resolve(__dirname, '..');

    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin, workingDirectory: null },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(testPluginName, serverCwd));
        cleanupTemp();
        t.end();
    });
});

tape('invalid cwd does not break everything else', t => {
    const serverCwd = path.resolve(__dirname, '..');

    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin, workingDirectory: '/\\not.*valid' },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(thisPluginName, 'Could not set working directory'));
        t.ok(hasMessageBy(thisPluginName, 'Meddling completed'));
        t.ok(hasMessageBy(testPluginName, serverCwd));
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
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin, workingDirectory: pluginCwd },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(testPluginName, fullPluginCwd));
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
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin, workingDirectory: pluginCwd },
        { name: testPlugin }
    ];
    loadAndRunPlugins({ plugins, serverCwd }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(testPluginName, fullPluginCwd));
        cleanupTemp();
        t.end();
    });
});