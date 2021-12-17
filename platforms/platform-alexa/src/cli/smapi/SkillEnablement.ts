import { execAskCommand } from '../utilities';

export async function enableSkill(
  skillId: string,
  stage: string,
  askProfile?: string,
): Promise<void> {
  await execAskCommand(
    'smapiEnableSkill',
    ['ask smapi set-skill-enablement', `-s ${skillId}`, `-g ${stage}`],
    askProfile,
  );
}
