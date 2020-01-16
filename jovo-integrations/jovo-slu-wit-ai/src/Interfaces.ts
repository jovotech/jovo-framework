export interface WitAiEntity {
  confidence: number;
  value: string;
}

export interface WitAiInput extends WitAiEntity {
  suggested: boolean;
  type: string;
}

export interface WitAiIntent extends WitAiEntity {}

export interface WitAiResponse {
  _text: string;
  msg_id: string;
  entities: {
    [key: string]: Array<WitAiEntity | WitAiInput> | undefined;
    intent?: WitAiIntent[];
  };
}
