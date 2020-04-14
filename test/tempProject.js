const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const createTestServer = require('./TestServer');
const tape = require('tape');

const tempDir = path.resolve(__dirname, '.tempProject');

function setupTemp() {
    cleanupTemp();
    fs.mkdirSync(tempDir);
    return tempDir;
}

function cleanupTemp() {
    rimraf.sync(tempDir, { ignoreGlob: true });
}

function createTempProject(pluginsArray) {
    const tsConfig = {
        compilerOptions: {
            plugins: pluginsArray,
            sourceMap: false,
            noEmit: true,
            noLib: true,
            importHelpers: false
        },
        typeAcquisition: { enable: false },
        compileOnSave: false
    };

    fs.writeFileSync(path.resolve(tempDir, 'tsconfig.json'), JSON.stringify(tsConfig));
}

function loadTempFile(server, fileName, fileContent) {
    const tsFileName = path.resolve(tempDir, fileName);

    server.send({ command: 'open', arguments: { file: tsFileName, fileContent: fileContent, scriptKindName: 'TS', projectFileName: path.resolve(tempDir, 'tsconfig.json') } }, false);
}

function loadAndRunPlugins({ plugins, serverCwd, tsServerDir, runServerCommands, typescriptServerDir }) {
    createTempProject(plugins);
    const logFile = path.resolve(tempDir, 'logFile.log');
    const server = createTestServer({ cwd: serverCwd, logFile, tsServerDir, typescriptServerDir });
    loadTempFile(server, 'file.ts', '// nothing exciting');
    (runServerCommands || function(){})(server, 'file.ts', path.resolve(tempDir, 'tsconfig.json'));

    return server.processAndExit().then(() => {
        const logContent = fs.readFileSync(logFile).toString();
        const responses = server.responses;
        function messagesBy(plugin) {
            return logContent
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.indexOf(`[${plugin}] `) !== -1)
                .map(line => line.substr(line.indexOf(`[${plugin}] `) + plugin.length + 3));
        }
        function hasMessageBy(plugin, msg) {
            return messagesBy(plugin).indexOf(msg) !== -1;
        }

        return { logContent, responses, messagesBy, hasMessageBy };
    });
}

function pluginTest(testName, { serverCwd, plugins, check }, only) {
    (only ? tape.only : tape)(testName, t => {
        setupTemp();
        loadAndRunPlugins({ plugins, serverCwd }).
            then((logGetters) => {
                check(t, { ...logGetters });
            })
            .catch((err) => {
                t.fail('Server failed to run: ' + err.toString());
            })
            .finally(() => {
                cleanupTemp();
                t.end();
            });
    });
}

pluginTest.only = function(...args) {
    this.call(this, ...args, true)
}

module.exports = { setupTemp, cleanupTemp, createTempProject, loadTempFile, loadAndRunPlugins, pluginTest };