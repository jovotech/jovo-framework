export interface BusinessMessagesBaseRequest {
  agent: string;
  conversationId: string;
  customAgentId: string;
  requestId: string;
  context?: {
    entryPoint: 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS';
    placeId: string;
    userInfo: {
      displayName: string;
    };
  };
  sendTime: string; // RFC3339 UTC "Zulu" format
}

export interface BusinessMessagesMessageRequest extends BusinessMessagesBaseRequest {
  message: {
    messageId: string;
    name: string;
    text: string;
    createTime: string; // RFC3339 UTC "Zulu" format
  };
}

export interface BusinessMessagesSuggestionRequest extends BusinessMessagesBaseRequest {
  suggestionResponse: {
    message: string;
    postbackData: string;
    createTime: string; // RFC3339 UTC "Zulu" format
    text: string;
    suggestionType: 'UNKNOWN' | 'ACTION' | 'REPLY';
  };
}

export interface BaseResponse {
  name: string;
  messageId: string;
  representative: {
    displayName?: string;
    representativeType: 'REPRESENTATIVE_TYPE_UNSPECIFIED' | 'BOT' | 'HUMAN';
  };
  suggestions?: Suggestion[];
  fallback?: string;
}

export type Suggestion = SuggestedReply | SuggestActionUrl | SuggestActionDial;

export interface SuggestedReply {
  reply: {
    text: string;
    postbackData: string;
  };
}

export interface SuggestActionUrl {
  action: {
    text: string;
    postbackData: string;
    openUrlAction: {
      url: string;
    };
  };
}

export interface SuggestActionDial {
  action: {
    text: string;
    postbackData: string;
    dialAction: {
      phoneNumber: string;
    };
  };
}

export interface TextResponse extends BaseResponse {
  text: string;
}

export interface StandaloneCardResponse extends BaseResponse {
  richCard: {
    standaloneCard: RichCard;
  };
}

export interface RichCard {
  cardContent: Card;
}

export interface CarouselCardResponse extends BaseResponse {
  richCard: {
    carouselCard: CarouselCard;
  };
}

export interface CarouselCard {
  cardWidth: 'CARD_WIDTH_UNSPECIFIED' | 'SMALL' | 'MEDIUM';
  cardContents: Card[];
}

export interface Card {
  title?: string;
  description?: string;
  media?: {
    height: 'HEIGHT_UNSPECIFIED' | 'SHORT' | 'MEDIUM' | 'TALL';
    contentInfo: {
      fileUrl: string;
      thumbnailUrl: string;
      forceRefresh?: boolean;
      altText: string;
    };
  };
  suggestions: Suggestion[];
}

export interface GoogleServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
