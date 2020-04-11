'use strict';

const path = require('path');
const mockRequire = require('mock-require');

const PLUGIN_NAME = 'vs-compat-ts-plugin';

function applyDefaults(config) {
    let defaults = config.onByDefault === false ? {
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
        ...config
    };
}

function setCwd(tsconfigFile, cwd, log) {
    if(cwd) {
        const tsPath = path.dirname(tsconfigFile);
        const fullCwd = path.resolve(tsPath, cwd);

        log(`Updating cwd to ${fullCwd}`)
        process.chdir(fullCwd);
    }
}

function replaceTypescript(useVSTypescript, vsTypescript, log) {
    if(useVSTypescript) {
        log('Mocking typescript module with the version from tsserver');
        mockRequire('typescript', vsTypescript);
    }
}

function init(modules) {

    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[${PLUGIN_NAME}] ${msg}`);
        log('Loaded plugin');

        const config = applyDefaults(info.config);

        try {
            setCwd(info.project.projectName, config.workingDirectory, log);
        }
        catch(err) {
            log('Could not set working directory');
            log(err);
        }

        try {
            replaceTypescript(config.useVSTypescript, modules.typescript, log);
        }
        catch(err) {
            log('Could not mock typescript');
            log(err);
        }

        log('Meddling completed')

        return info.languageService;
    }
    return { create };
}

module.exports = init;