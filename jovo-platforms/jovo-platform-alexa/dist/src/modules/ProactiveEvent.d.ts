import { Plugin } from 'jovo-core';
import { AlexaSkill } from '..';
import { Alexa } from '../Alexa';
export declare class ProactiveEvent {
    alexaSkill: AlexaSkill;
    constructor(alexaSkill: AlexaSkill);
    getAccessToken(clientId: string, clientSecret: string): Promise<string>;
    sendAuthRequest(clientId: string, clientSecret: string): Promise<AuthorizationResponse>;
    sendProactiveEvent(proactiveEvent: ProactiveEventObject, accessToken: string, live?: boolean): Promise<import("axios").AxiosResponse<any>>;
}
export declare class ProactiveEventPlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
}
export interface AuthorizationResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}
declare type LocalizedAttributes = {
    locale: string;
    [key: string]: string;
};
export interface ProactiveEventObject {
    timestamp: string;
    referenceId: string;
    expiryTime: string;
    event: Event;
    localizedAttributes?: LocalizedAttributes[];
    relevantAudience: {
        type: 'Unicast' | 'Multicast';
        payload?: {
            user: string;
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
            status: 'PREORDER_RECEIVED' | 'ORDER_RECEIVED' | 'ORDER_PREPARING' | 'ORDER_SHIPPED' | 'ORDER_OUT_FOR_DELIVERY' | 'ORDER_OUT_FOR_DELIVERY' | 'ORDER_DELIVERED';
            enterTimeStamp?: string;
            deliveryDetails?: {
                expectedArrival: string;
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
            confirmationStatus: 'CONFIRMED' | 'CANCELED' | 'RESCHEDULED' | 'REQUESTED' | 'CREATED' | 'UPDATED';
        };
        occasion: {
            occasionType: 'RESERVATION_REQUEST' | 'RESERVATION' | 'APPOINTMENT_REQUEST' | 'APPOINTMENT';
            subject: string;
            provider: {
                name: string;
            };
            bookingTime: string;
            broker?: {
                name: string;
            };
        };
    };
}
declare type GarbageType = 'BOTTLES' | 'BULKY' | 'BURNABLE' | 'CANS' | 'CLOTHING' | 'COMPOSTABLE' | 'CRUSHABLE' | 'GARDEN_WASTE' | 'GLASS' | 'HAZARDOUS' | 'HOME_APPLIANCES' | 'KITCHEN_WASTE' | 'LANDFILL' | 'PET_BOTTLES' | 'RECYCLABLE_PLASTICS' | 'WASTE_PAPER';
export interface TrashCollectionAlertActivatedEvent extends Event {
    name: 'AMAZON.TrashCollectionAlert.Activated';
    payload: {
        alert: {
            garbageType: GarbageType[];
            collectionDayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
        };
    };
}
export interface MediaContentAvailableEvent extends Event {
    name: 'AMAZON.MediaContent.Available';
    payload: {
        availability: {
            startTime: string;
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
export {};
