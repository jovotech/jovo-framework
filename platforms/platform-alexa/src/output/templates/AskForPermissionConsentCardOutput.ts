import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { PermissionScopeLike } from '../models';

export interface AskForPermissionConsentCardOutputOptions extends OutputOptions {
  type?: 'AskForPermissionsConsent';
  permissions?: PermissionScopeLike[];
}

@Output()
export class AskForPermissionConsentCardOutput extends BaseOutput<AskForPermissionConsentCardOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      message: this.options.message,
      platforms: {
        alexa: {
          nativeResponse: {
            response: {
              card: {
                type: 'AskForPermissionsConsent',
                permissions: this.options.permissions,
              },
            },
          },
        },
      },
    };
  }
}
