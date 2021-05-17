import {
  EntityMap,
  JovoRequest,
  JovoRequestType,
  JovoSession,
  RequestType,
} from '@jovotech/framework';
import { Receipt } from './interfaces';

export class GoogleBusinessRequest extends JovoRequest {
  agent?: string;
  conversationId?: string;
  customAgentId?: string;
  requestId?: string;
  context?: {
    entryPoint?: 'ENTRY_POINT_UNSPECIFIED' | 'PLACESHEET' | 'MAPS';
    placeId: string;
    userInfo: {
      displayName: string;
      userDeviceLocale?: string;
    };
    resolvedLocale?: string;
  };
  sendTime?: string; // RFC3339 UTC "Zulu" format
  // defined if text/mage request
  message?: {
    messageId: string;
    name: string;
    text: string;
    createTime: string; // RFC3339 UTC "Zulu" format
  };
  // defined suggestion request
  suggestionResponse?: {
    message: string;
    postbackData: string;
    createTime: string; // RFC3339 UTC "Zulu" format
    text: string;
    suggestionType: 'UNKNOWN' | 'ACTION' | 'REPLY';
  };
  userStatus?: {
    isTyping: boolean;
    createTime: string; // RFC3339 UTC "Zulu" format
  };
  receipts?: {
    receipts: Receipt[];
    createTime: string; // RFC3339 UTC "Zulu" format
  };

  getEntities(): EntityMap | undefined {
    return undefined;
  }

  getIntentName(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return this.context?.resolvedLocale || this.context?.userInfo?.userDeviceLocale;
  }

  getRawText(): string | undefined {
    return (
      this.message?.text || this.suggestionResponse?.postbackData || this.suggestionResponse?.text
    );
  }

  getRequestType(): JovoRequestType | undefined {
    return {
      type: RequestType.Intent,
    };
  }

  getSession(): JovoSession | undefined {
    return {
      id: this.conversationId || '',
    } as JovoSession;
  }
}
