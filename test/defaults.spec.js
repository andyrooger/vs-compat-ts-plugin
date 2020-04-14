const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins } = require('./tempProject');
const { THIS_PLUGIN } = require('./fixtures');

tape('cwd set to . by default', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, `Updating cwd to ${tempDir}`));
        cleanupTemp();
        t.end();
    });
});

tape('typescript mocked by default', t => {
    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});

tape('default to off if onByDefault is set off', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, onByDefault: false }
    ];
    loadAndRunPlugins({ plugins }).then(({ messagesBy, hasMessageBy }) => {
        t.notOk(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        t.notOk(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});

tape('default to on if onByDefault is set on', t => {
    const tempDir = setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, onByDefault: true }
    ];
    loadAndRunPlugins({ plugins }).then(({ messagesBy, hasMessageBy }) => {
        t.ok(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
        cleanupTemp();
        t.end();
    });
});