import { execAsync, JovoCliError } from '@jovotech/cli-core';

export * from './constants';
export * from './interfaces';

export async function checkForGactionsCli(): Promise<void> {
  try {
    await execAsync('gactions version');
  } catch (err) {
    throw new JovoCliError({
      message: 'Jovo requires gactions CLI.',
      module: 'GoogleAssistantCli',
      learnMore:
        'Install the gactions CLI following this guide: ' +
        'https://developers.google.com/assistant/conversational/quickstart#install_the_gactions_command-line_tool',
    });
  }
}

/**
 * Tries to parse the provided error message for standard errors.
 * @param errorMessage - Error message.
 */
export function getGactionsError(errorMessage: string): JovoCliError {
  if (errorMessage.includes('command requires authentication')) {
    return new JovoCliError({
      message: 'Missing authentication.',
      module: 'GoogleAssistantCli',
      hint: 'Try to run "gactions login" first.',
    });
  }

  const errorToken = 'Server did not return HTTP 200.';
  if (errorMessage.includes(errorToken)) {
    const { error } = JSON.parse(
      errorMessage.substring(errorMessage.indexOf(errorToken) + errorToken.length),
    );

    return new JovoCliError({
      message: error.message,
      module: 'GoogleAssistantCli',
      details: error.details[0].fieldViolations?.[0].description,
    });
  }

  return new JovoCliError({ message: errorMessage, module: 'GoogleAssistantCli' });
}
