import {Plugin} from "jovo-core";
import { AlexaSkill } from "../core/AlexaSkill";
import {Alexa} from "../Alexa";

export class ProactiveEvent {
    alexaSkill: AlexaSkill;

    constructor(alexaSkill: AlexaSkill) {
        this.alexaSkill = alexaSkill;
    }

    // interface
}

export class ProactiveEventPlugin implements Plugin {

    install(alexa: Alexa) {
        AlexaSkill.prototype.$proactiveEvent = undefined;
        AlexaSkill.prototype.proactiveEvent = function () {
            return new ProactiveEvent(this);
        }
    }

    uninstall(alexa: Alexa) {

    }
}

/**
 * Two ways to send proactive Event
 * 1. User gets access token themselves and sends out proactiveEvent
 * 2. User sends out proactiveEvent, provides clientId & clientSecret in method call, and the system gets the token before sending out the request
 */

export interface ProactiveEventObject {
    timestamp: string, // ISO 8601
    referenceId: string,
    expiryTime: string, // ISO 8601
    event: Event,
    localizedAttributes: [{
        locale: string,
        source: string
    }],
    relevantAudience: {
        type: 'Unicast' | 'Multicast'
        payload?: { // only used if type = Unicast, i.e. one a specific user is targeted, 
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

interface WeatherAlertActivatedPayload {
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

interface SportsEventUpdatedPayload {
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

interface MessageAlertActivatedPayload {
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

interface OrderStatusUpdatedPayload {
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

interface OccasionUpdatedPayload {
    state: {
        confirmationStatus: 'CONFIRMED' | 'CANCELED' | 'RESCHEDULED' |
                            'REQUESTED' | 'CREATED' | 'UPDATED'
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

interface TrashCollectionAlertActivatedPayload {
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

interface MediaContentAvailablePayload {
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

interface SocialGameInviteAvailablePayload {
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