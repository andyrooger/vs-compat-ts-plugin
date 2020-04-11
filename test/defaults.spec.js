const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, createTempPlugin } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');
const thisPluginName = 'vs-compat-ts-plugin';

tape('cwd set to . by default', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: thisPlugin }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ messagesBy }) => {
        t.ok(messagesBy(thisPluginName).indexOf(`Updating cwd to ${tempDir}`) !== -1);
        cleanupTemp();
        t.end();
    });
});

tape('typescript mocked by default', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ messagesBy }) => {
        t.ok(messagesBy(thisPluginName).indexOf('Mocking typescript module with the version from tsserver') !== -1);
        cleanupTemp();
        t.end();
    });
});