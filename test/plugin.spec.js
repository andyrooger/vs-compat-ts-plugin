const path = require('path');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins } = require('./tempProject');
const { THIS_PLUGIN } = require('./fixtures');

tape('loads successfully', t => {
    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Loaded plugin'));
        cleanupTemp();
        t.end();
    });
});