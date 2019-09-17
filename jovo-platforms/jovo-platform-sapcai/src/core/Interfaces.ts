export interface EntityValue {
  isBuiltInEntity: boolean;
  value: any;
  type: string | null;
}

export interface Message {
  type: string;
  content: MessageContent;
}

export type MessageContent = string | MessageContentObject;

export interface MessageContentObject {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  buttons?: MessageButton[];
  elements?: MessageContentObject[];
}

export interface MessageButton {
  title: string;
  value: string;
}
