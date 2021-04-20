import { JovoCli } from '@jovotech/cli-core';
import { join as joinPaths } from 'path';

/**
 * Returns folder name for plugin.
 */
export function getPlatformDirectory(): string {
  return 'platform.googleAssistant';
}

/**
 * Returns base path to platform's build folder.
 */
export function getPlatformPath(): string {
  const jovo: JovoCli = JovoCli.getInstance();
  return joinPaths(jovo.$project!.getBuildPath(), getPlatformDirectory());
}
