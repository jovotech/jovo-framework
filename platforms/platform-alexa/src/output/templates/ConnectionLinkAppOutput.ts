import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export enum DirectLaunchDefaultPromptBehavior {
  Speak = 'SPEAK',
  Suppress = 'SUPPRESS',
}

export interface ConnectionLinkAppOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
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
      topic: '',
      links: {},
      sendToDeviceEnabled: true,
      directLaunchEnabled: true,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {

    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: this.options.shouldEndSession,
              directives: [
                {
                  type: "Connections.StartConnection",
                  uri: "connection://AMAZON.LinkApp/2",
                  input: {
                    links: this.options.links,
                    prompt: {
                      topic: this.options.topic,
                      directLaunchDefaultPromptBehavior: this.options.directLaunchDefaultPromptBehavior
                    },
                    directLaunch: {
                      enabled: this.options.directLaunchEnabled
                    },
                    sendToDevice: {
                      enabled: this.options.sendToDeviceEnabled
                    }
                  },
                  token: this.options.token
                }
              ],
            },
          },
        },
      },
    };
  }
}
