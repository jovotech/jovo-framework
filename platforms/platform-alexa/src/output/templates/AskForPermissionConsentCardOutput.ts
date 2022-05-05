import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { CardPermissionScopeLike } from '../models';

export interface AskForPermissionConsentCardOutputOptions extends OutputOptions {
  type?: 'AskForPermissionsConsent';
  permissions?: CardPermissionScopeLike[];
}

@Output()
export class AskForPermissionConsentCardOutput extends BaseOutput<AskForPermissionConsentCardOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] {
    return {
      listen: this.options.listen,
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
