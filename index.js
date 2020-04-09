'use strict';

const PLUGIN_NAME = 'vs-compat-ts-plugin';

function init(modules) {

    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[${PLUGIN_NAME}] ${msg}`);
        log('loaded');

        return info.languageService;
    }
    return { create };
}

module.exports = init;