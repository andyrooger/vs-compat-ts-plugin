const fs = require('fs');
const path = require('path');
const createTestServer = require('./TestServer');

const tempDir = path.resolve(__dirname, '.tempProject');

function setupTemp() {
    cleanupTemp();
    fs.mkdirSync(tempDir);
}

function cleanupTemp() {
    fs.rmdirSync(tempDir, { recursive: true });
}

function createTempProject(pluginsArray) {
    const tsConfig = {
        compilerOptions: {
            plugins: pluginsArray,
            sourceMap: false,
            noEmit: true
        }
    };

    fs.writeFileSync(path.resolve(tempDir, 'tsconfig.json'), JSON.stringify(tsConfig));
}

function loadTempFile(server, fileName, fileContent) {
    const tsFileName = path.resolve(tempDir, fileName);
    fs.writeFileSync(tsFileName, fileContent);

    server.send({ command: 'open', arguments: { file: tsFileName, fileContent: fileContent, scriptKindName: 'TS' } }, false);
}

function loadAndRunPlugins(plugins, serverCwd) {
    createTempProject(plugins);
    const logFile = path.resolve(tempDir, 'logFile.log');
    const server = createTestServer({ cwd: serverCwd, logFile });
    loadTempFile(server, 'file.ts', '// nothing exciting');

    return server.processAndExit().then(() => {
        const logContent = fs.readFileSync(logFile).toString();
        function messagesBy(plugin) {
            return logContent
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.indexOf(`[${plugin}] `) !== -1)
                .map(line => line.substr(line.indexOf(`[${plugin}] `) + plugin.length + 3));
        }

        return { logContent, messagesBy };
    });
}

module.exports = { setupTemp, cleanupTemp, createTempProject, loadTempFile, loadAndRunPlugins };