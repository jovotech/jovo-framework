import {
  Action,
  ActionType,
  AudioActionData,
  ProcessingActionData,
  QuickReply,
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

  addQuickReplies(quickReplies: Array<QuickReply | string>): ActionBuilder {
    const replies = [];
    for (let i = 0, len = replies.length; i < len; i++) {
      replies.push(
        typeof quickReplies[i] === 'string'
          ? {
              id: quickReplies[i],
              label: quickReplies[i],
              value: quickReplies[i],
            }
          : quickReplies[i],
      );
    }
    this.actions.push({ type: ActionType.QuickReply, replies });
    return this;
  }

  reset() {
    this.actions.splice(0);
  }

  build() {
    return this.actions.slice();
  }
}
