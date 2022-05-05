import { Entity, EnumLike, JovoSession, PartialWhere } from '@jovotech/framework';
import { Intent, Slot } from './output';

export interface Session {
  new: boolean;
  sessionId: string;
  application: Application;
  attributes: JovoSession;
  user: User;
  person: Person;
}

export interface Context {
  System: System;
  Viewport?: Viewport;
  AudioPlayer?: AudioPlayerContext;
  Geolocation?: Geolocation;
}

export type PlayerActivity = 'PLAYING' | 'PAUSED' | 'FINISHED' | 'BUFFER_UNDERRUN' | 'IDLE';

export interface AudioPlayerContext {
  token: string;
  offsetInMilliseconds: number;
  playerActivity: PlayerActivity;
}

export interface Geolocation {
  // Either "locationServices" or "coordinate" will be present
  locationServices?: LocationServices;
  timestamp: string; // ISO 8601
  coordinate?: Coordinate;
  altitude?: Altitude;
  heading?: Heading;
  speed?: Speed;
}

export type LocationServicesAccess = 'ENABLED' | 'DISABLED';
export type LocationServicesStatus = 'RUNNING' | 'STOPPED';

export interface LocationServices {
  access: LocationServicesAccess;
  status: LocationServicesStatus;
}

export interface Coordinate {
  latitudeInDegrees: number; // [-90.0, 90.0]
  longitudeInDegrees: number; // [-180.0, 190.0]
  accuracyInMeters: number; // [0, MAX_INTEGER]
}

export interface Altitude {
  altitudeInMeters?: number; // [-6350, 18000]
  accuracyInMeters?: number; // [0, MAX_INTEGER]
}

export interface Heading {
  directionInDegrees?: number; // (0, 360.0]
  accuracyInDegrees?: number; // [0, MAX_INTEGER]
}

export interface Speed {
  speedInMetersPerSecond?: number; // [0, 1900] not optional if automotive
  accuracyInMetersPerSecond?: number; // [0, MAX_INTEGER]
}

export type PermissionStatus = 'DENIED' | 'ACCEPTED' | 'NOT_ANSWERED';

export interface Unit {
  unitId: string;
  persistentUnitId: string;
}

export interface System {
  application: Application;
  user: User;
  person: Person;
  device: Device;
  apiEndpoint: string;
  apiAccessToken: string;
  unit?: Unit;
}

export interface Viewport {
  experiences: Experience[];
  shape: 'RECTANGLE' | 'ROUND';
  pixelWidth: number;
  pixelHeight: number;
  dpi: number;
  currentPixelWidth: number;
  currentPixelHeight: number;

  touch?: TouchMethod[];
  keyboard?: InputMechanism[];
  video?: { codecs: string[] };
}

export interface Experience {
  arcMinuteWidth: number;
  arcMinuteHeight: number;
  canRotate: boolean;
  canResize: boolean;
}

export type TouchMethod = 'SINGLE';
export type InputMechanism = 'DIRECTION';

export interface AudioPlayerInterface {}
export interface AlexaPresentationAplInterface {
  runtime: {
    maxVersion: string;
  };
}
export interface AlexaPresentationAplTInterface extends AlexaPresentationAplInterface {}
export interface AlexaPresentationHtmlInterface extends AlexaPresentationAplInterface {}

export interface DisplayInterface {
  templateVersion?: string;
  markupVersion?: string;
}

export interface VideoAppInterface {}
export interface GeolocationInterface {}
export interface NavigationInterface {}

export interface Device {
  deviceId: string;
  supportedInterfaces?: {
    'Alexa.Presentation.APL'?: AlexaPresentationAplInterface;
    'AudioPlayer'?: AudioPlayerInterface;
    'Alexa.Presentation.APLT'?: AlexaPresentationAplTInterface;
    'Alexa.Presentation.HTML'?: AlexaPresentationHtmlInterface;
    'Display'?: DisplayInterface;
    'VideoApp'?: VideoAppInterface;
    'Geolocation'?: GeolocationInterface;
    'Navigation'?: NavigationInterface;
  };
}

export interface User {
  userId: string;
  accessToken: string;
  permissions: Permission;
}

export interface Person {
  personId: string;
  accessToken: string;
}

export interface Permission {
  consentToken: string;
}

export interface Application {
  applicationId: string;
}

export interface AlexaEntity extends Entity {
  native: Slot;
}

export enum PurchaseResult {
  Accepted = 'ACCEPTED',
  Declined = 'DECLINED',
  AlreadyPurchased = 'ALREADY_PURCHASED',
  Error = 'ERROR',
}
export type PurchaseResultLike = EnumLike<PurchaseResult> | string;

export interface Request {
  type: string;
  requestId: string;
  timestamp: string;
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments?: any[];
  token?: string;
  offsetInMilliseconds?: number;
  // TODO: Use the same type
  intent?: PartialWhere<Intent, 'confirmationStatus' | 'slots'>;
  status?: {
    // Connections.Response
    code: string;
    message: string;
  };
  name?: string; // Connections.Response
  payload?: {
    // Connections.Response
    purchaseResult?: PurchaseResultLike;
    productId?: string;
    isCardThrown?: boolean;
    permissionScope?: string;
    status?: PermissionStatus;
  };
  error?: {
    // System.ExceptionEncountered
    type: string;
    message: string;
  };
  cause?: {
    // System.ExceptionEncountered
    requestId: string;
  };
  originatingRequestId?: string; // GameEngine.InputHandlerEvent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
  reason?: string; // SessionEndedRequest
  eventCreationTime?: string; // AlexaSkillEvent.*
  eventPublishingTime?: string; // AlexaSkillEvent.*
  dialogState?: string;
  apiRequest?: {
    name: string;
    arguments: Record<string, string>;
    slots: Record<string, Slot>;
  };
  body?: {
    acceptedPermissions?: { scope: string }[];
    acceptedPersonPermissions?: { scope: string }[];
  };
}

// Defines a target for Alexa Conversations
export type ConversationsTarget = 'AMAZON.Conversations' | 'skill';

export interface ConnectionPostalAddress {
  "@type": "PostalAddress",
  "@version": "1",
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  country?: string;
}

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


