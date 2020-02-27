import { AudioData, BaseApp, HandleRequest, Host, Jovo } from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import { ActionBuilder } from '../ActionBuilder';
import { Action, ActionType, QuickReply } from '../Interfaces';
import { CorePlatformRequest } from './CorePlatformRequest';
import { CorePlatformResponse } from './CorePlatformResponse';
import { CorePlatformSpeechBuilder } from './CorePlatformSpeechBuilder';
import { CorePlatformUser } from './CorePlatformUser';

export class CorePlatformApp extends Jovo {
  $corePlatformApp: CorePlatformApp;
  $user!: CorePlatformUser;

  $actions: ActionBuilder;
  $repromptActions: ActionBuilder;

  constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
    super(app, host, handleRequest);
    this.$corePlatformApp = this;
    this.$response = new CorePlatformResponse();
    this.$speech = new CorePlatformSpeechBuilder(this);
    this.$reprompt = new CorePlatformSpeechBuilder(this);

    this.$actions = new ActionBuilder();
    this.$repromptActions = new ActionBuilder();
    this.$output.CorePlatform = {
      Actions: [],
      RepromptActions: [],
    };
  }

  getDeviceId(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return this.$request ? this.$request.getLocale() : undefined;
  }

  getPlatformType(): string {
    return 'CorePlatform';
  }

  getRawText(): string | undefined {
    return _get(this, `$request.request.body.text`);
  }

  getAudioData(): AudioData | undefined {
    return _get(this, `$request.request.body.audio`);
  }

  getSelectedElementId(): string | undefined {
    return undefined;
  }

  getTimestamp(): string | undefined {
    return this.$request ? this.$request.getTimestamp() : undefined;
  }

  getType(): string | undefined {
    return 'CorePlatformApp';
  }

  hasAudioInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasAudioInterface();
  }

  hasScreenInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasScreenInterface();
  }

  hasVideoInterface(): boolean {
    return (this.$request as CorePlatformRequest).hasVideoInterface();
  }

  hasTextInput(): boolean {
    return (this.$request as CorePlatformRequest).hasTextInput();
  }

  isNewSession(): boolean {
    return this.$request ? this.$request.isNewSession() : false;
  }

  speechBuilder(): CorePlatformSpeechBuilder | undefined {
    return this.getSpeechBuilder();
  }

  getSpeechBuilder(): CorePlatformSpeechBuilder | undefined {
    return new CorePlatformSpeechBuilder(this);
  }

  // Output methods
  setActions(actions: Action[] | ActionBuilder): CorePlatformApp {
    this.$output.CorePlatform.Actions =
      actions instanceof ActionBuilder ? actions.build() : actions;
    return this;
  }

  addActions(actions: Action[] | ActionBuilder): CorePlatformApp {
    this.$output.CorePlatform.Actions.push(
      ...(actions instanceof ActionBuilder ? actions.build() : actions),
    );
    return this;
  }

  setRepromptActions(actions: Action[] | ActionBuilder): CorePlatformApp {
    this.$output.CorePlatform.RepromptActions =
      actions instanceof ActionBuilder ? actions.build() : actions;
    return this;
  }

  addRepromptActions(actions: Action[] | ActionBuilder): CorePlatformApp {
    this.$output.CorePlatform.RepromptActions.push(
      ...(actions instanceof ActionBuilder ? actions.build() : actions),
    );
    return this;
  }

  showQuickReplies(replies: Array<string | QuickReply>): CorePlatformApp {
    this.$output.CorePlatform.Actions.push({
      replies: replies.map((reply) => {
        return typeof reply === 'string'
          ? {
              id: reply,
              label: reply,
              value: reply,
            }
          : reply;
      }),
      type: ActionType.QuickReply,
    });

    return this;
  }
}
