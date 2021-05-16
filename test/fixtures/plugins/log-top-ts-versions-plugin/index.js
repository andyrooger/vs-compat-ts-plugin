const ts = require('typescript');

function logTopTsVersionsPlugin(modules) {
    
    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[logTopTsVersionsPlugin] ${msg}`);

        log(`required: ${ts.version}`);
        log(`plugin: ${modules.typescript.version}`);

        return info.languageService;
    }

    return { create };
}

module.exports = logTopTsVersionsPlugin;