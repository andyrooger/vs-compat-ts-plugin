const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const tape = require('tape');
const { setupTemp, cleanupTemp, loadAndRunPlugins, createTempPlugin } = require('./tempProject');

const thisPlugin = path.resolve(__dirname, '../index.js');
const thisPluginName = 'vs-compat-ts-plugin';
const testPluginName = 'test-plugin';
const tsServerDir = path.resolve(__dirname, 'different-ts');

function killTempNodeModules() {
    fs.rmdirSync(path.resolve(tsServerDir, 'node_modules'), { recursive: true });
}

tape('install other TS version', t => {
    killTempNodeModules();

    execFile('npm', ['ci'], { cwd: tsServerDir }, (err, stdout, stderr) => {
        t.error(err);

        const tsserverTsPackageContent = fs.readFileSync(path.resolve(tsServerDir, 'node_modules', 'typescript', 'package.json'));
        const standardTsPackageContent = fs.readFileSync(path.resolve(__dirname, '..', 'node_modules', 'typescript', 'package.json'));

        t.notEqual(JSON.parse(tsserverTsPackageContent).version, JSON.parse(standardTsPackageContent).version)

        t.end();
    });
});

tape('typescript not mocked if useVSTypescript is false', t => {
    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, (log, tsFromserver) => {
        const ts = require('typescript');
        log(ts.version);
        log(tsFromserver.version);
    });
    const plugins = [
        { name: thisPlugin, useVSTypescript: false },
        { name: testPlugin }
    ];
    loadAndRunPlugins(plugins, tsServerDir, tsServerDir).then(({ messagesBy }) => {
        t.notEqual(messagesBy(testPluginName)[0], messagesBy(testPluginName)[1]);
        cleanupTemp();
        t.end();
    });
});

tape('typescript is mocked if useVSTypescript is true', t => {
    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, (log, tsFromserver) => {
        const ts = require('typescript');
        log(ts.version);
        log(tsFromserver.version);
    });
    const plugins = [
        { name: thisPlugin, useVSTypescript: true },
        { name: testPlugin }
    ];
    loadAndRunPlugins(plugins, tsServerDir, tsServerDir).then(({ messagesBy }) => {
        t.equal(messagesBy(testPluginName)[0], messagesBy(testPluginName)[1]);
        cleanupTemp();
        t.end();
    });
});

tape('typescript is mocked even at the top level of other plugins if useVSTypescript is true', t => {
    setupTemp();
    const testPlugin = createTempPlugin(testPluginName, (log, tsFromserver) => {
        log(ts.version);
        log(tsFromserver.version);
    }, 'const ts = require("typescript");');
    const plugins = [
        { name: thisPlugin, useVSTypescript: true },
        { name: testPlugin }
    ];
    loadAndRunPlugins(plugins, tsServerDir, tsServerDir).then(({ messagesBy }) => {
        t.equal(messagesBy(testPluginName)[0], messagesBy(testPluginName)[1]);
        cleanupTemp();
        t.end();
    });
});

tape('failed typescript mock does not break the plugin', t => {
    setupTemp();
    const breakMockTsPlugin = createTempPlugin('break-mock', () => {
        require('mock-require')('mock-require', () => { throw new Error(); });
    });
    const testPlugin = createTempPlugin(testPluginName, (log, tsFromserver) => {
        log('still working');
    });
    const plugins = [
        { name: breakMockTsPlugin },
        { name: thisPlugin, useVSTypescript: true },
        { name: testPlugin },
    ];
    loadAndRunPlugins(plugins, tsServerDir, tsServerDir).then(({ messagesBy }) => {
        t.equal(messagesBy(thisPluginName)[2], 'Could not mock typescript');
        t.equal(messagesBy(thisPluginName)[4], 'Meddling completed');
        t.equal(messagesBy(testPluginName)[0], 'still working');
        cleanupTemp();
        t.end();
    });
});

tape('wipe temp node_modules', t => {
    killTempNodeModules();
    t.end();
});