const { pluginTest } = require('./tempProject');
const { THIS_PLUGIN } = require('./fixtures');

pluginTest('loads successfully', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Loaded plugin'));
    }
});