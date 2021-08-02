import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';

export type PermissionScope =
  | 'alexa::alerts:reminders:skill:readwrite'
  | 'alexa::alerts:timers:skill:readwrite'
  | string;

export interface AskForPermissionOutputOptions extends OutputOptions {
  token?: string;
  permissionScope?: PermissionScope;
}

@Output()
export class AskForPermissionOutput extends BaseOutput<AskForPermissionOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
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
                    'permissionScope': this.options.permissionScope,
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
