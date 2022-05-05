import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { PermissionScopeLike, ConsentLevelLike } from '../../interfaces';

export interface PermissionScopeItem {
  permissionScope: PermissionScopeLike;
  consentLevel: ConsentLevelLike;
}

export interface ConnectionAskForPermissionConsentOutputOptions extends OutputOptions {
  shouldEndSession?: boolean;
  token?: string;
  permissionScopes: PermissionScopeItem[];
}

@Output()
export class ConnectionAskForPermissionConsentOutput extends BaseOutput<ConnectionAskForPermissionConsentOutputOptions> {
  getDefaultOptions(): ConnectionAskForPermissionConsentOutputOptions {
    return {
      permissionScopes: [],
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
                  uri: "connection://AMAZON.AskForPermissionsConsent/2",
                  input: {
                    "@type": "PrintWebPageRequest",
                    "@version": "1",
                    permissionScopes: this.options.permissionScopes,
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
