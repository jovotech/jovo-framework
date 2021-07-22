import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export type PermissionScope =
  | 'alexa::alerts:reminders:skill:readwrite'
  | 'alexa::alerts:timers:skill:readwrite'
  | string;

export interface AskForPermissionOutputOptions extends OutputOptions {
  token?: string;
  permissions?: PermissionScope;
}

@Output()
export class AskForPermissionOutput extends BaseOutput<AskForPermissionOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: `<speak>${this.options.message}</speak>`,
      platforms: {
        Alexa: {
          nativeResponse: {
            response: {
              directives: [
                {
                  type: 'Connections.SendRequest',
                  name: 'AskFor',
                  payload: {
                    '@type': 'AskForPermissionsConsentRequest',
                    '@version': '1',
                    'permissionScope': this.options.permissions,
                  },
                  token: this.options.token || '',
                },
              ],
            },
          },
        },
      },
    };
  }
}
