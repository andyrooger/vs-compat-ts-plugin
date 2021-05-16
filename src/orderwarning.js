'use strict';

function getChildren(topNode, recursive, kind) {
    const found = [];
    function find(node) {
        if(node.kind === kind) {
            found.push(node);
        }
        if(recursive) {
            node.forEachChild(find);
        }
    }
    topNode.forEachChild(find);
    return found;
}

function getPluginsListNode(ts, configFileAst) {
    return getChildren(configFileAst, true, ts.SyntaxKind.PropertyAssignment)
        .filter(node => {
            return node.name.text === 'plugins'
                && node.initializer.kind === ts.SyntaxKind.ArrayLiteralExpression;
        })
        .map(node => node.initializer)[0];
}

function getThisPluginNode(ts, pluginsArrayNode) {
    return pluginsArrayNode.elements
        .filter(node => {
            if(node.kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                return false;
            }
            const nameAssignments = getChildren(node, false, ts.SyntaxKind.PropertyAssignment).filter(node => node.name.text === 'name')
            return nameAssignments.some(node => node.initializer.kind === ts.SyntaxKind.StringLiteral && node.initializer.text === 'vs-compat-ts-plugin');
        })[0];
}

function addOrderWarning(languageService, pluginName, ts, log) {
    const originalFn = languageService.getCompilerOptionsDiagnostics;
    languageService.getCompilerOptionsDiagnostics = function (filename) {
        const diag = originalFn.call(languageService, filename);

        const configFileAst = languageService.getProgram().getCompilerOptions().configFile;
        const pluginsArrayNode = getPluginsListNode(ts, configFileAst);
        const thisPluginNode = pluginsArrayNode && getThisPluginNode(ts, pluginsArrayNode);
        if(pluginsArrayNode && thisPluginNode) {
            if(pluginsArrayNode.elements.indexOf(thisPluginNode) !== 0) {
                diag.push({
                    file: configFileAst,
                    category: ts.DiagnosticCategory.Warning,
                    code: 5088,
                    messageText: `When included, ${pluginName} should be first in the list of plugins`,
                    start: thisPluginNode.pos,
                    length: thisPluginNode.end - thisPluginNode.pos,
                    reportsUnnecessary: undefined
                });
            }
        }
        else {
            log('Could not find the plugin in the project plugin list');
        }

        return diag;
    };
}

module.exports = addOrderWarning;