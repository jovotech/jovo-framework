import { TestSuite } from 'jovo-core';
import { GoogleAssistantRequestBuilder } from './GoogleAssistantRequestBuilder';
import { GoogleAssistantResponseBuilder } from './GoogleAssistantResponseBuilder';
import { BasicCard, CarouselBrowse, OrderUpdate, Table } from '..';

export interface GoogleAssistantTestSuite
  extends TestSuite<GoogleAssistantRequestBuilder, GoogleAssistantResponseBuilder> {}

export enum GoogleAssistantDeviceName {
  GOOGLE_ASSISTANT_SPEAKER = 'GOOGLE_ASSISTANT_SPEAKER',
  GOOGLE_ASSISTANT_PHONE = 'GOOGLE_ASSISTANT_PHONE',
  GOOGLE_ASSISTANT_SMARTDISPLAY = 'GOOGLE_ASSISTANT_SMARTDISPLAY',
}

export interface SimpleResponse {
  textToSpeech?: string;
  ssml?: string;
  displayText: string;
}

export interface Suggestion {
  title: string;
}

export interface OpenUrlAction {
  url: string;
  androidApp?: {
    packageName: string;
    versions: Array<{
      minVersion: string;
      maxVersion: string;
    }>;
  };
  UrlTypeHint: 'URL_TYPE_HINT_UNSPECIFIED' | 'AMP_CONTENT';
}

export interface LinkOutSuggestion {
  destinationName: string;
  url: string;
  openUrlAction: OpenUrlAction;
}
export interface PostalAddress {
  revision: number;
  regionCode: string;
  languageCode: string;
  postalCode: string;
  sortingCode: string;
  administrativeArea: string;
  locality: string;
  sublocality: string;
  addressLines: string[];
  recipients: string[];
  organization: string;
}
export interface Location {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
  zipCode: string;
  city: string;
  postalAddress: PostalAddress;
  name: string;
  phoneNumber: string;
  notes: string;
  placeId: string;
}

export interface Image {
  url: string;
  accessibilityText: string;
  width?: number;
  height?: number;
}

export interface OrderUpdateV3 {
  type?: string;
  reason?: string;
  order: Order;
}

export interface PhoneNumber {
  e164PhoneNumber: string;
  extension: string;
  preferredDomesticCarrierCode: string;
}
export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumbers?: PhoneNumber[];
}

export interface Merchant {
  id: string;
  name: string;
  image: Image;
  phoneNumbers: PhoneNumber[];
  address: Location;
}
export type State = 'STATE_UNSPECIFIED' | 'ESTIMATE' | 'ACTUAL';

export interface Money {
  currencyCode: string; //  ISO 4217
  amountInMicros: string; // 2990000 for $2.99
}

export interface PriceAttribute {
  // TODO: What's the type here? https://developers.google.com/assistant/conversational/reference/rest/Shared.Types/PriceAttribute
  type: any; // tslint:disable-line
  name: string;
  state: State;
  taxIncluded: boolean;
  amount?: Money;
}

export type Type =
  | 'TYPE_UNSPECIFIED'
  | 'VIEW_DETAILS'
  | 'MODIFY'
  | 'CANCEL'
  | 'RETURN'
  | 'EXCHANGE'
  | 'REORDER'
  | 'REVIEW'
  | 'CUSTOMER_SERVICE'
  | 'FIX_ISSUE'
  | 'DIRECTION';
export interface ActionMetadata {
  expireTime: string;
}
export interface Action {
  type: Type;
  title: string;
  openUrlAction: OpenUrlAction;
  actionMetadata: ActionMetadata;
}
export interface TextLink {
  displayText: string;
  url: string;
}
export interface DisclosurePresentationOptions {
  presentationRequirement:
    | 'REQUIREMENT_UNSPECIFIED'
    | 'REQUIREMENT_OPTIONAL'
    | 'REQUIREMENT_REQUIRED';
  initiallyExpanded: boolean;
}
export interface Disclosure {
  title: string;
  disclosureText: {
    template: string;
    textLinks: TextLink[];
  };
  presentationOptions: DisclosurePresentationOptions;
}

export type PurchaseStatus =
  | 'PURCHASE_STATUS_UNSPECIFIED'
  | 'READY_FOR_PICKUP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'OUT_OF_STOCK'
  | 'IN_PREPARATION'
  | 'CREATED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'CHANGE_REQUESTED';
export type PurchaseType =
  | 'PURCHASE_TYPE_UNSPECIFIED'
  | 'RETAIL'
  | 'FOOD'
  | 'GROCERY'
  | 'MOBILE_RECHARGE';
export type Unit = 'UNIT_UNSPECIFIED' | 'MILLIGRAM' | 'GRAM' | 'KILOGRAM' | 'OUNCE' | 'POUND';

