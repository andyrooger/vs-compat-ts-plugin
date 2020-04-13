const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const createTestServer = require('./TestServer');

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

function loadAndRunPlugins({ plugins, serverCwd, tsServerDir, runServerCommands }) {
    createTempProject(plugins);
    const logFile = path.resolve(tempDir, 'logFile.log');
    const server = createTestServer({ cwd: serverCwd, logFile, tsServerDir });
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

let pluginNum = 1;
function createTempPlugin(pluginName, execute, header = '') {
    const pluginFileName = path.resolve(tempDir, `plugin.${pluginName}.${pluginNum++}.js`);

    function fakePlugin(modules) {
    
        function create(info) {
            const log = msg => info.project.projectService.logger.info(`[${pluginName}] ${msg}`);
    
            execute(log, modules.typescript);

            return info.languageService;
        }
        return { create };
    }

    const pluginContent = `${header}\nconst execute = (${execute.toString()});\nconst pluginName = '${pluginName}';\n${fakePlugin.toString()};\nmodule.exports = fakePlugin;`
    fs.writeFileSync(pluginFileName, pluginContent);

    return pluginFileName;
}

module.exports = { setupTemp, cleanupTemp, createTempProject, loadTempFile, loadAndRunPlugins, createTempPlugin };