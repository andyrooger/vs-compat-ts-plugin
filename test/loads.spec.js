const path = require('path');
const tape = require('tape');
const { loadAndRunPlugins } = require('./tempProject');


tape('loads successfully', t => {
    const plugins = [{
        name: path.resolve(__dirname, '../index.js')
    }];
    loadAndRunPlugins(plugins, __dirname).then((logContent) => {
        t.match(logContent, /\[vs-compat-ts-plugin\] loaded/)
        t.end();
    });
});