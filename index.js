'use strict';

const path = require('path');
const mockRequire = require('mock-require');

const PLUGIN_NAME = 'vs-compat-ts-plugin';

function init(modules) {

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

    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[${PLUGIN_NAME}] ${msg}`);
        log('Loaded plugin');

        try {
            setCwd(info.project.projectName, info.config.workingDirectory, log);
        }
        catch(err) {
            log('Could not set working directory');
            log(err);
        }

        try {
            replaceTypescript(info.config.useVSTypescript, modules.typescript, log);
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