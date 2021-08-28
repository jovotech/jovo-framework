import { AnyObject } from '@jovotech/framework';

export interface Handler {
  name?: string;
}
export interface Intent {
  name: string;
  params: Record<string, IntentParameterValue>;
  query?: string;
}

export interface IntentParameterValue {
  original: string;
  resolved: string | PermissionResult | AnyObject;
}

export type PermissionStatus = 'PERMISSION_DENIED' | 'PERMISSION_GRANTED' | 'ALREADY_GRANTED';
export interface PermissionResult {
  'permissionStatus': PermissionStatus;
  '@type': string;
  'grantedPermissions': string[];
  'additionalUserData': {
    updateUserId: string;
  };
}

export interface Context {
  media: MediaContext;
}

export interface MediaContext {
  progress: string; // Example: "3.5s
}

export interface GoogleAccountProfile {
  [key: string]: string | number | boolean;

  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}
