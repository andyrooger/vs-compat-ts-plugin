const { pluginTest } = require('./helpers');
const { THIS_PLUGIN } = require('./fixtures');

pluginTest('loads successfully', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { assertHasMessageBy }) => {
        assertHasMessageBy(THIS_PLUGIN.name, 'Loaded plugin');
    }
});