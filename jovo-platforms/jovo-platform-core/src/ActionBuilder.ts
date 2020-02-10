import {
  Action,
  ActionType,
  AudioActionData,
  ProcessingActionData,
  QuickReplyActionData,
  SpeechActionData,
} from './Interfaces';

export class ActionBuilder {
  private readonly actions: Action[];

  constructor() {
    this.actions = [];
  }

  addContainer(
    actions: Action[],
    type:
      | ActionType.SequenceContainer
      | ActionType.ParallelContainer = ActionType.SequenceContainer,
  ): ActionBuilder {
    this.actions.push({ type, actions });
    return this;
  }

  addSpeech(data: SpeechActionData): ActionBuilder {
    this.actions.push({ type: ActionType.Speech, ...data });
    return this;
  }

  addAudio(data: AudioActionData): ActionBuilder {
    this.actions.push({ type: ActionType.Audio, ...data });
    return this;
  }

  addProcessingInformation(data: ProcessingActionData): ActionBuilder {
    this.actions.push({ type: ActionType.Processing, ...data });
    return this;
  }

  addQuickReplies(data: QuickReplyActionData): ActionBuilder {
    this.actions.push({ type: ActionType.QuickReply, ...data });
    return this;
  }

  reset() {
    this.actions.splice(0);
  }

  build() {
    return this.actions.slice();
  }
}
