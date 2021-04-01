import { execAsync, JovoCliError } from '@jovotech/cli-core';

export * from './Interfaces';
export * from './Paths';

export async function checkForGactionsCli() {
  try {
    await execAsync('gactions version');
  } catch (err) {
    throw new JovoCliError(
      'Jovo requires gactions CLI.',
      'GoogleAssistantCli',
      'Install the gactions CLI following this guide: ' +
        'https://developers.google.com/assistant/conversational/quickstart#install_the_gactions_command-line_tool',
    );
  }
}
