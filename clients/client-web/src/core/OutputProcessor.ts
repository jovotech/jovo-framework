import { Client } from '../Client';
import { OutputTemplate } from '@jovotech/output';

export class OutputProcessor {
  constructor(readonly client: Client) {}

  async processSequence(sequence: OutputTemplate[]): Promise<void> {
    for (const output of sequence) {
      await this.processTemplate(output);
    }
  }

  async processTemplate(output: OutputTemplate): Promise<void> {
    // TODO implement me
  }
}
