import { execAsync, JovoCliError } from '@jovotech/cli-core';

export * from './Interfaces';
export * from './Constants';

export async function activateServiceAccount(keyFilePath: string): Promise<void> {
  try {
    await execAsync(`gcloud auth activate-service-account --key-file ${keyFilePath}`);
  } catch (error) {
    // gcloud CLI writes output to stderr, so we have to parse the output message in this catch() block.
    if (error.stderr.includes('Activated service account')) {
      return;
    }
    throw new JovoCliError(
      'Could not activate your service account.',
      'DialogflowCli',
      error.stderr,
    );
  }
}

export async function getGcloudAccessToken(): Promise<string> {
  try {
    const { stdout } = await execAsync('gcloud auth print-access-token');
    if (!stdout) {
      throw new Error();
    }
    return stdout.trim();
  } catch (error) {
    console.log(error);
    throw new JovoCliError('Authorization failed.', 'DialogflowCli', error.stderr);
  }
}
