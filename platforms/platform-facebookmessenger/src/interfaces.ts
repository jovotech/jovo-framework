export interface MessengerBotEntry {
  id: string;
  time: number;
  /**
   * @link FacebookMessengerRequest#messaging
   */
  messaging: [MessagingData];
  $type?: string;
}

export interface MessagingData {
  sender: RequestIdentityData;
  recipient: RequestIdentityData;
  timestamp: number;
  message?: MessageData;
  postback?: PostbackData;
}

export interface RequestIdentityData {
  id: string;
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

export interface SendMessageResult {
  recipient_id: string;
  message_id: string;
}

export type SenderAction = 'mark_seen' | 'typing_on' | 'typing_off';
