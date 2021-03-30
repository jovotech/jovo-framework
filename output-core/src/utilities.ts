import { Card, Message, QuickReply } from '@jovotech/output';
import {
  ActionType,
  SpeechAction,
  VisualAction,
  VisualActionType,
  QuickReply as CoreQuickReply,
} from './models';

export function augmentModelPrototypes(): void {
  Card.prototype.toCoreVisualAction = function () {
    const action: VisualAction = {
      type: ActionType.Visual,
      visualType: this.imageUrl ? VisualActionType.ImageCard : VisualActionType.BasicCard,
      title: this.title,
    };
    if (this.subtitle) {
      action.body = this.subtitle;
    }
    if (this.imageUrl) {
      action.imageUrl = this.imageUrl;
    }
    return action;
  };

  Message.prototype.toCoreSpeechAction = function () {
    const action: SpeechAction = {
      type: ActionType.Speech,
      ssml: this.text,
      plain: this.text,
    };
    if (this.displayText) {
      action.displayText = this.displayText;
    }
    return action;
  };

  Message.prototype.toCoreTextAction = function () {
    return {
      type: ActionType.Text,
      text: this.text,
    };
  };

  QuickReply.prototype.toCoreQuickReply = function () {
    const quickReply: CoreQuickReply = {
      value: this.value || this.text,
    };
    if (this.value) {
      quickReply.label = this.text;
    }
    return quickReply;
  };
}
