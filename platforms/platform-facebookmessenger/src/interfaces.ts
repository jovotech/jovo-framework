export interface FacebookMessengerEntry {
  id: string;
  time: number;
  /**
   * @link FacebookMessengerRequest#messaging
   */
  messaging: [MessagingData];
}

export interface MessagingData {
  sender: IdentityData;
  recipient: IdentityData;
  timestamp: number;
  message?: MessageData;
  postback?: PostbackData;
}

export interface IdentityData {
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
