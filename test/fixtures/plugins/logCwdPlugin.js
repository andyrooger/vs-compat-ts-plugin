function logCwdPlugin(modules) {
    
    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[logCwdPlugin] ${msg}`);

        log(process.cwd());

        return info.languageService;
    }

    return { create };
}

module.exports = logCwdPlugin;