export interface MerchantUnitMeasure {
  measure: number;
  unit: Unit;
}

export interface PurchaseReturnsInfo {
  isReturnable: boolean;
  daysToReturn: number;
  policyUrl: string;
}

export interface Time {
  timeIso8601: string;
}
export type PickupType = 'UNSPECIFIED' | 'INSTORE' | 'CURBSIDE';

export type CurbsideFulfillmentType = 'UNSPECIFIED' | 'VEHICLE_DETAIL';

export interface Vehicle {
  make: string;
  model: string;
  licensePlate: string;
  colorName: string;
  image: Image;
}

export interface CurbsideInfo {
  curbsideFulfillmentType: CurbsideFulfillmentType;
  userVehicle: Vehicle;
}
export type CheckInType = 'CHECK_IN_TYPE_UNSPECIFIED' | 'EMAIL' | 'SMS';
export interface CheckInInfo {
  checkInType: CheckInType;
}

export interface PickupInfo {
  pickupType: PickupType;
  curbsideInfo: CurbsideInfo;
  checkInInfo: CheckInInfo;
}
export interface PurchaseFulfillmentInfo {
  id: string;
  // TODO: https://developers.google.com/assistant/conversational/reference/rest/Shared.Types/PurchaseFulfillmentInfo
  fulfillmentType: any; // tslint:disable-line

  expectedFulfillmentTime: Time;
  expectedPreparationTime: Time;
  location: Location;
  expireTime: string;
  price: PriceAttribute;
  fulfillmentContact: UserInfo;
  shippingMethodName: string;
  storeCode: string;
  pickupInfo: PickupInfo;
}

export interface ItemOption {
  id: string;
  name: string;
  prices: PriceAttribute[];
  note: string;
  quantity: number;
  productId: string;
  subOptions: ItemOption[];
}

export interface ProductDetails {
  productId: string;
  gtin: string;
  plu: string;
  productType: string;
  productAttributes: {
    [key: string]: string;
  };
}

export interface PurchaseItemExtension {
  status: PurchaseStatus;
  userVisibleStatusLabel: string;
  type: PurchaseType;
  quantity: number;
  unitMeasure: MerchantUnitMeasure;
  returnsInfo: PurchaseReturnsInfo;
  fulfillmentInfo: PurchaseFulfillmentInfo;
  itemOptions: ItemOption[];
  extension: {
    '@type': string;
    [key: string]: any; // tslint:disable-line
  };
  productDetails: ProductDetails;
}

export type ReservationStatus =
  | 'RESERVATION_STATUS_UNSPECIFIED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'FULFILLED'
  | 'CHANGE_REQUESTED'
  | 'REJECTED';
export type ReservationType = 'RESERVATION_TYPE_UNSPECIFIED' | 'RESTAURANT' | 'HAIRDRESSER';

export interface StaffFacilitator {
  name: string;
  image: Image;
}
export interface ReservationItemExtension {
  status: ReservationStatus;
  userVisibleStatusLabel: string;
  type: ReservationType;
  reservationTime: Time;
  userAcceptableTimeRange: Time;
  confirmationCode: string;
  partySize: number;
  staffFacilitators: StaffFacilitator[];
  location: Location;
  extension: {
    '@type': string;
    [key: string]: any; // tslint:disable-line
  };
}

export interface LineItem {
  id: string;
  name: string;
  userVisibleStateLabel: string;
  provider: Merchant;
  priceAttributes: PriceAttribute[];
  followUpActions: Action[];
  recipients: UserInfo[];
  image: Image;
  description: string;
  notes: string[];
  disclosures: Disclosure[];
  // purchase OR reservation
  purchase?: PurchaseItemExtension;
  reservation?: ReservationItemExtension;
}
export interface PaymentResult {
  googlePaymentData?: string;
  // OR
  merchantPaymentMethodId?: string;
}
export type PaymentType =
  | 'PAYMENT_TYPE_UNSPECIFIED'
  | 'PAYMENT_CARD'
  | 'BANK'
  | 'LOYALTY_PROGRAM'
  | 'CASH'
  | 'GIFT_CARD'
  | 'WALLET';
export interface PaymentMethodDisplayInfo {
  paymentType: PaymentType;
  paymentMethodDisplayName: string;
}

export type PaymentMethodProvenance =
  | 'PAYMENT_METHOD_PROVENANCE_UNSPECIFIED'
  | 'PAYMENT_METHOD_PROVENANCE_GOOGLE'
  | 'PAYMENT_METHOD_PROVENANCE_MERCHANT';
export interface PaymentInfo {
  paymentMethodDisplayInfo: PaymentMethodDisplayInfo;
  paymentMethodProvenance: PaymentMethodProvenance;
}
export interface PaymentData {
  paymentResult: PaymentResult;
  paymentInfo: PaymentInfo;
}

