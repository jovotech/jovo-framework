import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { PermissionScopeLike } from '@jovotech/output-alexa';

export interface AskForPermissionOutputOptions extends OutputOptions {
  token?: string;
  permissionScope?: PermissionScopeLike;
}

@Output()
export class AskForPermissionOutput extends BaseOutput<AskForPermissionOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              shouldEndSession: true,
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
