import { Plugin } from 'jovo-core';
import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { Order, PaymentType, Reservation } from '../core/Interfaces';
export interface PaymentParameters {
    merchantPaymentOption: MerchantPaymentOption;
}
export interface MerchantPaymentOption {
    defaultMerchantPaymentMethodId: string;
    managePaymentMethodUrl: string;
    merchantPaymentMethod: MerchantPaymentMethod[];
}
export interface MerchantPaymentMethod {
    paymentMethodDisplayInfo: PaymentMethodDisplayInfo;
}
export interface PaymentMethodDisplayInfo {
    paymentMethodDisplayName: string;
    paymentType: PaymentType;
    paymentMethodGroup: string;
    paymentMethodId: string;
    paymentMethodStatus: PaymentMethodStatus;
}
export interface PaymentMethodStatus {
    status: 'STATUS_OK';
    statusMessage: string;
}
export interface PaymentOptions {
    googleProvidedOptions: GoogleProvidedOptions;
}
export declare type SupportedCardNetworks = 'AMEX' | 'DISCOVER' | 'MASTERCARD' | 'VISA' | 'JCB';
export interface GoogleProvidedOptions {
    prepaidCardDisallowed: boolean;
    supportedCardNetworks: SupportedCardNetworks[];
    tokenizationParameters: {
        parameters: {
            [key: string]: string;
        };
        tokenizationType: string;
    };
}
export interface OrderOptions {
    requestDeliveryAddress?: boolean;
    userInfoOptions?: {
        userInfoProperties: string[];
    };
}
export interface PresentationOptions {
    actionDisplayName: string;
}
export interface Requirements {
    orderOptions: OrderOptions;
    googleProvidedOptions: GoogleProvidedOptions;
}
export declare type RequirementsCheckResult = 'USER_ACTION_REQUIRED' | 'OK' | 'CAN_TRANSACT' | 'ASSISTANT_SURFACE_NOT_SUPPORTED' | 'REGION_NOT_SUPPORTED';
export declare type DigitalPurchaseRequirementsCheckResult = 'CAN_PURCHASE';
export declare type DeliveryAddressDecision = 'ACCEPTED' | 'REJECTED';
export declare type TransactionDecision = 'ORDER_ACCEPTED' | 'REJECTED' | 'ORDER_REJECTED' | 'DELIVERY_ADDRESS_UPDATED' | 'CART_CHANGE_REQUESTED';
export declare type SkuType = 'SKU_TYPE_IN_APP' | 'SKU_TYPE_SUBSCRIPTION';
export declare type PurchaseStatus = 'PURCHASE_STATUS_OK' | 'PURCHASE_STATUS_ITEM_CHANGE_REQUESTED' | 'PURCHASE_STATUS_USER_CANCELLED' | 'PURCHASE_STATUS_ERROR' | 'PURCHASE_STATUS_UNSPECIFIED';
export interface DeliveryAddressLocation {
    zipCode?: string;
    city?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    postalAddress: {
        regionCode?: string;
        recipients?: string[];
        postalCode?: string;
        locality?: string;
        addressLines?: string[];
        administrativeArea?: string;
    };
    phoneNumber: string;
}
export interface OrderManagementAction {
    button: {
        openUrlAction: {
            url: string;
        };
        title: string;
    };
    type: string;
}
export interface UserNotification {
    text: string;
    title: string;
}
export interface Sku {
    title: string;
    description: string;
    skuId: SkuId;
    formattedPrice: string;
    price: Price;
}
export interface Price {
    currencyCode: string;
    amountInMicros: string;
}
export interface SkuId {
    skuType: SkuType;
    id: string;
    packageName: string;
}
export interface OrderUpdate {
    actionOrderId: string;
    orderState: {
        label: string;
        state?: 'CREATED' | 'CONFIRMED' | 'IN_TRANSIT' | 'FULFILLED' | 'RETURNED';
    };
    receipt: {
        userVisibleOrderId: string;
    };
    updateTime?: string;
    orderManagementActions?: OrderManagementAction[];
    userNotification?: UserNotification;
}
export declare class Transaction {
    googleAction: GoogleAction;
    googleAssistant: GoogleAssistant;
    constructor(googleAction: GoogleAction, googleAssistant: GoogleAssistant);
    checkRequirements(): this;
    checkDigitalPurchaseRequirements(): this;
    buildOrder(order: Order, presentationOptions?: PresentationOptions, orderOptions?: OrderOptions, paymentParameters?: PaymentParameters): void;
    updateOrder(order: Order, reason: string, type?: string): void;
    buildReservation(reservation: Reservation, presentationOptions?: PresentationOptions, orderOptions?: OrderOptions): void;
    updateReservation(reservation: Reservation, reason: string, type?: string): void;
    getRequirementsCheckResult(): RequirementsCheckResult | undefined;
    getDigitalPurchaseRequirementsCheckResult(): DigitalPurchaseRequirementsCheckResult | undefined;
    canTransact(): boolean;
    canPurchase(): boolean;
    isRequirementsCheckUserActionRequired(): boolean;
    isRequirementsCheckAssistantSurfaceNotSupported(): boolean;
    isRequirementsCheckRegionNotSupported(): boolean;
    askForDeliveryAddress(reason?: string): this;
    getDeliveryAddressDecision(): DeliveryAddressDecision | undefined;
    isDeliveryAddressAccepted(): boolean;
    isDeliveryAddressRejected(): boolean;
    getDeliveryAddress(): any;
    getOrder(): Order | undefined;
    getReservation(): Reservation | undefined;
    getDeliveryAddressLocation(): DeliveryAddressLocation | undefined;
    transactionDecision(orderOptions: OrderOptions, paymentOptions: PaymentOptions, proposedOrder: any): this;
    createOrder(speech: string, orderUpdate: OrderUpdate): void;
    getTransactionDecisionResult(): TransactionDecision | undefined;
    isOrderAccepted(): boolean;
    isReservationAccepted(): boolean;
    isOrderRejected(): boolean;
    isReservationRejected(): boolean;
    isDeliveryAddressUpdated(): boolean;
    isCartChangeRequested(): boolean;
    getSubscriptions(skus: string[]): Promise<Sku[]>;
    getConsumables(skus: string[]): Promise<Sku[]>;
    completePurchase(skuId: SkuId): void;
    getPurchaseStatus(): PurchaseStatus | undefined;
    getSkus(skus: string[], type: SkuType): Promise<any>;
    getGoogleApiAccessToken(): Promise<unknown>;
    authorizePromise(jwtClient: any): Promise<unknown>;
}
export declare class TransactionsPlugin implements Plugin {
    googleAssistant?: GoogleAssistant;
    install(googleAssistant: GoogleAssistant): void;
    type(googleAction: GoogleAction): void;
    output(googleAction: GoogleAction): void;
    uninstall(googleAssistant: GoogleAssistant): void;
}
