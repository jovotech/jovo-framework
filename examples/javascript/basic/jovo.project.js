const { ProjectConfig } = require('@jovotech/cli');

/*
  |--------------------------------------------------------------------------
  | JOVO PROJECT CONFIGURATION
  |--------------------------------------------------------------------------
  |
  | Information used by the Jovo CLI to build and deploy projects
  | Learn more here: www.jovo.tech/docs/project-config
  |
  */

const project = new ProjectConfig({
  endpoint: '${JOVO_WEBHOOK_URL}',
  plugins: [],
});


module.exports = project;
