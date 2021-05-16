const path = require('path');
const fs = require('fs');
const { pluginTest } = require('./helpers');
const { THIS_PLUGIN, PROJECT_FILE } = require('./fixtures');

const EXPECTED_ERROR_CODE = 5088;

function getTsConfigDiagnostics(server) {
    server.send({ command: 'semanticDiagnosticsSync', arguments: { file: PROJECT_FILE, includeLinePosition: true, projectFileName: PROJECT_FILE } }, true);
}

pluginTest('should log but not warn if plugin cannot be found in the list', {
    plugins: [
        { name: 'other-plugin' },
        { name: THIS_PLUGIN.alias }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses, hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not find the plugin in the project plugin list'));
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
    }
});

pluginTest('should warn when something precedes this plugin in plugins list', {
    plugins: [
        { name: 'other-plugin' },
        { name: THIS_PLUGIN.name }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
    }
});

pluginTest('should not warn when this plugin is first in plugins list', {
    plugins: [
        { name: THIS_PLUGIN.name },
        { name: 'other-plugin' }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
    }
});

pluginTest('should not warn when found outside the normal plugins list', {
    plugins: [
        { name: THIS_PLUGIN.name },
        { name: 'other-plugin', config: { plugins: [{ name: THIS_PLUGIN.name }] } }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
    }
});

pluginTest('should mark error across the whole plugin def object in the source', {
    plugins: [
        { name: 'other-plugin' },
        { name: THIS_PLUGIN.name }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        const response = responses[0].body[0];
        t.equal(response.code, EXPECTED_ERROR_CODE);
        const tsConfigContent = fs.readFileSync(PROJECT_FILE);
        const marked = tsConfigContent.toString().substr(response.start, response.length);
        t.equal(marked, JSON.stringify({ name: THIS_PLUGIN.name }));
    }
});

pluginTest('should be warning with a sensible message', {
    plugins: [
        { name: 'other-plugin' },
        { name: THIS_PLUGIN.name }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        t.equal(responses[0].body[0].category, 'warning');
        t.equal(responses[0].body[0].message, 'When included, vs-compat-ts-plugin should be first in the list of plugins');
    }
});

pluginTest('should find the plugin by its package name', {
    plugins: [
        { name: 'other-plugin' },
        { name: THIS_PLUGIN.name }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
    }
});

pluginTest('should not find the plugin when it appears in another plugin name', {
    plugins: [
        { name: 'not-vs-compat-ts-plugin' }
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
    }
});

pluginTest('should be ok with the plugin appearing twice if one comes first', {
    plugins: [
        { name: THIS_PLUGIN.name },
        { name: THIS_PLUGIN.name },
    ],
    serverCommands: getTsConfigDiagnostics,
    check: (t, { responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
    }
});