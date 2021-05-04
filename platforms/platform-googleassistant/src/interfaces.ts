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
  resolved: string | PermissionResult | Record<string, any>;
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
