import {
  DefaultEvents,
  Events,
  JovoCliError,
  PluginHook,
  printUserInput,
  prompt,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import _get from 'lodash.merge';
import _set from 'lodash.set';
import { AlexaCli } from '..';
import DefaultFiles from '../DefaultFiles.json';
import { AlexaContext, AskConfig } from '../interfaces';

export abstract class AlexaHook<EVENTS extends Events = DefaultEvents> extends PluginHook<EVENTS> {
  readonly $plugin!: AlexaCli;
  readonly $context!: AlexaContext;

  /**
   * Saves Alexa Skill ID to .ask/config.
   * @param skillId
   */
  setSkillId(skillId: string): void {
    const askConfigFolderPath = this.$plugin.askConfigFolderPath;

    if (!existsSync(askConfigFolderPath)) {
      mkdirSync(askConfigFolderPath);
    }

    // Check if ask-states.json exists, if not, create it.
    if (!existsSync(this.$plugin.askConfigPath)) {
      this.createEmptyAskConfig();
    }

    const askConfig = JSON.parse(readFileSync(this.$plugin.askConfigPath, 'utf-8'));

    const askProfile: string = this.$context.alexa.askProfile || 'default';
    _set(askConfig, `profiles.${askProfile}.skillId`, skillId);

    writeFileSync(this.$plugin.askConfigPath, JSON.stringify(askConfig, null, 2));
  }

  /**
   * Creates an empty ask config file.
   */
  createEmptyAskConfig(): void {
    const config = _get(DefaultFiles, '[".ask"]["ask-states.json"]');
    writeFileSync(this.$plugin.askConfigPath, config);
  }

  /**
   * Tries to get the ask profile from the ask config file
   */
  async getAskProfile(): Promise<string | undefined> {
    const askConfig = this.getAskConfig();
    const profiles: string[] = Object.keys(askConfig.profiles);

    if (!profiles.length) {
      return;
    }

    if (profiles.length === 1) {
      return profiles[0];
    } else {
      const { askProfile } = await prompt(
        {
          name: 'askProfile',
          type: 'select',
          message: `Found multiple ASK profiles in .ask/ask-states.json. Which one do you want to use?`,
          choices: profiles.map((profile) => ({ title: printUserInput(profile), value: profile })),
        },
        {
          onCancel() {
            process.exit();
          },
        },
      );
      return askProfile;
    }
  }

  /**
   * Returns Alexa Config
   */
  getAskConfig(): AskConfig {
    try {
      return JSON.parse(readFileSync(this.$plugin.askConfigPath, 'utf8'));
    } catch (err) {
      throw new JovoCliError({
        message: 'Could not read ask configuration file.',
        module: this.$plugin.constructor.name,
      });
    }
  }
}
