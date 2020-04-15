const path = require('path');
const { pluginTest } = require('./tempProject');
const { THIS_PLUGIN, LOG_CWD_PLUGIN, LOG_LOADTIME_CWD_PLUGIN, EMPTY_DIRS, PROJECT_DIR } = require('./fixtures');

const [SERVER_CWD, PLUGIN_CWD] = EMPTY_DIRS;
const RELATIVE_PLUGIN_CWD = path.relative(PROJECT_DIR, PLUGIN_CWD);

pluginTest('cwd is set before the next plugin init', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: PLUGIN_CWD },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});

pluginTest('cwd is set before the next plugin is loaded', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: PLUGIN_CWD },
        { name: LOG_LOADTIME_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_LOADTIME_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});

pluginTest('cwd not changed when null', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: null },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, SERVER_CWD));
    }
});

pluginTest('invalid cwd does not break everything else', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: '/\\not.*valid' },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Could not set working directory'));
        t.ok(hasMessageBy(THIS_PLUGIN.name, 'Meddling completed'));
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, SERVER_CWD));
    }
});

pluginTest('cwd relative to the tsconfig directory', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: RELATIVE_PLUGIN_CWD },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});

pluginTest('cwd can use forward slashes (in all OS)', {
    serverCwd: SERVER_CWD,
    plugins: [
        { name: THIS_PLUGIN.path, workingDirectory: RELATIVE_PLUGIN_CWD.replace(/\\/g, '/') },
        { name: LOG_CWD_PLUGIN.path }
    ],
    check: (t, { hasMessageBy }) => {
        t.ok(hasMessageBy(LOG_CWD_PLUGIN.name, PLUGIN_CWD));
    }
});
