export interface LuisIntent {
  score: number;
}

export interface LuisPrediction {
  topIntent: string;
  intents?: Record<string, LuisIntent>;
  entities?: Record<string, string[]>;
}

export interface LuisResponse {
  query: string;
  prediction: LuisPrediction;
}
