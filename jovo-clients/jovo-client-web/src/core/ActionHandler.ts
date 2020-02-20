import {
  Action,
  ActionType,
  ParallelAction,
  ResponseEvents,
  SequentialAction,
  SpeechAction,
} from '..';
import { CoreComponent } from './CoreComponent';

export class ActionHandler extends CoreComponent {
  readonly name = 'ActionHandler';

  // tslint:disable-next-line:no-any
  async handleAction(action: Action): Promise<any> {
    if (action.delay) {
      await this.delay(action.delay);
    }

    this.$client.emit(ResponseEvents.Action, action);

    switch (action.type) {
      case ActionType.Audio:
        // TODO check if this is needed: Currently all audio is embedded in audio tags by the tts providers and therefore evaluated as SpeechAction
        break;
      case ActionType.Speech:
        const { ssml, plain, displayText } = action as SpeechAction;
        // TODO: decide what to do when neither ssml nor plain is set.
        return this.$client.ssmlEvaluator.evaluate(ssml || plain || '');
      case ActionType.SequenceContainer:
        for (let i = 0, len = (action as SequentialAction).actions.length; i < len; i++) {
          await this.handleAction((action as SequentialAction).actions[i]);
        }
        break;
      case ActionType.ParallelContainer:
        const promises = [];
        for (let i = 0, len = (action as ParallelAction).actions.length; i < len; i++) {
          promises.push(this.handleAction((action as ParallelAction).actions[i]));
        }
        return Promise.all(promises);
      case ActionType.Processing:
        break;

      case ActionType.QuickReply:
        this.$client.emit(ResponseEvents.QuickReplies, action.replies);
        break;
      default:
        // tslint:disable-next-line:no-console
        console.info(`ActionType '${action.type}' is not supported yet.`);
    }
  }

  private delay(amountInMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, amountInMs);
    });
  }
}
