import { Type } from '@jovotech/output';
import {
  Action,
  ActionType,
  AudioAction,
  ContainerAction,
  ProcessingAction,
  QuickReplyAction,
  SpeechAction,
  TextAction,
  VisualAction,
} from '../../models';

export function TransformAction(): PropertyDecorator {
  return Type(() => Action, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: AudioAction, name: ActionType.Audio },
        { value: ContainerAction, name: ActionType.SequenceContainer },
        { value: ContainerAction, name: ActionType.ParallelContainer },
        { value: ProcessingAction, name: ActionType.Processing },
        { value: QuickReplyAction, name: ActionType.QuickReply },
        { value: SpeechAction, name: ActionType.Speech },
        { value: TextAction, name: ActionType.Text },
        { value: VisualAction, name: ActionType.Visual },
      ],
    },
  }) as PropertyDecorator;
}
