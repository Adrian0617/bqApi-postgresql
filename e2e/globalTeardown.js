const kill = require('tree-kill');
const { tearDown } = require('../models/Schemas');

module.exports = () => new Promise((resolve) => {
  if (!global.__e2e.childProcessPid) {
    resolve();
    return;
  }
  tearDown()
  kill(global.__e2e.childProcessPid, 'SIGKILL', resolve);
  global.__e2e.childProcessPid = null;
});
