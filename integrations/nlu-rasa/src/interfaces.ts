export interface RasaResponse {
  [key: string]: unknown;
  text: string;
  intent: RasaIntent;
  entities: RasaEntity[];
  intent_ranking: RasaIntent[];
}

export interface RasaIntent {
  id: number;
  name: string;
  confidence: number;
}

export interface RasaEntity {}
