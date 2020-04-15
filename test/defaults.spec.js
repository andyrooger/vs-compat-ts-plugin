const { pluginTest } = require('./helpers');
const { THIS_PLUGIN, PROJECT_DIR } = require('./fixtures');

pluginTest('cwd set to . by default', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, `Updating cwd to ${PROJECT_DIR}`));
    }
});

pluginTest('typescript mocked by default', {
    plugins: [
        { name: THIS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
    }
});

pluginTest('default to off if onByDefault is set off', {
    plugins: [
        { name: THIS_PLUGIN.path, onByDefault: false }
    ],
    check: (t, { hasMessageBy, messagesBy }) => {
        t.notOk(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        t.notOk(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
    }
});

pluginTest('default to on if onByDefault is set on', {
    plugins: [
        { name: THIS_PLUGIN.path, onByDefault: true }
    ],
    check: (t, { hasMessageBy, messagesBy }) => {
        t.ok(messagesBy(THIS_PLUGIN.name).some(msg => /Updating cwd/.test(msg)));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Mocking typescript module with the version from tsserver'));
    }
});