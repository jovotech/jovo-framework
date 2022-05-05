import { EnumLike } from "@jovotech/framework";

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
