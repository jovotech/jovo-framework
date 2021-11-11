import { MessageValue, NormalizedOutputTemplate } from '@jovotech/output';
import { Client, ClientEvent } from '../Client';

export class OutputProcessor {
  constructor(readonly client: Client) {}

  async processSequence(sequence: NormalizedOutputTemplate[]): Promise<void> {
    const reprompts = sequence
      .filter((outputTemplate) => !!outputTemplate.reprompt)
      .map((outputTemplate) => outputTemplate.reprompt) as MessageValue[];

    for (const output of sequence) {
      await this.processTemplate(output);
    }

    if (reprompts.length) {
      await this.client.repromptProcessor.processReprompts(
        reprompts,
        this.client.previousRecordingModality,
      );
    }
  }

  async processTemplate(output: NormalizedOutputTemplate): Promise<void> {
    this.client.emit(ClientEvent.Output, output);

    const text =
      typeof output.message === 'string'
        ? output.message
        : output.message?.speech || output.message?.text;
    if (!text) {
      return;
    }

    if (this.client.ssmlProcessor.isPlainText(text)) {
      await this.client.speechSynthesizer.speak(text);
    } else {
      await this.client.ssmlProcessor.processSSML(text);
    }
  }
}
