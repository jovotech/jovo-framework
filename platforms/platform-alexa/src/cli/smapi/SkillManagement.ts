import { execAsync, wait } from '@jovotech/cli-core';

import { AskSkillList, getAskError } from '../utils';

export async function getSkillInformation(skillId: string, stage: string, askProfile?: string) {
  const cmd: string =
    'ask smapi get-skill-manifest ' +
    `-s ${skillId} ` +
    `-g ${stage} ` +
    `${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const stdout: string = await execAsync(cmd);
    return JSON.parse(stdout);
  } catch (error) {
    throw getAskError('smapiGetSkillInformation', error.message);
  }
}

export async function listSkills(askProfile?: string): Promise<AskSkillList> {
  const cmd: string = `ask smapi list-skills-for-vendor ${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const stdout: string = await execAsync(cmd);
    return JSON.parse(stdout) as AskSkillList;
  } catch (error) {
    throw getAskError('smapiListSkills', error.message);
  }
}

/**
 * Creates a new skill for the given ASK profile.
 */
export async function createSkill(skillJsonPath: string, askProfile?: string): Promise<string> {
  const cmd: string =
    'ask smapi create-skill-for-vendor ' +
    `${askProfile ? `-p ${askProfile} ` : ''}` +
    ` --manifest "file:${skillJsonPath}"`;
  try {
    const stdout: string = await execAsync(cmd);
    const { skillId } = JSON.parse(stdout);
    return skillId;
  } catch (err) {
    throw getAskError('smapiCreateSkill', err.message);
  }
}

export async function updateSkill(skillId: string, skillJsonPath: string, askProfile?: string) {
  try {
    const cmd: string =
      'ask smapi update-skill-manifest ' +
      `-s ${skillId} ` +
      `-g development ` +
      `${askProfile ? `-p ${askProfile}` : ''} ` +
      `--manifest "file:${skillJsonPath}"`;

    await execAsync(cmd);
  } catch (err) {
    throw getAskError('smapiUpdateSkill', err.message);
  }
}

export async function getSkillStatus(skillId: string, askProfile?: string) {
  const cmd = `ask smapi get-skill-status -s ${skillId} ${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const stdout: string = await execAsync(cmd);
    const response = JSON.parse(stdout);

    if (response.manifest) {
      const status: string = response.manifest.lastUpdateRequest.status;

      if (status === 'IN_PROGRESS') {
        await wait(500);
        await getSkillStatus(skillId, askProfile);
      }
    }

    if (response.interactionModel) {
      const values: any[] = Object.values(response.interactionModel);
      for (const model of values) {
        const status = model.lastUpdateRequest.status;
        if (status === 'SUCCEEDED') {
          continue;
        } else if (status === 'IN_PROGRESS') {
          await wait(500);
          await getSkillStatus(skillId, askProfile);
        }
      }
    }
  } catch (err) {
    throw getAskError('smapiGetSkillStatus', err.message);
  }
}
