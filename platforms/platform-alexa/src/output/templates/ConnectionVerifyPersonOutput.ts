import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { OnCompletion } from '../models/common/OnCompletion';

export enum PolicyName {
  VoicePin = 'VOICE_PIN',
}

export interface ConnectionVerifyPersonOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  level: number;
  policyName: PolicyName;
}

@Output()
export class ConnectionVerifyPersonOutput extends BaseOutput<ConnectionVerifyPersonOutputOptions> {
  getDefaultOptions(): ConnectionVerifyPersonOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      level: 400,
      policyName: PolicyName.VoicePin,
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
                  uri: 'connection://AMAZON.VerifyPerson/2',
                  input: {
                    requestedAuthenticationConfidenceLevel: {
                      level: this.options.level,
                      customPolicy: {
                        policyName: this.options.policyName,
                      },
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
