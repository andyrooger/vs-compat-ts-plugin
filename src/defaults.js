'use strict';

function applyDefaults(initialConfig) {
    let defaults = initialConfig.onByDefault === false ? {
        onByDefault: false,
        workingDirectory: null,
        useVSTypescript: false,
    } : {
        onByDefault: true,
        workingDirectory: '.',
        useVSTypescript: true,
    };
    return {
        ...defaults,
        ...initialConfig
    };
}

module.exports = applyDefaults;