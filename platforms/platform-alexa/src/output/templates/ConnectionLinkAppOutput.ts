import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';

export enum DirectLaunchDefaultPromptBehavior {
  Speak = 'SPEAK',
  Suppress = 'SUPPRESS',
}

export interface ConnectionLinkAppOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  topic: string;
  links: unknown;
  directLaunchDefaultPromptBehavior?: DirectLaunchDefaultPromptBehavior;
  sendToDeviceEnabled: boolean;
  directLaunchEnabled: boolean;
}

@Output()
export class ConnectionLinkAppOutput extends BaseOutput<ConnectionLinkAppOutputOptions> {
  getDefaultOptions(): ConnectionLinkAppOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      topic: '',
      links: {},
      sendToDeviceEnabled: true,
      directLaunchEnabled: true,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {
    const shouldEndSession =
      this.options.onCompletion === OnCompletion.SendErrorsOnly
        ? true
        : this.options.shouldEndSession;

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession,
              directives: [
                {
                  type: 'Connections.StartConnection',
                  uri: 'connection://AMAZON.LinkApp/2',
                  input: {
                    links: this.options.links,
                    prompt: {
                      topic: this.options.topic,
                      directLaunchDefaultPromptBehavior:
                        this.options.directLaunchDefaultPromptBehavior,
                    },
                    directLaunch: {
                      enabled: this.options.directLaunchEnabled,
                    },
                    sendToDevice: {
                      enabled: this.options.sendToDeviceEnabled,
                    },
                  },
                  token: this.options.token,
                  onCompletion: this.options.onCompletion,
                },
              ],
            },
          },
        },
      },
    };
  }
}
