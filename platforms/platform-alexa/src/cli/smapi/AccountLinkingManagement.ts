import { existsSync } from 'fs';
import { execAsync } from '@jovotech/cli-core';
import { getAskError } from '../utils';

export async function getAccountLinkingInformation(
  skillId: string,
  stage: string,
  askProfile?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  const cmd =
    'ask smapi get-account-linking-info ' +
    `-s ${skillId} ` +
    `-g ${stage} ` +
    `${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const { stdout } = await execAsync(cmd);
    const response = JSON.parse(stdout!);
    return response.accountLinkingResponse;
  } catch (error) {
    const errorMessage: string = error.stderr || error.message;
    throw getAskError('smapiGetAccountLinkingInformation', errorMessage);
  }
}

export async function updateAccountLinkingInformation(
  skillId: string,
  accountLinkingJsonPath: string,
  stage: string,
  askProfile?: string,
): Promise<void> {
  try {
    if (!existsSync(accountLinkingJsonPath)) {
      return;
    }

    const cmd: string =
      'ask smapi update-account-linking-info ' +
      `-s ${skillId} ` +
      `-g ${stage} ` +
      `${askProfile ? `-p ${askProfile}` : ''} ` +
      `--account-linking-request "file:${accountLinkingJsonPath}"`;

    await execAsync(cmd);
  } catch (error) {
    throw getAskError('smapiUpdateAccountLinkingInformation', error.stderr);
  }
}
