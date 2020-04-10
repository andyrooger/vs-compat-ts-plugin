'use strict';

const PLUGIN_NAME = 'vs-compat-ts-plugin';

function init(modules) {

    function setCwd(cwd, log) {
        if(cwd) {
            process.chdir(cwd);
            log(`Updating cwd to ${cwd}`)
        }
    }

    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[${PLUGIN_NAME}] ${msg}`);
        log('Loaded plugin');

        setCwd(info.config.workingDirectory, log);

        return info.languageService;
    }
    return { create };
}

module.exports = init;