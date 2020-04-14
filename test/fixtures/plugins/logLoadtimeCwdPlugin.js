const loadtimeCwd = process.cwd();

function logLoadtimeCwdPlugin(modules) {
    
    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[logLoadtimeCwdPlugin] ${msg}`);

        log(loadtimeCwd);

        return info.languageService;
    }

    return { create };
}

module.exports = logLoadtimeCwdPlugin;