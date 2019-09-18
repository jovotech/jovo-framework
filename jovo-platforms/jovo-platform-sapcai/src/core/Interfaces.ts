import { Button } from '../response';

export interface EntityValue {
  isBuiltInEntity: boolean;
  // tslint:disable-next-line:no-any
  value: any;
  type: string | null;
}

export interface Message {
  type: string;
  content: MessageContent;
}

export type MessageContent = string | MessageContentObject | MessageContentObject[];

export interface MessageContentObject {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: Button[];
  elements?: MessageContentObject[];
}
