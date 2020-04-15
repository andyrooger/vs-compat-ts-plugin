const tape = require('tape');
const { pluginTest } = require('./tempProject');
const { THIS_PLUGIN, LOG_TS_VERSIONS_PLUGIN, LOG_TOP_TS_VERSIONS_PLUGIN, BREAK_MOCK_REQUIRE_PLUGIN, TS_VERSIONS } = require('./fixtures');

const serverTs = TS_VERSIONS['3.8'];

tape('typescript standard package must be different version than the one tsserver is running from', t => {
    t.notEqual(serverTs.version, TS_VERSIONS.default.version);
    t.end();
});

pluginTest('typescript not mocked if useVSTypescript is false', {
    typescriptServerDir: serverTs.path,
    plugins: [
        { name: THIS_PLUGIN.path, useVSTypescript: false },
        { name: LOG_TS_VERSIONS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `required: ${TS_VERSIONS.default.version}`));
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `plugin: ${serverTs.version}`));
    }
});

pluginTest('typescript is mocked if useVSTypescript is true', {
    typescriptServerDir: serverTs.path,
    plugins: [
        { name: THIS_PLUGIN.path, useVSTypescript: true },
        { name: LOG_TS_VERSIONS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `required: ${serverTs.version}`));
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `plugin: ${serverTs.version}`));
    }
});

pluginTest('typescript is mocked even at the top level of other plugins if useVSTypescript is true', {
    typescriptServerDir: serverTs.path,
    plugins: [
        { name: THIS_PLUGIN.path, useVSTypescript: true },
        { name: LOG_TOP_TS_VERSIONS_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TOP_TS_VERSIONS_PLUGIN.name, `required: ${serverTs.version}`));
        t.ok(hasMessageBy(LOG_TOP_TS_VERSIONS_PLUGIN.name, `plugin: ${serverTs.version}`));
    }
});

pluginTest('failed typescript mock does not break the plugin', {
    typescriptServerDir: serverTs.path,
    plugins: [
        { name: BREAK_MOCK_REQUIRE_PLUGIN.path },
        { name: THIS_PLUGIN.path, useVSTypescript: true }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not mock typescript'));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Meddling completed'));
    }
});