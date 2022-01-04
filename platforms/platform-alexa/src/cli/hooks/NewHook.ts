import type { NewContext, NewEvents } from '@jovotech/cli-command-new';
import { JovoModelData } from '@jovotech/model';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { AlexaCli } from '..';
import AlexaModel from '../boilerplate/AlexaModel.json';
import { AlexaContext } from '../interfaces';
import { AlexaHook } from './AlexaHook';

export class NewHook extends AlexaHook<NewEvents> {
  $plugin!: AlexaCli;
  $context!: NewContext & AlexaContext;

  install(): void {
    this.middlewareCollection = {
      new: [this.addSystemIntents.bind(this)],
    };
  }

  addSystemIntents(): void {
    const modelsPath: string = joinPaths(
      this.$cli.projectPath,
      this.$context.projectName,
      'models',
    );
    const modelFiles: string[] = readdirSync(modelsPath);

    for (const modelFile of modelFiles) {
      const modelPath: string = joinPaths(modelsPath, modelFile);
      const rawModelData: string = readFileSync(modelPath, 'utf-8');
      const model: JovoModelData = JSON.parse(rawModelData);
      const updatedModel: JovoModelData = { ...model, ...AlexaModel };

      writeFileSync(modelPath, JSON.stringify(updatedModel, null, 2));
    }
  }
}
