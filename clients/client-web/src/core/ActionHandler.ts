import {
  Client,
  ClientEvent,
  delay,
} from '..';

export class ActionHandler {
  constructor(readonly client: Client) {}

  async handleActions(actions: any[]): Promise<void> {
    for (let i = 0, len = actions.length; i < len; i++) {
      await this.handleAction(actions[i]);
    }
  }

  async handleAction(action: any): Promise<void> {
    if (action.delay) {
      await delay(action.delay);
    }

    this.client.emit(ClientEvent.Action, action);

    switch (action.type) {
      case 'sequence':
        return this.handleActions(action.actions);
      case 'parallel':
        const promises = [];
        for (let i = 0, len = action.actions.length; i < len; i++) {
          promises.push(this.handleAction(action.actions[i]));
        }
        await Promise.all(promises);
        break;
      case 'speech':
        const { ssml, plain, displayText } = action;
        return this.client.ssmlHandler.handleSSML(ssml || plain || displayText || '');
      case 'quickReply':
      case 'custom':
        break;
      default:
        console.info(`ActionType ${action.type} is not supported currently.`);
    }
  }
}
