const path = require('path');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');

tape('loads successfully', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin }
    ];
    loadAndRunPlugins(plugins, __dirname).then(({ messagesBy }) => {
        t.ok(messagesBy('vs-compat-ts-plugin').indexOf('Loaded plugin') !== -1);
        cleanupTemp();
        t.end();
    });
});