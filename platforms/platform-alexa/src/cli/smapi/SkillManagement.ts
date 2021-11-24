import { execAsync, JovoCliError, Log, wait } from '@jovotech/cli-core';
import { AskSkillList, SkillStatusResponse, SkillStatusError } from '../interfaces';
import { execAskCommand } from '../utilities';

export async function listSkills(askProfile?: string): Promise<AskSkillList> {
  const { stdout } = await execAskCommand(
    'smapiListSkillsForVendor',
    'ask smapi list-skills-for-vendor',
    askProfile,
  );
  return JSON.parse(stdout!) as AskSkillList;
}

export async function getSkillStatus(skillId: string, askProfile?: string): Promise<void> {
  const cmd: string[] = ['ask smapi get-skill-status', `-s ${skillId}`];

  const { stdout } = await execAskCommand('smapiGetSkillStatus', cmd, askProfile);
  const response: SkillStatusResponse = JSON.parse(stdout!);

  if (response.manifest) {
    const { status, errors } = response.manifest.lastUpdateRequest;

    if (status === 'IN_PROGRESS') {
      await wait(500);
      await getSkillStatus(skillId, askProfile);
    } else if (status === 'FAILED') {
      throw new JovoCliError({
        message: 'Errors occured while validating your skill package',
        hint: errors!.reduce((output: string, error: SkillStatusError) => {
          return output + error.message;
        }, ''),
      });
    }
  }

  if (response.interactionModel) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any[] = Object.values(response.interactionModel);
    for (const model of values) {
      const status = model.lastUpdateRequest.status;
      if (status === 'IN_PROGRESS') {
        await wait(1000);
        await getSkillStatus(skillId, askProfile);
      }
    }
  }
}
