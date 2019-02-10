import { Plugin, ErrorCode } from "jovo-core";
import { AlexaSkill } from "../core/AlexaSkill";
import { AlexaAPI, ApiCallOptions } from "../services/AlexaAPI";
import { Alexa } from "../Alexa";
import { AlexaRequest } from "../core/AlexaRequest";
import {JovoError} from "jovo-core";

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
        const authObject: AuthorizationResponse = await AlexaAPI.proactiveEventAuthorization(clientId, clientSecret);
        return authObject;
    }

    async sendProactiveEvent(proactiveEvent: ProactiveEventObject, accessToken: string) {
        if (!accessToken) {
            throw new JovoError(
                'Can\'t find accessToken',
                ErrorCode.ERR,
                'jovo-platform-alexa',
                'To send out Proactive Events you have to provide an accessToken',
                'Try to get an accessToken by calling "this.$alexaSkill.$proactiveEvents.getAccessToken(clientId, clientSecret)"',
                'TODO: Link to Jovo docs'
            );
        }
        const alexaRequest: AlexaRequest = this.alexaSkill.$request as AlexaRequest;
        const options: ApiCallOptions = {
            endpoint: alexaRequest.getApiEndpoint(),
            method: 'POST',
            path: '/v1/proactiveEvents/stages/development', // TODO live: /v1/proactiveEvents
            permissionToken: accessToken,
            json: proactiveEvent
        }
        const result = await AlexaAPI.apiCall(options);
        return result;
    }

    getWeatherAlertActivatedObject(payload: WeatherAlertActivatedPayload): WeatherAlertActivated {
        return new WeatherAlertActivated(payload);
    }

    getSportsEventUpdatedObject(payload: SportsEventUpdatedPayload): SportsEventUpdated {
        return new SportsEventUpdated(payload);
    }

    getMessageAlertActivatedObject(payload: MessageAlertActivatedPayload): MessageAlertActivated {
        return new MessageAlertActivated(payload);
    }

    getOrderStatusUpdatedObject(payload: OrderStatusUpdatedPayload): OrderStatusUpdated {
        return new OrderStatusUpdated(payload);
    }

    getOccasionUpdatedObject(payload: OccasionUpdatedPayload): OccasionUpdated {
        return new OccasionUpdated(payload);
    }

    getTrashCollectionAlertActivatedObject(payload: TrashCollectionAlertActivatedPayload): TrashCollectionAlertActivated {
        return new TrashCollectionAlertActivated(payload);
    }

    getMediaContentAvailableObject(payload: MediaContentAvailablePayload): MediaContentAvailable {
        return new MediaContentAvailable(payload);
    }

    getSocialGameInviteAvailableObject(payload: SocialGameInviteAvailablePayload): SocialGameInviteAvailable {
        return new SocialGameInviteAvailable(payload);
    }
}

export class ProactiveEventPlugin implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));

        AlexaSkill.prototype.$proactiveEvent = undefined;
        AlexaSkill.prototype.proactiveEvent = function () {
            return this.$proactiveEvent;
        }
    }

    uninstall(alexa: Alexa) {

    }
    type(alexaSkill: AlexaSkill) {
        alexaSkill.$proactiveEvent = new ProactiveEvent(alexaSkill);
    }
}

export interface AuthorizationResponse {
    access_token: string,
    expires_in: number,
    scope: string,
    token_type: string
}

type LocalizedAttributes = {
    locale: string
}

export interface ProactiveEventObject {
    timestamp: string, // ISO 8601
    referenceId: string,
    expiryTime: string, // ISO 8601
    event: Event,
    localizedAttributes?: LocalizedAttributes[]
    relevantAudience: {
        type: 'Unicast' | 'Multicast',
        payload?: { // only used if type = Unicast, i.e. one specific user is targeted 
            user: string // userId
        }
    }
}

abstract class Event {
    name: string;
    payload: object;

    constructor(name: string, payload: object) {
        this.name = name,
        this.payload = payload
    }
}

class WeatherAlertActivated extends Event {
    constructor(payload: WeatherAlertActivatedPayload) {
        super('AMAZON.WeatherAlert.Activated', payload);
    } 
}

export interface WeatherAlertActivatedPayload {
    weatherAlert: {
        source?: string,
        alertType: 'TORNADO' | 'HURRICANE' | 'SNOW_STORM' | 'THUNDER_STORM'
    }
}

class SportsEventUpdated extends Event {
    constructor(payload: SportsEventUpdatedPayload) {
        super('AMAZON.SportsEvent.Updated', payload);
    }
}

