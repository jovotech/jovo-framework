import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { PermissionScope } from './AskForPermissionOutput';

export interface AskForPermissionConsentCardOutputOptions extends OutputOptions {
  type?: 'AskForPermissionsConsent';
  permissions?: PermissionScope[];
}

@Output()
export class AskForPermissionConsentCardOutput extends BaseOutput<AskForPermissionConsentCardOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        Alexa: {
          nativeResponse: {
            response: {
              card: {
                type: 'AskForPermissionsConsent',
                permissions: this.options.permissionScope,
              },
            },
          },
        },
      },
    };
  }
}
