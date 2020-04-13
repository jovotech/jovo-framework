import { QuickReplyContentType } from './Enums';

export type ApiVersion = 'v5.0' | 'v6.0';

export interface MessengerBotEntry {
  id: string;
  time: number;
  messaging: [MessagingData];
}

export interface MessagingData {
  sender: IdentityData;
  recipient: IdentityData;
  timestamp: number;
  message?: MessageData;
  postback?: PostbackData;
}

export interface MessageData {
  mid: string;
  text: string;
  quick_reply?: {
    payload: string | number;
  };
}

export interface PostbackData {
  title: string;
  payload: string;
}

export interface IdentityData {
  id: string;
}

export interface Field {
  label: string;
  value: string;
}

export interface QuickReply {
  content_type: QuickReplyContentType;
  title?: string;
  payload?: string | number;
  image_url?: string;
}

export interface UserProfile {
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  locale?: string;
  id: string;
}
