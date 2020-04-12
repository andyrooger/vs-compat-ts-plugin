'use strict';

const applyDefaults = require('./defaults');
const setCwd = require('./cwd');
const replaceTypescript = require('./tsversion');

const PLUGIN_NAME = 'vs-compat-ts-plugin';

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