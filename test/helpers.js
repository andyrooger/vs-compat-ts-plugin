const fs = require('fs');
const path = require('path');
const TestServer = require('./TestServer');
const tape = require('tape');
const { PROJECT_DIR } = require('./fixtures');

const LOG_FILE = path.resolve(PROJECT_DIR, 'logFile.log');

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

    fs.writeFileSync(path.resolve(PROJECT_DIR, 'tsconfig.json'), JSON.stringify(tsConfig));
}

function loadTempFile(server, fileName, fileContent) {
    const tsFileName = path.resolve(PROJECT_DIR, fileName);

    server.send({ command: 'open', arguments: { file: tsFileName, fileContent: fileContent, scriptKindName: 'TS', projectFileName: path.resolve(PROJECT_DIR, 'tsconfig.json') } }, false);
}

function getMessagesBy(logContent) {
    return function messagesBy(plugin) {
        return logContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.indexOf(`[${plugin}] `) !== -1)
            .map(line => line.substr(line.indexOf(`[${plugin}] `) + plugin.length + 3));
    }
}

function pluginTest(testName, { serverCwd, typescriptServerDir, plugins, serverCommands, check }, only) {
    (only ? tape.only : tape)(testName, t => {
        createTempProject(plugins);
        const server = new TestServer({ cwd: serverCwd, logFile: LOG_FILE, typescriptServerDir });
        loadTempFile(server, 'file.ts', '// nothing exciting');
        if(serverCommands) {
            serverCommands(server);
        }
        server.processAndExit()
            .then(() => {
                const logContent = fs.readFileSync(LOG_FILE).toString();
                const responses = server.responses;
                const messagesBy = getMessagesBy(logContent);
                const hasMessageBy = (plugin, msg) => messagesBy(plugin).indexOf(msg) !== -1;

                check(t, { logContent, responses, messagesBy, hasMessageBy });
            })
            .catch((err) => {
                t.fail('Server failed to run: ' + err.toString());
            })
            .finally(() => {
                t.end();
            });
    });
}

pluginTest.only = function(...args) {
    this.call(this, ...args, true)
}

module.exports = { pluginTest };