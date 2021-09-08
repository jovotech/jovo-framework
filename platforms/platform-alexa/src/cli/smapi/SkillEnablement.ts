import { execAsync } from '@jovotech/cli-core';
import { getAskError } from '../utilities';

export async function enableSkill(
  skillId: string,
  stage: string,
  askProfile?: string,
): Promise<void> {
  const cmd: string =
    'ask smapi set-skill-enablement ' +
    `-s ${skillId} ` +
    `-g ${stage} ` +
    `${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    await execAsync(cmd);
  } catch (error) {
    throw getAskError('smapiEnableSkill', error.stderr);
  }
}
