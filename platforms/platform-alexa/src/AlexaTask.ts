import { Alexa } from './Alexa';
import { Request } from './interfaces';

export class AlexaTask {
  constructor(private alexa: Alexa) {}

  getTask(): Request['task'] {
    return this.alexa.$request.request?.task;
  }

  get version(): string | undefined {
    return this.getTask()?.version;
  }

  get name(): string | undefined {
    return this.getTask()?.name;
  }

  get input(): Record<string, unknown> | undefined {
    return this.getTask()?.input;
  }

  /**
   * Looks at the task name and checks if it ends with the provided taskName. Ignores skillId prefix
   * @param taskName Task name without skill id
   * @returns true, if task name comes after the skill id
   */
  hasTaskName(taskName: string): boolean {
    if (!this.name) return false;
    return this.name.endsWith(`.${taskName}`);
  }

  isVersion(version: number | string): boolean {
    if (!this.version) return false;
    return this.version === `${version}`;
  }

  toJSON(): AlexaTask {
    return { ...this, alexa: undefined };
  }
}
