function logTsVersionsPlugin(modules) {
    
    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[logTsVersionsPlugin] ${msg}`);

        const ts = require('typescript');
        log(`required: ${ts.version}`);
        log(`plugin: ${modules.typescript.version}`);

        return info.languageService;
    }

    return { create };
}

module.exports = logTsVersionsPlugin;