const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const rimraf = require('rimraf');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins } = require('./tempProject');
const { THIS_PLUGIN, LOG_TS_VERSIONS_PLUGIN, LOG_TOP_TS_VERSIONS_PLUGIN, BREAK_MOCK_REQUIRE_PLUGIN } = require('./fixtures');

const TS_VERSION_MAIN = '3.8.3';
const TS_VERSION_DIFFERENT = '3.7.5';
const tsServerDir = path.resolve(__dirname, 'different-ts');

function killTempNodeModules() {
    rimraf.sync(path.resolve(tsServerDir, 'node_modules'), { disableGlob: true });
}

tape('install other TS version', t => {
    killTempNodeModules();

    exec('npm ci', { cwd: tsServerDir }, (err, stdout, stderr) => {
        t.error(err);

        const tsserverTsPackageContent = fs.readFileSync(path.resolve(tsServerDir, 'node_modules', 'typescript', 'package.json'));
        const standardTsPackageContent = fs.readFileSync(path.resolve(__dirname, '..', 'node_modules', 'typescript', 'package.json'));

        t.notEqual(JSON.parse(tsserverTsPackageContent).version, JSON.parse(standardTsPackageContent).version)

        t.end();
    });
});

tape('typescript not mocked if useVSTypescript is false', t => {
    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, useVSTypescript: false },
        { name: LOG_TS_VERSIONS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd: tsServerDir, tsServerDir }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `required: ${TS_VERSION_MAIN}`));
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `plugin: ${TS_VERSION_DIFFERENT}`));
        cleanupTemp();
        t.end();
    });
});

tape('typescript is mocked if useVSTypescript is true', t => {
    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, useVSTypescript: true },
        { name: LOG_TS_VERSIONS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd: tsServerDir, tsServerDir }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `required: ${TS_VERSION_DIFFERENT}`));
        t.ok(hasMessageBy(LOG_TS_VERSIONS_PLUGIN.name, `plugin: ${TS_VERSION_DIFFERENT}`));
        cleanupTemp();
        t.end();
    });
});

tape('typescript is mocked even at the top level of other plugins if useVSTypescript is true', t => {
    setupTemp();
    const plugins = [
        { name: THIS_PLUGIN.path, useVSTypescript: true },
        { name: LOG_TOP_TS_VERSIONS_PLUGIN.path }
    ];
    loadAndRunPlugins({ plugins, serverCwd: tsServerDir, tsServerDir }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_TOP_TS_VERSIONS_PLUGIN.name, `required: ${TS_VERSION_DIFFERENT}`));
        t.ok(hasMessageBy(LOG_TOP_TS_VERSIONS_PLUGIN.name, `plugin: ${TS_VERSION_DIFFERENT}`));
        cleanupTemp();
        t.end();
    });
});

tape('failed typescript mock does not break the plugin', t => {
    setupTemp();
    const plugins = [
        { name: BREAK_MOCK_REQUIRE_PLUGIN.path },
        { name: THIS_PLUGIN.path, useVSTypescript: true }
    ];
    loadAndRunPlugins({ plugins, serverCwd: tsServerDir, tsServerDir }).then(({ hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not mock typescript'));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Meddling completed'));
        cleanupTemp();
        t.end();
    });
});

tape('wipe temp node_modules', t => {
    killTempNodeModules();
    t.end();
});