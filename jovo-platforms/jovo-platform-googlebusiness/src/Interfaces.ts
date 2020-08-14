export type EntryPoint = 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS';

export interface GoogleBusinessBaseRequest {
  agent: string;
  conversationId: string;
  customAgentId: string;
  requestId: string;
  context?: {
    entryPoint: EntryPoint;
    placeId: string;
    userInfo: {
      displayName: string;
    };
  };
  sendTime: string; // RFC3339 UTC "Zulu" format
}

export interface GoogleBusinessMessageRequest extends GoogleBusinessBaseRequest {
  message: {
    messageId: string;
    name: string;
    text: string;
    createTime: string; // RFC3339 UTC "Zulu" format
  };
}

export type SuggestionType = 'UNKNOWN' | 'ACTION' | 'REPLY';

export interface GoogleBusinessSuggestionRequest extends GoogleBusinessBaseRequest {
  suggestionResponse: {
    message: string;
    postbackData: string;
    createTime: string; // RFC3339 UTC "Zulu" format
    text: string;
    suggestionType: SuggestionType;
  };
}

export interface ResponseOptions {
  suggestions?: Suggestion[];
  fallback?: string;
}

export type RepresentativeType = 'REPRESENTATIVE_TYPE_UNSPECIFIED' | 'BOT' | 'HUMAN';

export interface BaseResponse extends ResponseOptions {
  messageId: string;
  representative: {
    displayName?: string;
    representativeType: RepresentativeType;
  };
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
    standaloneCard: StandaloneCard;
  };
}

export interface StandaloneCard {
  cardContent: Card;
}

export interface CarouselCardResponse extends BaseResponse {
  richCard: {
    carouselCard: CarouselCard;
  };
}

export type CardWidth = 'CARD_WIDTH_UNSPECIFIED' | 'SMALL' | 'MEDIUM';
export type CardHeight = 'HEIGHT_UNSPECIFIED' | 'SHORT' | 'MEDIUM' | 'TALL';

export interface CarouselCard {
  cardWidth: CardWidth;
  cardContents: Card[];
}

export interface Card {
  title?: string;
  description?: string;
  media?: {
    height: CardHeight;
    contentInfo: {
      fileUrl: string;
      thumbnailUrl?: string;
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
