export enum MessageType {
  Response = 'RESPONSE',
  Update = 'UPDATE',
  MessageTag = 'MESSAGE_TAG',
}

export enum AttachmentType {
  Audio = 'audio',
  Video = 'video',
  Image = 'image',
  File = 'file',
}

export enum TemplateType {
  Generic = 'generic',
  Button = 'button',
  Receipt = 'receipt',
  Airline = 'airline_boardingpass',
  Media = 'media',
}

export enum ButtonType {
  Link = 'web_url',
  Postback = 'postback',
  Call = 'phone_number',
  Login = 'account_link',
  Logout = 'account_unlink',
  Game = 'game_play',
}

export enum WebViewHeightRatio {
  Compact = 'COMPACT',
  Tall = 'TALL',
  Full = 'FULL',
}

export enum WebViewShareButton {
  Hide = 'hide',
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
}

export enum QuickReplyContentType {
  Text = 'text',
  PhoneNumber = 'user_phone_number',
  Email = 'user_email',
}

export enum SenderActionType {
  MarkSeen = 'mark_seen',
  TypingOn = 'typing_on',
  TypingOff = 'typing_off',
}

export enum PersistentMenuItemType {
  Link = 'web_url',
  Postback = 'postback',
}

export enum DisabledSurfaces {
  CustomerChatPlugin = 'customer_chat_plugin',
}