export interface Promotion {
  coupon: string;
}

export type PurchaseLocationType = 'UNSPECIFIED_LOCATION' | 'ONLINE_PURCHASE' | 'INSTORE_PURCHASE';
export type ErrorType =
  | 'ERROR_TYPE_UNSPECIFIED'
  | 'NOT_FOUND'
  | 'INVALID'
  | 'AVAILABILITY_CHANGED'
  | 'PRICE_CHANGED'
  | 'INCORRECT_PRICE'
  | 'REQUIREMENTS_NOT_MET'
  | 'TOO_LATE'
  | 'NO_CAPACITY'
  | 'INELIGIBLE'
  | 'OUT_OF_SERVICE_AREA'
  | 'CLOSED'
  | 'PROMO_NOT_APPLICABLE'
  | 'PROMO_NOT_RECOGNIZED'
  | 'PROMO_EXPIRED'
  | 'PROMO_USER_INELIGIBLE'
  | 'PROMO_ORDER_INELIGIBLE'
  | 'UNAVAILABLE_SLOT'
  | 'FAILED_PRECONDITION'
  | 'PAYMENT_DECLINED';
export interface PurchaseError {
  type: ErrorType;
  description: string;
  entityId: string;
  updatedPrice: PriceAttribute;
  availableQuantity: number;
}

export interface PurchaseOrderExtension {
  status: PurchaseStatus;
  userVisibleStatusLabel: string;
  type: PurchaseType;
  returnsInfo: PurchaseReturnsInfo;
  fulfillmentInfo: PurchaseFulfillmentInfo;
  extension: {
    '@type': string;
    [key: string]: any; // tslint:disable-line
  };
  purchaseLocationType: PurchaseLocationType;
  errors?: PurchaseError[];
}

export interface EventCharacter {
  // TODO: https://developers.google.com/assistant/conversational/reference/rest/Shared.Types/Order#EventCharacter
  type: any; // tslint:disable-line
  name: string;
  image: Image;
}

export interface TicketEvent {
  // TODO: https://developers.google.com/assistant/conversational/reference/rest/Shared.Types/Order#TicketEvent
  type: any; // tslint:disable-line
  name: string;
  description: string;
  url: string;
  location: Location;
  eventCharacters: EventCharacter[];
  startDate: Time;
  endDate: Time;
  doorTime: Time;
}
export interface TicketOrderExtension {
  ticketEvent: TicketEvent;
}

export interface Order {
  googleOrderId?: string;
  merchantOrderId?: string;
  userVisibleOrderId?: string;
  buyerInfo?: UserInfo;
  image?: Image;
  createTime?: string;
  lastUpdateTime?: string;
  transactionMerchant?: Merchant;
  contents?: {
    lineItems: LineItem[];
  };
  priceAttributes?: PriceAttribute[];
  followUpActions?: Action[];
  paymentData?: PaymentData;
  termsOfServiceUrl?: string;
  note?: string;
  promotions?: Promotion[];
  disclosures?: Disclosure[];

  // purchase OR ticket
  purchase?: PurchaseOrderExtension;
  ticket?: TicketOrderExtension;
}

export interface StructuredResponse {
  orderUpdate?: OrderUpdate;
  orderUpdateV3?: OrderUpdateV3;
}
export interface Reservation extends Order {}

export interface ReservationUpdate extends OrderUpdateV3 {}

export type MediaType = 'MEDIA_TYPE_UNSPECIFIED' | 'AUDIO';

export interface MediaObject {
  name: string;
  contentUrl: string;
  description?: string;
  largeImage?: Image;
  icon?: Image;
}

export interface MediaResponse {
  mediaType: MediaType;
  mediaObjects: MediaObject[];
}

export interface CollectionBrowseItem {
  title: string;
  description: string;
  footer: string;
  image: Image;
  openUrlAction: OpenUrlAction;
}

export type ImageDisplayOptions = 'DEFAULT' | 'WHITE' | 'CROPPED';
export interface CollectionBrowse {
  items: CollectionBrowseItem[];
  imageDisplayOptions: ImageDisplayOptions;
}

export interface HtmlResponse {
  updatedState: any; // tslint:disable-line
  suppressMic: boolean;
  url: string;
  enableFullScreen?: boolean;
  continueTtsDuringTouch?: boolean;
}

export interface Item {
  name?: string;
  simpleResponse?: SimpleResponse;
  basicCard?: BasicCard;
  structuredResponse?: StructuredResponse;
  mediaResponse?: MediaResponse;
  collectionBrowse?: CollectionBrowse;
  tableCard?: Table;
  htmlResponse?: HtmlResponse;
}

export interface RichResponse {
  items: Item[];
  suggestions?: Suggestion[];
  linkOutSuggestion?: LinkOutSuggestion;
}
