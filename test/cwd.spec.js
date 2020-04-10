const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, createTempPlugin } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');
const thisPluginName = 'vs-compat-ts-plugin';
const testPluginName = 'test-plugin';

tape('cwd is set before the next plugin is run', t => {
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
    loadAndRunPlugins(plugins, serverCwd).then(({ messagesBy }) => {
        t.ok(messagesBy(testPluginName).indexOf(pluginCwd) !== -1);
        cleanupTemp();
        t.end();
    });
});

tape('cwd not changed when not provided', t => {
    const serverCwd = path.resolve(__dirname, '..');

    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, log => {
        log(process.cwd());
    });
    const plugins = [
        { name: thisPlugin },
        { name: testPlugin }
    ];
    loadAndRunPlugins(plugins, serverCwd).then(({ messagesBy }) => {
        t.ok(messagesBy(testPluginName).indexOf(serverCwd) !== -1);
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
    loadAndRunPlugins(plugins, serverCwd).then(({ messagesBy }) => {
        t.ok(messagesBy(thisPluginName).indexOf('Meddling completed') !== -1);
        t.ok(messagesBy(testPluginName).indexOf(serverCwd) !== -1);
        cleanupTemp();
        t.end();
    });
});

tape('cwd relative to the working directory', t => {
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
    loadAndRunPlugins(plugins, serverCwd).then(({ messagesBy }) => {
        t.ok(messagesBy(testPluginName).indexOf(fullPluginCwd) !== -1);
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
    loadAndRunPlugins(plugins, serverCwd).then(({ messagesBy }) => {
        t.ok(messagesBy(testPluginName).indexOf(fullPluginCwd) !== -1);
        cleanupTemp();
        t.end();
    });
});