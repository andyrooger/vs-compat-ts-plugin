const fs = require('fs');
const path = require('path');
const createTestServer = require('./TestServer');

const tempDir = path.resolve(__dirname, '.tempProject');

function createTempProject(pluginsArray) {
    cleanTempProject();
    fs.mkdirSync(tempDir);

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
    const tsFileName = path.resolve(tempDir, fileName + '.ts');
    fs.writeFileSync(tsFileName, fileContent);

    server.send({ command: 'open', arguments: { file: tsFileName, fileContent: fileContent, scriptKindName: 'TS' } }, false);
}

function analyseFile(server, fileName) {
    const tsFileName = path.resolve(tempDir, fileName + '.ts');
    server.send({ command: 'semanticDiagnosticsSync', arguments: { file: tsFileName } }, true);
}

function cleanTempProject() {
    fs.rmdirSync(tempDir, { recursive: true });
}

function loadAndRunPlugins(plugins, serverCwd) {
    createTempProject(plugins);
    const logFile = path.resolve(tempDir, 'logFile.log');
    const server = createTestServer({ cwd: serverCwd, logFile });
    loadTempFile(server, 'file.ts', '// nothing exciting');
    analyseFile(server, 'file.ts');

    return server.processAndExit().then(() => {
        const logContent = fs.readFileSync(logFile).toString();
        cleanTempProject();
        return logContent;
    });
}

module.exports = { createTempProject, loadTempFile, analyseFile, cleanTempProject, loadAndRunPlugins };