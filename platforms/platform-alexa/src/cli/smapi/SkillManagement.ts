import { execAsync, JovoCliError, wait } from '@jovotech/cli-core';

import { AskSkillList, getAskError } from '../utils';

export async function getSkillInformation(skillId: string, stage: string, askProfile?: string) {
  const cmd: string =
    'ask smapi get-skill-manifest ' +
    `-s ${skillId} ` +
    `-g ${stage} ` +
    `${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout!);
  } catch (error) {
    const errorMessage: string = error.stderr || error.message;
    throw getAskError('smapiGetSkillInformation', errorMessage);
  }
}

export async function listSkills(askProfile?: string): Promise<AskSkillList> {
  const cmd: string = `ask smapi list-skills-for-vendor ${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const { stdout } = await execAsync(cmd);
    return JSON.parse(stdout!) as AskSkillList;
  } catch (error) {
    const errorMessage: string = error.stderr || error.message;
    throw getAskError('smapiListSkills', errorMessage);
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
    const { stdout } = await execAsync(cmd);
    const { skillId } = JSON.parse(stdout!);
    return skillId;
  } catch (error) {
    // Since the ask CLI writes warnings into stderr, check if the error includes a warning.
    throw getAskError('smapiCreateSkill', error.stderr);
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
  } catch (error) {
    // Since the ask CLI writes warnings into stderr, check if the error includes a warning.
    throw getAskError('smapiUpdateSkill', error.stderr);
  }
}

export async function getSkillStatus(skillId: string, askProfile?: string) {
  const cmd = `ask smapi get-skill-status -s ${skillId} ${askProfile ? `-p ${askProfile}` : ''}`;

  try {
    const { stdout } = await execAsync(cmd);
    const response = JSON.parse(stdout!);

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
  } catch (error) {
    if (error instanceof JovoCliError) {
      throw error;
    }
    const errorMessage: string = error.stderror || error.message;
    throw getAskError('smapiGetSkillStatus', errorMessage);
  }
}