export interface SportsEventUpdatedPayload {
    update?: {
        ScoreEarned: number,
        teamName: string
    },
    sportsEvent: {
        eventLeague: {
            name: string,
        },
        homeTeamStatistic: {
            team: {
                name: string
            },
            score: number
        },
        awayTeamStatistic: {
            team: {
                name: string
            },
            score: number
        }
    }
}

class MessageAlertActivated extends Event {
    constructor(payload: MessageAlertActivatedPayload) {
        super('AMAZON.MessageAlert.Activated', payload);
    }
}

export interface MessageAlertActivatedPayload {
    state: {
        status: 'UNREAD' | 'FLAGGED',
        freshness?: 'NEW' | 'OVERDUE'
    },
    messageGroup: {
        creator: {
            name: string
        },
        count: number,
        urgency?: 'URGENT'
    }
}

class OrderStatusUpdated extends Event {
    constructor(payload: OrderStatusUpdatedPayload) {
        super('AMAZON.OrderStatus.Updated', payload);
    }
}

export interface OrderStatusUpdatedPayload {
    state: {
        status: 'PREORDER_RECEIVED' | 'ORDER_RECEIVED' | 'ORDER_PREPARING' |
                'ORDER_SHIPPED' | 'ORDER_OUT_FOR_DELIVERY' | 'ORDER_OUT_FOR_DELIVERY' |
                'ORDER_DELIVERED',
        enterTimeStamp?: string, // ISO 8601
        deliveryDetails?: {
            expectedArrival: string // ISO 8601
        }
    },
    order: {
        seller: {
            name: string
        }
    }
}

class OccasionUpdated extends Event {
    constructor(payload: OccasionUpdatedPayload) {
        super('AMAZON.Occasion.Updated', payload);
    }
}

export interface OccasionUpdatedPayload {
    state: {
        confirmationStatus: 'CONFIRMED' | 'CANCELED' | 'RESCHEDULED' | 'REQUESTED' | 'CREATED' | 'UPDATED'
    },
    occasion: {
        occasionType: 'RESERVATION_REQUEST' | 'RESERVATION' | 'APPOINTMENT_REQUEST' | 'APPOINTMENT',
        subject: string,
        provider: {
            name: string
        },
        bookingTime: string, // ISO 8601
        broker?: {
            name: string
        }
    }
}

class TrashCollectionAlertActivated extends Event {
    constructor(payload: TrashCollectionAlertActivatedPayload) {
        super('AMAZON.TrashCollectionAlert.Activated', payload);
    }
}

type GarbageType = 'BOTTLES' | 'BULKY' | 'BURNABLE' | 'CANS' | 'CLOTHING' | 'COMPOSTABLE' | 'CRUSHABLE' |
                'GARDEN_WASTE' | 'GLASS' | 'HAZARDOUS' | 'HOME_APPLIANCES' | 'KITCHEN_WASTE' |
                'LANDFILL' | 'PET_BOTTLES' | 'RECYCLABLE_PLASTICS' | 'WASTE_PAPER';

export interface TrashCollectionAlertActivatedPayload {
    alert: {
        garbageType: GarbageType[], // Only allows array containing strings from GarbageType
        collectionDayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' |
                            'SATURDAY' | 'SUNDAY'
    }
}

class MediaContentAvailable extends Event {
    constructor(payload: MediaContentAvailablePayload) {
        super('AMAZON.MediaContent.Available', payload);
    }
}

export interface MediaContentAvailablePayload {
    availability: {
        startTime: string, // ISO 8601
        provider?: {
            name: string
        },
        method: 'STREAM' | 'AIR' | 'RELEASE' | 'PREMIERE' | 'DROP'
    },
    content: {
        name: string,
        contentType: 'BOOK' | 'EPISODE' | 'ALBUM' | 'SINGLE' | 'MOVIE' | 'GAME'
    }
}

class SocialGameInviteAvailable extends Event {
    constructor(payload: SocialGameInviteAvailablePayload) {
        super('AMAZON.SocialGameInvite.Available', payload);
    }
}

export interface SocialGameInviteAvailablePayload {
    invite: {
        inviter: {
            name: string,
            relationshipToInvitee: 'FRIEND' | 'CONTACT',
            inviteType: 'CHALLENGE' | 'INVITE'
        }
    }
    game: {
        offer: 'MATCH' | 'REMATCH' | 'GAME',
        name: string
    }
}