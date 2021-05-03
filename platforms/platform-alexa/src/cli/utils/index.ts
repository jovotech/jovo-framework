import chalk from 'chalk';
import _get from 'lodash.get';
import { execAsync, JovoCliError } from '@jovotech/cli-core';

import { AskSkillList } from './Interfaces';

export * from './Interfaces';
export * from './Constants';

/**
 * Checks if ask cli is installed.
 */
export async function checkForAskCli(): Promise<void> {
  const cmd = `ask --version`;

  try {
    const { stdout } = await execAsync(cmd);
    const majorVersion: string = stdout![0];
    if (parseInt(majorVersion) < 2) {
      throw new JovoCliError(
        'Jovo CLI requires ASK CLI @v2 or above.',
        'AlexaCli',
        'Please update your ASK CLI using "npm install ask-cli -g".',
      );
    }
  } catch (error) {
    if (error instanceof JovoCliError) {
      throw error;
    }

    throw new JovoCliError(
      'Jovo CLI requires ASK CLI',
      'AlexaCli',
      'Install the ASK CLI with "npm install ask-cli -g". Read more here: https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html',
    );
  }
}

/**
 * Generates a choice list out of an ASK skill list.
 * @param askSkillList - List of Alexa Skills returned by the ASK CLI.
 */
export function prepareSkillList(
  askSkillList: AskSkillList,
): Array<{ title: string; value: string }> {
  const choices: Array<{ title: string; value: string }> = [];
  for (const item of askSkillList.skills) {
    const key: string = Object.keys(item.nameByLocale)[0];
    let message: string = item.nameByLocale[key];

    const stage: string = item.stage === 'development' ? 'dev' : (item.stage as string);
    message +=
      ` ${stage === 'live' ? chalk.green(stage) : chalk.blue(stage)} ` +
      `- ${item.lastUpdated.substr(0, 10)}` +
      ` ${chalk.grey(item.skillId)}`;

    choices.push({
      title: message,
      value: item.skillId,
    });
  }
  return choices;
}

export function getAskError(method: string, stderr: string): JovoCliError {
  const module = 'AlexaCli';
  const splitter = '[Error]: ';

  const errorIndex: number = stderr.indexOf(splitter);
  if (errorIndex > -1) {
    const errorString: string = stderr.substring(errorIndex + splitter.length);
    const parsedError = JSON.parse(errorString);
    const payload = _get(parsedError, 'detail.response', parsedError);
    const message: string = payload.message;
    let violations = '';

    if (payload.violations) {
      for (const violation of payload.violations) {
        violations += violation.message;
      }
    }

    if (payload.detail) {
      violations = payload.detail.response.message;
    }

    return new JovoCliError(`${method}: ${message}`, module, violations);
  } else {
    // Try parsing for alternative error message.
    let i: number, pathRegex: RegExp;

    // Depending on the type of error message, try using different regular expressions to parse the actual error message.
    if (stderr.includes('CliFileNotFoundError')) {
      i = stderr.indexOf('CliFileNotFoundError');
      pathRegex = /File (\/.*\/)+(.*) not exists\./g;
    } else if (stderr.includes('ENOENT')) {
      i = stderr.indexOf('ENOENT');
      pathRegex = /'(\/.*\/)*(.*)'/g;
    } else {
      return new JovoCliError(stderr, module);
    }

    // Check for different error messages, if a file cannot be found.
    const parsedError: string = stderr.substring(i);
    const match = pathRegex.exec(parsedError);

    // File-specific error messages
    if (match && match.length > 2) {
      if (match[2] === 'cli_config') {
        return new JovoCliError(
          `ASK CLI is unable to find your configuration file at ${match[1]}.`,
          module,
          "Please configure at least one ask profile using the command 'ask configure'.",
        );
      }

      return new JovoCliError(
        `ASK CLI is unable to find your ${match[2]} at ${match[1]}.`,
        module,
        "If this error persists, try rebuilding your platform folder with 'jovo build'.",
      );
    }
  }

  return new JovoCliError(stderr, module);
}
