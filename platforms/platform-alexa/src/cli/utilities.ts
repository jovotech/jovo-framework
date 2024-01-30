import { ParseError } from '@alexa/acdl';
import {
  execAsync,
  ExecResponse,
  getRawString,
  isJovoCliError,
  JovoCliError,
  Log,
  prompt,
} from '@jovotech/cli-core';
import chalk from 'chalk';
import { ExecOptions } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import _get from 'lodash.get';
import { join as joinPaths } from 'path';
import { AskSkillChoice, AskSkillList } from './interfaces';

/**
 * Checks if ask cli is installed.
 */
export async function checkForAskCli(): Promise<void> {
  try {
    const { stdout } = await execAsync('ask --version');
    const majorVersion: number = parseInt(stdout![0]);
    const minorVersion: number = parseInt(stdout!.slice(2, 4));
    if (majorVersion < 2 || (majorVersion == 2 && minorVersion < 30)) {
      throw new JovoCliError({
        message: 'Jovo CLI requires ASK CLI @v2.30.0 or above.',
        module: 'AlexaCli',
        hint: 'Please update your ASK CLI using "npm install ask-cli -g".',
      });
    }
  } catch (error) {
    if (!isJovoCliError(error)) {
      throw new JovoCliError({
        message: 'Jovo CLI requires ASK CLI',
        module: 'AlexaCli',
        hint: 'Install the ASK CLI with "npm install ask-cli -g".',
        learnMore:
          'https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html',
      });
    }
    throw error;
  }
}

/**
 * Generates a choice list out of an ASK skill list.
 * @param askSkillList - List of Alexa Skills returned by the ASK CLI.
 */
export function prepareSkillList(askSkillList: AskSkillList): AskSkillChoice[] {
  const choices: AskSkillChoice[] = [];

  for (const item of askSkillList.skills) {
    const key: string = Object.keys(item.nameByLocale)[0];
    let message: string = item.nameByLocale[key];

    const stage: string = item.stage === 'development' ? 'dev' : item.stage;
    message +=
      ` ${stage === 'live' ? chalk.green(stage) : chalk.blue(stage)} ` +
      `- ${item.lastUpdated.substr(0, 10)}` +
      ` ${chalk.grey(item.skillId)}`;

    choices.push({
      title: message,
      value: {
        skillId: item.skillId,
        stage: item.stage,
      },
    });
  }
  return choices;
}

export function getACValidationErrorHint(errors: ParseError[]): string {
  return errors.reduce((output: string, error: ParseError) => {
    return [
      Log.info(output, { dry: true }),
      Log.info(chalk.dim(`[${error.code.code}]`), {
        dry: true,
        newLine: false,
      }),
      Log.info(error.message, { dry: true, newLine: false }),
      error.uri
        ? Log.info(chalk.dim(`in ${error.uri.split('/').pop()!}`), {
            dry: true,
            newLine: false,
          })
        : undefined,
      error.loc
        ? Log.info(chalk.dim(`(l. ${error.loc.begin.line})`), {
            dry: true,
            newLine: false,
          })
        : undefined,
    ].join(' ');
  }, '');
}

export function getAskError(method: string, stderr: string): JovoCliError {
  const module = 'AlexaCli';
  const splitter = '[Error]: ';

  const errorIndex: number = stderr.indexOf(splitter);
  if (errorIndex > -1) {
    const errorString: string = getRawString(stderr.substring(errorIndex + splitter.length));
    const parsedError = JSON.parse(errorString);
    const payload = _get(parsedError, 'detail.response', parsedError);
    const message: string = payload.message;
    let violations = '';

    if (payload.violations) {
      for (const violation of payload.violations) {
        violations += violation.message;
      }
    }

    if (payload.detail?.response?.message) {
      violations = payload.detail.response.message;
    }

    return new JovoCliError({ message: `${method}: ${message}`, module, details: violations });
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
      return new JovoCliError({ message: stderr, module });
    }

    // Check for different error messages, if a file cannot be found.
    const parsedError: string = stderr.substring(i);
    const match = pathRegex.exec(parsedError);

    // File-specific error messages
    if (match && match.length > 2) {
      if (match[2] === 'cli_config') {
        return new JovoCliError({
          message: `ASK CLI is unable to find your configuration file at ${match[1]}.`,
          module,
          hint: "Please configure at least one ask profile using the command 'ask configure'.",
        });
      }

      return new JovoCliError({
        message: `ASK CLI is unable to find your ${match[2]} at ${match[1]}.`,
        module,
        hint: 'If this error persists, try rebuilding your platform folder using "jovo build:platform alexa".',
      });
    }
  }

  return new JovoCliError({ message: stderr, module });
}

export function copyFiles(src: string, dest: string): void {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  for (const file of readdirSync(src)) {
    const srcFile: string = joinPaths(src, file);
    const destFile: string = joinPaths(dest, file);

    if (statSync(srcFile).isDirectory()) {
      copyFiles(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  }
}

export async function execAskCommand(
  id: string,
  cmd: string | string[],
  askProfile?: string,
  execOptions?: ExecOptions,
): Promise<ExecResponse> {
  if (!Array.isArray(cmd)) {
    cmd = [cmd];
  }

  if (askProfile) {
    cmd.push(`-p ${askProfile}`);
  }

  try {
    return await execAsync(cmd.join(' '), execOptions);
  } catch (error) {
    throw getAskError(id, error.stderr || error.message);
  }
}

/**
 * Prompt for a project, depending on provided choices.
 * @param choices - Array of choices (projects) to choose from.
 */
export async function promptListForAlexaSkill(choices: AskSkillChoice[]): Promise<{
  skill: {
    skillId: string;
    stage: string;
  };
}> {
  return await prompt(
    {
      name: 'skill',
      type: 'select',
      message: 'Select your project:',
      choices,
    },
    {
      onCancel() {
        process.exit();
      },
    },
  );
}
