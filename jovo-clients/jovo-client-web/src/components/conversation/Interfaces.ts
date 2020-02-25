export type ConversationPartType = 'request' | 'response';
export type ConversationPartSubType =
  | 'audio'
  | 'start'
  | 'end'
  | 'text'
  | 'text-audio'
  | 'processing';

export interface ConversationPart {
  value?: any;
  label: string;
  type: ConversationPartType;
  subType?: ConversationPartSubType;
}
