import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ConnectionPermissionScopeLike, ConsentLevelLike } from '../models';
import { OnCompletion } from '../models/common/OnCompletion';

export interface PermissionScopeItem {
  permissionScope: ConnectionPermissionScopeLike;
  consentLevel: ConsentLevelLike;
}

export interface ConnectionAskForPermissionConsentOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  onCompletion: OnCompletion;
  permissionScopes: PermissionScopeItem[];
}

@Output()
export class ConnectionAskForPermissionConsentOutput extends BaseOutput<ConnectionAskForPermissionConsentOutputOptions> {
  getDefaultOptions(): ConnectionAskForPermissionConsentOutputOptions {
    return {
      onCompletion: OnCompletion.ResumeSession,
      permissionScopes: [],
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
                  uri: 'connection://AMAZON.AskForPermissionsConsent/2',
                  input: {
                    '@type': 'AskForPermissionsConsentRequest',
                    '@version': '2',
                    'permissionScopes': this.options.permissionScopes,
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
