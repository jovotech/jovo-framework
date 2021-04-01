import { execAsync } from '@jovotech/cli-core';
import { getAskError } from '../utils';

export async function getInteractionModel(
  skillId: string,
  locale: string,
  stage: string,
  askProfile?: string,
) {
  try {
    const cmd =
      'ask smapi get-interaction-model ' +
      `-s ${skillId} ` +
      `-g ${stage} ` +
      `-l ${locale} ` +
      `${askProfile ? `-p ${askProfile}` : ''}`;

    const stdout = await execAsync(cmd);
    return JSON.parse(stdout);
  } catch (error) {
    throw getAskError('smapiGetInteractionModel', error.message);
  }
}

export async function updateInteractionModel(
  skillId: string,
  locale: string,
  interactionModelPath: string,
  stage: string,
  askProfile?: string,
) {
  const cmd: string =
    'ask smapi set-interaction-model ' +
    `-s ${skillId} ` +
    `-g ${stage} ` +
    `-l ${locale} ` +
    `${askProfile ? `-p ${askProfile}` : ''} ` +
    `--interaction-model "file:${interactionModelPath}"`;
  try {
    await execAsync(cmd);
  } catch (err) {
    throw getAskError('smapiUpdateInteractionModel', err.message);
  }
}
