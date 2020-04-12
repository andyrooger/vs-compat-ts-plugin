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
    loadAndRunPlugins(plugins, __dirname).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(thisPluginName, `Updating cwd to ${tempDir}`));
        cleanupTemp();
        t.end();
    });
});

tape('typescript mocked by default', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(thisPluginName, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});

tape('default to off if onByDefault is set off', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: thisPlugin, onByDefault: false }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ messagesBy, hasMessageBy }) => {
        t.notOk(messagesBy(thisPluginName).some(msg => /Updating cwd/.test(msg)));
        t.notOk(hasMessageBy(thisPluginName, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});

tape('default to on if onByDefault is set on', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: thisPlugin, onByDefault: true }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ messagesBy, hasMessageBy }) => {
        t.ok(messagesBy(thisPluginName).some(msg => /Updating cwd/.test(msg)));
        t.ok(hasMessageBy(thisPluginName, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});