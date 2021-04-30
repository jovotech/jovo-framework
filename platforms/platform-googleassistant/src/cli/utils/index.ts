import { execAsync, JovoCliError } from '@jovotech/cli-core';

export * from './Interfaces';

export async function checkForGactionsCli(): Promise<void> {
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

/**
 * Tries to parse the provided error message for standard errors.
 * @param errorMessage - Error message.
 */
export function getGactionsError(errorMessage: string): JovoCliError {
  // ToDo: Check for different errors.
  if (errorMessage.includes('command requires authentication')) {
    return new JovoCliError(
      'Missing authentication.',
      'GoogleAssistantCli',
      'Try to run "gactions login" first.',
    );
  }

  const errorToken = 'Server did not return HTTP 200.';
  if (errorMessage.includes(errorToken)) {
    const { error } = JSON.parse(
      errorMessage.substring(errorMessage.indexOf(errorToken) + errorToken.length),
    );

    return new JovoCliError(
      error.message,
      'GoogleAssistantCli',
      error.details[0].fieldViolations[0].description,
    );
  }

  return new JovoCliError(errorMessage, 'GoogleAssistantCli');
}
