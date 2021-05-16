const { pluginTest } = require('./helpers');
const { THIS_PLUGIN, PROJECT_DIR } = require('./fixtures');

pluginTest('cwd set to . by default', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { assertHasMessageBy }) => {
        assertHasMessageBy(THIS_PLUGIN.name, `Updating cwd to ${PROJECT_DIR}`);
    }
});

pluginTest('typescript mocked by default', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { assertHasMessageBy }) => {
        assertHasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver');
    }
});

pluginTest('default to off if onByDefault is set off', {
    plugins: [
        { name: THIS_PLUGIN.path, onByDefault: false }
    ],
    check: (t, { assertNotHasMessageBy, messagesBy }) => {
        t.notOk(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        assertNotHasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver');
    }
});

pluginTest('default to on if onByDefault is set on', {
    plugins: [
        { name: THIS_PLUGIN.path, onByDefault: true }
    ],
    check: (t, { assertHasMessageBy, messagesBy }) => {
        t.ok(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        assertHasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver');
    }
});