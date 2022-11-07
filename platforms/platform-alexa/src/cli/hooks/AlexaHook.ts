import {
  DefaultEvents,
  Events,
  JovoCliError,
  PluginHook,
  printUserInput,
  prompt,
} from '@jovotech/cli-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { AlexaCli } from '..';
import DefaultFiles from '../DefaultFiles.json';
import { AlexaContext, AskConfig, AskResources } from '../interfaces';

export abstract class AlexaHook<EVENTS extends Events = DefaultEvents> extends PluginHook<EVENTS> {
  $plugin!: AlexaCli;
  $context!: AlexaContext;

  updatePluginContext(): void {
    if (!this.$context.alexa) {
      this.$context.alexa = {};
    }

    this.$context.alexa.isACSkill = this.$plugin.config.conversations?.enabled;
  }

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
    const config: AskConfig | undefined = _get(DefaultFiles, '[".ask/"]["ask-states.json"]');
    if (config) {
      writeFileSync(this.$plugin.askConfigPath, JSON.stringify(config, null, 2));
    }
  }

  /**
   * Tries to get the ask profile from the "ask-resources.json" file
   */
  async getAskProfile(): Promise<string | undefined> {
    const askResources: AskResources = this.getAskResources();
    const profiles: string[] = Object.keys(askResources.profiles);

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
          message: `Found multiple ASK profiles in ask-resources.json. Which one do you want to use?`,
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
   * Returns Alexa resources file
   */
  getAskResources(): AskResources {
    try {
      return JSON.parse(readFileSync(this.$plugin.askResourcesPath, 'utf-8'));
    } catch (err) {
      throw new JovoCliError({
        message: 'Could not read ask resources file.',
        module: this.$plugin.name,
      });
    }
  }

  /**
   * Returns Alexa Config
   */
  getAskConfig(): AskConfig | undefined {
    if (existsSync(this.$plugin.askConfigPath)) {
      try {
        return JSON.parse(readFileSync(this.$plugin.askConfigPath, 'utf-8'));
      } catch (err) {
        throw new JovoCliError({
          message: 'Could not read ask configuration file.',
          module: this.$plugin.name,
        });
      }
    }
  }
}
