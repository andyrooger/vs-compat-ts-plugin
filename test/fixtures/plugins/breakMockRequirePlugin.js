function breakMockRequirePlugin(modules) {
    
    function create(info) {
        const log = msg => info.project.projectService.logger.info(`[breakMockRequirePlugin] ${msg}`);

        require('mock-require')('mock-require', () => { throw new Error(); });

        return info.languageService;
    }

    return { create };
}

module.exports = breakMockRequirePlugin;