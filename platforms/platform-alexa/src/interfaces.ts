import { Entity, JovoSession } from '@jovotech/framework';
import { ConfirmationStatus, Resolutions } from './output';

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

export interface AudioPlayerContext {
  token: string;
  offsetInMilliseconds: number;
  playerActivity: string;
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

export interface System {
  application: Application;
  user: User;
  person: Person;
  device: Device;
  apiEndpoint: string;
  apiAccessToken: string;
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

export interface RequestSlot {
  name: string;
  confirmationStatus?: ConfirmationStatus;
  value: string;
  source?: string;
  resolutions?: Resolutions;
}

export interface RequestIntent {
  name: string;
  confirmationStatus?: ConfirmationStatus;
  slots?: { [key: string]: RequestSlot };
}

export interface AlexaEntity extends Entity {
  native: RequestSlot;
}

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
  intent?: RequestIntent;
  status?: {
    // Connections.Response
    code: string;
    message: string;
  };
  name?: string; // Connections.Response
  payload?: {
    // Connections.Response
    purchaseResult?: string;
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
}
