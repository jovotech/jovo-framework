export type ConversationPartType = 'request' | 'response';
export type ConversationPartSubType = 'speech' | 'reprompt' | 'start' | 'end' | 'text';

export interface ConversationPart {
  value?: any;
  label: string;
  type: ConversationPartType;
  subType?: ConversationPartSubType;
}
