import { Plugin, ErrorCode } from 'jovo-core';
import { AlexaSkill } from '..';
import { AlexaAPI, ApiCallOptions } from '..';
import { Alexa } from '../Alexa';
import { AlexaRequest } from '..';
import { JovoError } from 'jovo-core';

export class ProactiveEvent {
  alexaSkill: AlexaSkill;

  constructor(alexaSkill: AlexaSkill) {
    this.alexaSkill = alexaSkill;
  }

  async getAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const authObject: AuthorizationResponse = await this.sendAuthRequest(clientId, clientSecret);
    return authObject.access_token;
  }

  async sendAuthRequest(clientId: string, clientSecret: string): Promise<AuthorizationResponse> {
    const authObject: AuthorizationResponse = await AlexaAPI.proactiveEventAuthorization(
      clientId,
      clientSecret,
    );
    return authObject;
  }

  async sendProactiveEvent(
    proactiveEvent: ProactiveEventObject,
    accessToken: string,
    live = false,
  ) {
    if (!accessToken) {
      throw new JovoError(
        "Can't find accessToken",
        ErrorCode.ERR,
        'jovo-platform-alexa',
        'To send out Proactive Events you have to provide an accessToken',
        'Try to get an accessToken by calling "this.$alexaSkill.$proactiveEvent.getAccessToken(clientId, clientSecret)"',
      );
    }
    const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
    const options: ApiCallOptions = {
      endpoint: alexaRequest.getApiEndpoint(),
      method: 'POST',
      path: live ? '/v1/proactiveEvents' : '/v1/proactiveEvents/stages/development',
      permissionToken: accessToken,
      json: proactiveEvent,
    };
    const result = await AlexaAPI.apiCall(options);
    return result;
  }
}

export class ProactiveEventPlugin implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));

    AlexaSkill.prototype.$proactiveEvent = undefined;
    AlexaSkill.prototype.proactiveEvent = function () {
      return this.$proactiveEvent;
    };
  }

  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    alexaSkill.$proactiveEvent = new ProactiveEvent(alexaSkill);
  }
}

export interface AuthorizationResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

type LocalizedAttributes = {
  locale: string;
  [key: string]: string;
};

export interface ProactiveEventObject {
  timestamp: string; // ISO 8601
  referenceId: string;
  expiryTime: string; // ISO 8601
  event: Event;
  localizedAttributes?: LocalizedAttributes[];
  relevantAudience: {
    type: 'Unicast' | 'Multicast';
    payload?: {
      // only used if type = Unicast, i.e. one specific user is targeted
      user: string; // userId
    };
  };
}

export interface Event {
  name: string;
  payload: object;
}

export interface WeatherAlertActivatedEvent extends Event {
  name: 'AMAZON.WeatherAlert.Activated';
  payload: {
    weatherAlert: {
      source?: string;
      alertType: 'TORNADO' | 'HURRICANE' | 'SNOW_STORM' | 'THUNDER_STORM';
    };
  };
}

export interface SportsEventUpdatedEvent extends Event {
  name: 'AMAZON.SportsEvent.Updated';
  payload: {
    update?: {
      ScoreEarned: number;
      teamName: string;
    };
    sportsEvent: {
      eventLeague: {
        name: string;
      };
      homeTeamStatistic: {
        team: {
          name: string;
        };
        score: number;
      };
      awayTeamStatistic: {
        team: {
          name: string;
        };
        score: number;
      };
    };
  };
}

export interface MessageAlertActivatedEvent extends Event {
  name: 'AMAZON.MessageAlert.Activated';
  payload: {
    state: {
      status: 'UNREAD' | 'FLAGGED';
      freshness?: 'NEW' | 'OVERDUE';
    };
    messageGroup: {
      creator: {
        name: string;
      };
      count: number;
      urgency?: 'URGENT';
    };
  };
}

export interface OrderStatusUpdatedEvent extends Event {
  name: 'AMAZON.OrderStatus.Updated';
  payload: {
    state: {
      status:
        | 'PREORDER_RECEIVED'
        | 'ORDER_RECEIVED'
        | 'ORDER_PREPARING'
        | 'ORDER_SHIPPED'
        | 'ORDER_OUT_FOR_DELIVERY'
        | 'ORDER_OUT_FOR_DELIVERY'
        | 'ORDER_DELIVERED';
      enterTimeStamp?: string; // ISO 8601
      deliveryDetails?: {
        expectedArrival: string; // ISO 8601
      };
    };
    order: {
      seller: {
        name: string;
      };
    };
  };
}

export interface OccasionUpdatedEvent extends Event {
  name: 'AMAZON.Occasion.Updated';
  payload: {
    state: {
      confirmationStatus:
        | 'CONFIRMED'
        | 'CANCELED'
        | 'RESCHEDULED'
        | 'REQUESTED'
        | 'CREATED'
        | 'UPDATED';
    };
    occasion: {
      occasionType: 'RESERVATION_REQUEST' | 'RESERVATION' | 'APPOINTMENT_REQUEST' | 'APPOINTMENT';
      subject: string;
      provider: {
        name: string;
      };
      bookingTime: string; // ISO 8601
      broker?: {
        name: string;
      };
    };
  };
}

type GarbageType =
  | 'BOTTLES'
  | 'BULKY'
  | 'BURNABLE'
  | 'CANS'
  | 'CLOTHING'
  | 'COMPOSTABLE'
  | 'CRUSHABLE'
  | 'GARDEN_WASTE'
  | 'GLASS'
  | 'HAZARDOUS'
  | 'HOME_APPLIANCES'
  | 'KITCHEN_WASTE'
  | 'LANDFILL'
  | 'PET_BOTTLES'
  | 'RECYCLABLE_PLASTICS'
  | 'WASTE_PAPER';

export interface TrashCollectionAlertActivatedEvent extends Event {
  name: 'AMAZON.TrashCollectionAlert.Activated';
  payload: {
    alert: {
      garbageType: GarbageType[]; // Only allows array containing strings from GarbageType
      collectionDayOfWeek:
        | 'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';
    };
  };
}

export interface MediaContentAvailableEvent extends Event {
  name: 'AMAZON.MediaContent.Available';
  payload: {
    availability: {
      startTime: string; // ISO 8601
      provider?: {
        name: string;
      };
      method: 'STREAM' | 'AIR' | 'RELEASE' | 'PREMIERE' | 'DROP';
    };
    content: {
      name: string;
      contentType: 'BOOK' | 'EPISODE' | 'ALBUM' | 'SINGLE' | 'MOVIE' | 'GAME';
    };
  };
}

export interface SocialGameInviteAvailableEvent extends Event {
  name: 'AMAZON.SocialGameInvite.Available';
  payload: {
    invite: {
      inviter: {
        name: string;
        relationshipToInvitee: 'FRIEND' | 'CONTACT';
        inviteType: 'CHALLENGE' | 'INVITE';
      };
    };
    game: {
      offer: 'MATCH' | 'REMATCH' | 'GAME';
      name: string;
    };
  };
}
