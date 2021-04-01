import { JovoCli } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';

/**
 * Returns folder name for plugin.
 */
export function getPlatformDirectory(): string {
  return 'platform.alexa';
}

/**
 * Returns base path to platform's build folder.
 */
export function getPlatformPath(): string {
  const jovo: JovoCli = JovoCli.getInstance();
  return joinPaths(jovo.$project!.getBuildPath(), getPlatformDirectory());
}

/**
 * Returns path to Alexa skill package folder.
 */
export function getSkillPackagePath(): string {
  return joinPaths(getPlatformPath(), 'skill-package');
}

/**
 * Returns path to skill.json.
 */
export function getSkillJsonPath(): string {
  return joinPaths(getSkillPackagePath(), 'skill.json');
}

export function getModelsPath(): string {
  return joinPaths(getSkillPackagePath(), 'interactionModels', 'custom');
}

export function getModelsDirectory(): string {
  return joinPaths(getPlatformDirectory(), 'skill-package', 'interactionModels', 'custom');
}

export function getModelPath(locale: string): string {
  return joinPaths(getModelsPath(), `${locale}.json`);
}

export function getAskConfigFolderPath(): string {
  return joinPaths(getPlatformPath(), '.ask');
}

export function getAskConfigPath(): string {
  return joinPaths(getAskConfigFolderPath(), 'ask-states.json');
}

export function getAccountLinkingPath(): string {
  return joinPaths(getSkillPackagePath(), 'accountLinking.json');
}
