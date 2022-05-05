import { BaseOutput, Output, OutputOptions, OutputTemplate, EnumLike } from '@jovotech/framework';

export enum ConsentLevel {
  Account = 'ACCOUNT',
  Person = 'PERSON',
}

export type ConsentLevelLike = EnumLike<ConsentLevel> | string;

export enum PermissionScope {
  ReadProfileGivenName = 'alexa::profile:given_name:read',
  ReadProfileName = 'alexa::profile:name:read',
  ReadProfileMobileNumber = 'alexa::profile:mobile_number:read',
  ReadProfileEmail = 'alexa::profile:email:read',
  ReadAddressCountryAndPostalCode = 'alexa:devices:all:address:country_and_postal_code:read',
  ReadGeolocation = 'alexa::devices:all:geolocation:read',
  ReadWriteTimers = 'alexa::alerts:timers:skill:readwrite',
  ReadWriteReminders = 'alexa::alerts:reminders:skill:readwrite',
}

export type PermissionScopeLike = EnumLike<PermissionScope> | string;

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
