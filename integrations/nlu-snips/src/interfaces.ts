export interface SnipsNluSlot {
  entity: string;
  range: {
    start: number;
    end: number;
  };
  rawValue: string;
  slotName: string;
  value: {
    kind: string;
    value: string;
  };
}

export interface SnipsNluResponse {
  input: string;
  intent: {
    intentName?: string;
    probability: number;
  };
  slots: SnipsNluSlot[];
}
