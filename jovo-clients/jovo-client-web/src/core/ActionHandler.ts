import { Action, ActionType, SpeechAction } from '..';
import { CoreComponent } from './CoreComponent';

export class ActionHandler extends CoreComponent {
  async handleAction(action: Action) {
		switch (action.type) {
			case ActionType.Audio:
				// TODO check if this is needed: Currently all audio is embedded in audio tags by the tts providers and therefore evaluated as SpeechAction
				break;
			case ActionType.Speech:
				// TODO handle other cases as well if ssml is not set.
				return this.$client.ssmlEvaluator.evaluate((action as SpeechAction).ssml!);
			default:
				console.info(`ActionType '${action.type}' is not supported yet.`);
		}
	}
}
