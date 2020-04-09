/* Based on https://github.com/microsoft/typescript-tslint-plugin/blob/master/e2e/server-fixture/index.js */

const { fork } = require('child_process');
const path = require('path');
const readline = require('readline');

class TestServer {
    constructor({ cwd, logFile }) {
        const tsserverPath = path.join(__dirname, '..', 'node_modules', 'typescript', 'lib', 'tsserver');
        const server = fork(tsserverPath, [
            '--pluginProbeLocations', path.join(__dirname, '..'),
            '--logFile', logFile,
            '--logVerbosity', 'info',
        ], {
                cwd: cwd,
                stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
            });
        this._exitPromise = new Promise((resolve, reject) => {
            server.on('exit', code => resolve(code));
            server.on('error', reason => reject(reason));
        });
        server.stdout.setEncoding('utf-8');
        readline.createInterface({
            input: server.stdout
        }).on('line', line => {
            if (line[0] !== '{') {
                return;
            }
            try {
                const result = JSON.parse(line);
                if (result.type === 'response') {
                    this.responses.push(result);
                    --this._pendingResponses;

                    if (this._pendingResponses <= 0 && this._isClosed) {
                        this._shutdown();
                    }
                }
            } catch (e) {
                // noop
            }

        });

        this._isClosed = false;
        this._server = server;
        this._seq = 0;
        this.responses = [];
        this._pendingResponses = 0;
    }

    send(command, responseExpected) {
        if (this._isClosed) {
            throw new Error('server is closed');
        }
        if (responseExpected) {
            ++this._pendingResponses;
        }
        const seq = ++this._seq;
        const req = JSON.stringify(Object.assign({ seq: seq, type: 'request' }, command)) + '\n';
        this._server.stdin.write(req);
    }

    processAndExit() {
        if (!this._isClosed) {
            this._isClosed = true;
            if (this._pendingResponses <= 0) {
                this._shutdown();
            }
        }
        return this._exitPromise;
    }

    _shutdown() {
        this._server.stdin.end();
    }
}

function createTestServer(config) {
    return new TestServer(config);
}

module.exports = createTestServer;