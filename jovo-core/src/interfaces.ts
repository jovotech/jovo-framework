export interface RequestData {}

export interface SessionData {}

export interface UserData {}

export interface Entity {
  id?: string;
  key?: string;
  name?: string;
  value?: unknown;
}

export interface AsrData {
  [key: string]: unknown;
  text?: string;
}

export interface NluData {
  [key: string]: unknown;
  intent?: {
    name: string;
  };
  entities?: Record<string, Entity>;
}
