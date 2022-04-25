const { ProjectConfig } = require('@jovotech/cli-core');
const { GoogleAssistantCli } = require('@jovotech/platform-googleassistant');

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
  plugins: [
    new GoogleAssistantCli({
      projectId: '<yourProjectId>',
    }),
  ],
});

module.exports = project;
