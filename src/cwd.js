'use strict';

const path = require('path');

function setCwd(tsconfigFilePath, cwd, log) {
    if(cwd) {
        const tsPath = path.dirname(tsconfigFilePath);
        const fullCwd = path.resolve(tsPath, cwd);

        log(`Updating cwd to ${fullCwd}`)
        process.chdir(fullCwd);
    }
}

module.exports = setCwd;