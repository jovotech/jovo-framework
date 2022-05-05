import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export enum PolicyName {
  VoicePin = 'VOICE_PIN',
}

export interface ConnectionVerifyPersonOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  level: number;
  policyName: PolicyName;
}

@Output()
export class ConnectionVerifyPersonOutput extends BaseOutput<ConnectionVerifyPersonOutputOptions> {
  getDefaultOptions(): ConnectionVerifyPersonOutputOptions {
    return {
      level: 400,
      policyName: PolicyName.VoicePin,
    };
  }

  build(): OutputTemplate | OutputTemplate[] {

    return {
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: this.options.shouldEndSession,
              directives: [
                {
                  type: "Connections.StartConnection",
                  uri: "connection://AMAZON.VerifyPerson/2",
                  input: {
                    requestedAuthenticationConfidenceLevel: {
                      level: this.options.level,
                      customPolicy: {
                        policyName: this.options.policyName,
                      }
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
