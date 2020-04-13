const path = require('path');
const fs = require('fs');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, createTempPlugin } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');
const thisPluginName = 'vs-compat-ts-plugin';
const testPluginName = 'test-plugin';
const EXPECTED_ERROR_CODE = 5088;

function runServerCommands(server, fakeFile, projectFile) {
    server.send({ command: 'semanticDiagnosticsSync', arguments: { file: projectFile, includeLinePosition: true, projectFileName: projectFile } }, true);
}

tape('plugin path contains plugin name', t => {
    t.notEqual(thisPlugin.indexOf(thisPluginName), -1, 'The repo must be checked out in a folder containing the plugin name for these tests to work');
    t.end();
});

tape('should warn when something precedes this plugin in plugins list', t => {
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: thisPlugin }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        cleanupTemp();
        t.end();
    });
});

tape('should not warn when this plugin is first in plugins list', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin },
        { name: testPluginName }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
        cleanupTemp();
        t.end();
    });
});

tape('should log but not warn if plugin cannot be found in the list', t => {
    const thisPluginWithoutName = '../index.js'; // Can't be spotted because it does not contain the plugin name
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: thisPluginWithoutName }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses, hasMessageBy }) => {
        t.ok(hasMessageBy(thisPluginName, 'Could not find the plugin in the project plugin list'));
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
        cleanupTemp();
        t.end();
    });
});

tape('should not warn when found outside the normal plugins list', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin },
        { name: testPluginName, config: { plugins: [{ name: thisPlugin }] } }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
        cleanupTemp();
        t.end();
    });
});

tape('should mark error across the whole plugin def object in the source', t => {
    const tempPath = setupTemp();
    const tsConfigPath = path.resolve(tempPath, 'tsconfig.json');
    const plugins = [
        { name: testPluginName },
        { name: thisPlugin }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        const response = responses[0].body[0];
        t.equal(response.code, EXPECTED_ERROR_CODE);
        const tsConfigContent = fs.readFileSync(tsConfigPath);
        const marked = tsConfigContent.toString().substr(response.start, response.length);
        t.equal(marked, JSON.stringify({ name: thisPlugin }));
        cleanupTemp();
        t.end();
    });
});

tape('should be warning with a sensible message', t => {
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: thisPlugin }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        t.equal(responses[0].body[0].category, 'warning');
        t.equal(responses[0].body[0].message, 'When included, vs-compat-ts-plugin should be first in the list of plugins');
        cleanupTemp();
        t.end();
    });
});

tape('should find the plugin by its package name', t => {
    const tempLinkLocation = path.resolve(__dirname, '..', 'node_modules', 'vs-compat-ts-plugin');
    fs.symlinkSync(path.resolve(__dirname, '..'), tempLinkLocation);
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: 'vs-compat-ts-plugin' }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        cleanupTemp();
        fs.unlinkSync(tempLinkLocation);
        t.end();
    });
});

tape('should find the plugin in local paths', t => {
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: path.resolve(__dirname, '..') }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        cleanupTemp();
        t.end();
    });
});

tape('should find the plugin when requesting a specific file', t => {
    setupTemp();
    const plugins = [
        { name: testPluginName },
        { name: path.resolve(__dirname, '..', 'index.js') }
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 1);
        t.equal(responses[0].body[0].code, EXPECTED_ERROR_CODE);
        cleanupTemp();
        t.end();
    });
});

tape('should not find the plugin then it appears in another plugin name', t => {
    const thisPluginWithoutName = '../index.js'; // Can't be spotted because it does not contain the plugin name
    setupTemp();
    const plugins = [
        { name: thisPluginWithoutName },
        { name: 'not-vs-compat-ts-plugin' },
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
        cleanupTemp();
        t.end();
    });
});

tape('should be ok with the plugin appearing twice if one comes first', t => {
    setupTemp();
    const plugins = [
        { name: thisPlugin },
        { name: thisPlugin },
    ];
    loadAndRunPlugins({ plugins, runServerCommands }).then(({ responses }) => {
        t.ok(responses[0].success);
        t.equal(responses[0].body.length, 0);
        cleanupTemp();
        t.end();
    });
});