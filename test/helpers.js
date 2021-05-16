const fs = require('fs');
const path = require('path');
const TestServer = require('./TestServer');
const tape = require('tape');
const { PROJECT_DIR, PROJECT_FILE, PROJECT_CONTENT, TS_VERSIONS } = require('./fixtures');

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

    fs.writeFileSync(PROJECT_FILE, JSON.stringify(tsConfig));
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

function pluginTest(testName, { serverCwd, plugins, serverCommands, check }, onlyTsVersion) {
    const testTsVersions = onlyTsVersion ? [TS_VERSIONS[onlyTsVersion]] : Object.keys(TS_VERSIONS).filter(key => key !== 'default').map(key => TS_VERSIONS[key]);
    
    for(const tsVersion of testTsVersions) {
        (onlyTsVersion ? tape.only : tape)(`${testName} (TS ${tsVersion.version})`, async t => {
            createTempProject(plugins);
            const server = new TestServer({ cwd: serverCwd, logFile: LOG_FILE, typescriptServerDir: tsVersion.path });
            server.send({ command: 'open', arguments: { file: PROJECT_CONTENT } }, false);
            if(serverCommands) {
                serverCommands(server);
            }
            try {
                await server.processAndExit();
                
                const logContent = fs.readFileSync(LOG_FILE).toString();
                const responses = server.responses;
                const messagesBy = getMessagesBy(logContent);
                const assertHasMessageBy = (plugin, msg) => {
                    const hasMessageBy = messagesBy(plugin).indexOf(msg) !== -1;
                    if(!hasMessageBy) {
                        t.comment(logContent);
                    }
                    t.ok(hasMessageBy);
                };
                const assertNotHasMessageBy = (plugin, msg) => {
                    const hasMessageBy = messagesBy(plugin).indexOf(msg) !== -1;
                    if(hasMessageBy) {
                        t.comment(logContent);
                    }
                    t.notOk(hasMessageBy);
                };

                check(t, { logContent, responses, messagesBy, assertHasMessageBy, assertNotHasMessageBy, tsVersion });
            }
            catch(err) {
                t.fail('Server failed to run: ' + err.toString());
            }
            finally {
                t.end();
            }
        });
    }
}

pluginTest.only = function(...args) {
    this.call(this, ...args, 'default')
}

module.exports = { pluginTest };