'use strict';

const mockRequire = require('mock-require');

function replaceTypescript(useVSTypescript, vsTypescript, log) {
    if(useVSTypescript) {
        log('Mocking typescript module with the version from tsserver');
        mockRequire('typescript', vsTypescript);
    }
}

module.exports = replaceTypescript;