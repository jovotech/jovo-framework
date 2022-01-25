const { ProjectConfig } = require('@jovotech/cli-core');
const { AlexaCli } = require('@jovotech/platform-alexa');

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
    new AlexaCli({
      files: {
        'skill-package/skill.json': {
          manifest: {
            apis: {
              custom: {
                interfaces: [
                  {
                    type: 'AUDIO_PLAYER',
                  },
                ],
              },
            },
          },
        },
      },
      // ...
    }),
  ],
});

module.exports = project;
