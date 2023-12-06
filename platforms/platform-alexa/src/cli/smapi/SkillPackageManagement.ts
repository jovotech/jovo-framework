import { JovoCliError, wait } from '@jovotech/cli-core';
import { ImportResponse, ImportStatus } from '../interfaces';
import { execAskCommand } from '../utilities';

export async function createNewUploadUrl(askProfile?: string): Promise<string> {
  const { stdout } = await execAskCommand(
    'smapiCreateUploadUrl',
    'ask smapi create-upload-url',
    askProfile,
  );
  const { uploadUrl } = JSON.parse(stdout!);
  return uploadUrl;
}

export async function createSkillPackage(
  location: string,
  askProfile?: string,
): Promise<string | undefined> {
  const { stdout } = await execAskCommand(
    'smapiCreateSkillPackage',
    ['ask smapi create-skill-package', '--full-response', `--location "${location}"`],
    askProfile,
  );

  return parseImportUrl(JSON.parse(stdout!));
}

export async function importSkillPackage(
  location: string,
  skillId: string,
  askProfile?: string,
): Promise<string | undefined> {
  const { stdout } = await execAskCommand(
    'smapiImportSkillPackage',
    [
      'ask smapi import-skill-package',
      '--full-response',
      `--location "${location}"`,
      `-s ${skillId}`,
    ],
    askProfile,
  );

  return parseImportUrl(JSON.parse(stdout!));
}

export async function exportSkillPackage(
  skillId: string,
  stage: string,
  cwd: string,
  askProfile?: string,
): Promise<void> {
  await execAskCommand(
    'smapiExportPackage',
    ['ask smapi export-package', `-s ${skillId}`, `-g ${stage}`],
    askProfile,
    { cwd },
  );
}

export async function getImportStatus(
  importId: string,
  askProfile?: string,
  isAsync = false,
): Promise<ImportStatus> {
  const { stdout } = await execAskCommand(
    'smapiGetImportStatus',
    ['ask smapi get-import-status', `--import-id "${importId}"`],
    askProfile,
  );

  const status: ImportStatus = JSON.parse(stdout!);

  // If --async is passed, return the status and exit, otherwise wait until the import has finished
  if (isAsync) {
    return status;
  }

  if (status.status === 'IN_PROGRESS') {
    await wait(500);
    return await getImportStatus(importId, askProfile);
  } else if (status.status === 'FAILED') {
    const errorResource = status.skill.resources.find((r) => r.errors);
    throw new JovoCliError({
      message: 'Errors occured while importing your skill package',
      hint: errorResource
        ? errorResource.errors[0].message
        : JSON.stringify(status.skill.resources, null, 2),
    });
  }

  return status;
}

function parseImportUrl({ headers }: ImportResponse): string | undefined {
  return headers['location']?.split('/').pop();
}
