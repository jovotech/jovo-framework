import { SpeechBuilder, TestSuite } from 'jovo-core';
import { GoogleAssistantRequestBuilder } from './GoogleAssistantRequestBuilder';
import { GoogleAssistantResponseBuilder } from './GoogleAssistantResponseBuilder';

export type SlotFillingStatus =
  | 'UNSPECIFIED'
  | 'INITIALIZED'
  | 'COLLECTING'
  | 'FINALIZING'
  | 'FINAL';
export type SlotMode = 'MODE_UNSPECIFIED' | 'OPTIONAL' | 'REQUIRED';
export type SlotStatus = 'SLOT_UNSPECIFIED' | 'EMPTY' | 'INVALID' | 'FILLED';
export type HorizontalAlignment = 'UNSPECIFIED' | 'LEADING' | 'CENTER' | 'TRAILING';
export type ImageFill = 'UNSPECIFIED' | 'GRAY' | 'WHITE' | 'CROPPED';
export type UrlHint = 'LINK_UNSPECIFIED' | 'AMP';
export type MediaType = 'MEDIA_TYPE_UNSPECIFIED' | 'AUDIO' | 'MEDIA_STATUS_ACK';
export type OptionalMediaControls =
  | 'OPTIONAL_MEDIA_CONTROLS_UNSPECIFIED'
  | 'PAUSED'
  | 'STOPPED'
  | 'NEXT'
  | 'PREVIOUS';
export type TypeOverrideMode = 'TYPE_UNSPECIFIED' | 'TYPE_REPLACE' | 'TYPE_MERGE';
export type Capability =
  | 'UNSPECIFIED'
  | 'SPEECH'
  | 'RICH_RESPONSE'
  | 'LONG_FORM_AUDIO'
  | 'INTERACTIVE_CANVAS'
  | 'WEB_LINK'
  | 'HOME_STORAGE';
export type AccountLinkingStatus = 'ACCOUNT_LINKING_STATUS_UNSPECIFIED' | 'NOT_LINKED' | 'LINKED';
export type UserVerificationStatus = 'USER_VERIFICATION_STATUS_UNSPECIFIED' | 'GUEST' | 'VERIFIED';
export type SkuType = 'SKU_TYPE_UNSPECIFIED' | 'SKU_TYPE_IN_APP' | 'SKU_TYPE_SUBSCRIPTION' | 'APP';
export type UrlTypeHint = 'URL_TYPE_HINT_UNSPECIFIED' | 'AMP_CONTENT';
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

export type PaymentMethodStatusType =
  | 'STATUS_UNSPECIFIED'
  | 'STATUS_OK'
  | 'STATUS_REQUIRE_FIX'
  | 'STATUS_INAPPLICABLE';

export type PaymentType =
  | 'PAYMENT_TYPE_UNSPECIFIED'
  | 'PAYMENT_CARD'
  | 'BANK'
  | 'LOYALTY_PROGRAM'
  | 'CASH'
  | 'GIFT_CARD'
  | 'WALLET';

export type PaymentMethodProvenance =
  | 'PAYMENT_METHOD_PROVENANCE_UNSPECIFIED'
  | 'PAYMENT_METHOD_PROVENANCE_GOOGLE'
  | 'PAYMENT_METHOD_PROVENANCE_MERCHANT';

export type PresentationRequirement =
  | 'REQUIREMENT_UNSPECIFIED'
  | 'REQUIREMENT_OPTIONAL'
  | 'REQUIREMENT_REQUIRED';

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

export type CompletePurchaseType =
  | 'PURCHASE_STATUS_OK'
  | 'PURCHASE_STATUS_ALREADY_OWNED'
  | 'PURCHASE_STATUS_ITEM_UNAVAILABLE'
  | 'PURCHASE_STATUS_ITEM_CHANGE_REQUESTED'
  | 'PURCHASE_STATUS_USER_CANCELLED'
  | 'PURCHASE_STATUS_ERROR'
  | 'PURCHASE_STATUS_UNSPECIFIED';

export type FulfillmentType = 'TYPE_UNSPECIFIED' | 'DELIVERY' | 'PICKUP';
export type PickupType = 'UNSPECIFIED' | 'INSTORE' | 'CURBSIDE';
export type CurbsideFulfillmentType = 'UNSPECIFIED' | 'VEHICLE_DETAIL';
export type CheckInType = 'CHECK_IN_TYPE_UNSPECIFIED' | 'EMAIL' | 'SMS';

export type ReservationStatus =
  | 'RESERVATION_STATUS_UNSPECIFIED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'FULFILLED'
  | 'CHANGE_REQUESTED'
  | 'REJECTED';
export type ReservationType = 'RESERVATION_TYPE_UNSPECIFIED' | 'RESTAURANT' | 'HAIRDRESSER';

export type State = 'STATE_UNSPECIFIED' | 'ESTIMATE' | 'ACTUAL';
export type MoneyType =
  | 'TYPE_UNSPECIFIED'
  | 'REGULAR'
  | 'DISCOUNT'
  | 'TAX'
  | 'DELIVERY'
  | 'SUBTOTAL'
  | 'FEE'
  | 'GRATUITY'
  | 'TOTAL';

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
  | 'NO_COURIER_AVAILABLE'
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
  | 'PAYMENT_DECLINED'
  | 'MERCHANT_UNREACHABLE'
  | 'ACCOUNT_LINKING_FAILED';

export type TransactionDecisionType =
  | 'ORDER_ACCEPTED'
  | 'ORDER_REJECTED'
  | 'CART_CHANGE_REQUESTED'
  | 'USER_CANNOT_TRANSACT';

export type TransactionDeliveryAddressUserDecisionType = 'ACCEPTED' | 'REJECTED' | string;

export type EventType = 'EVENT_TYPE_UNKNOWN' | 'MOVIE' | 'CONCERT' | 'SPORTS';
export type PermissionStatus = 'PERMISSION_DENIED' | 'PERMISSION_GRANTED' | 'ALREADY_GRANTED';

export type CharacterType = 'TYPE_UNKNOWN' | 'ACTOR' | 'PERFORMER' | 'DIRECTOR' | 'ORGANIZER';

export interface GoogleAssistantTestSuite
  extends TestSuite<GoogleAssistantRequestBuilder, GoogleAssistantResponseBuilder> {}

export interface MerchantUnitMeasure {
  measure: number;
  unit: Unit;
}

export interface Params {
  // tslint:disable-next-line:no-any
  [key: string]: any;
}

export interface Handler {
  name?: string;
}
export interface Intent {
  name: string;
  params: Record<string, IntentParameterValue>;
  query?: string;
}

export interface IntentParameterValue {
  original: string;
  resolved:
    | string
    | PermissionResult
    | TransactionRequirementsCheckResult
    | TransactionDecisionResult
    | TransactionDeliveryAddressResult
    | TransactionDigitalPurchaseCheckResult
    | TransactionDigitalPurchaseCompleteResult;
}

export interface PermissionResult {
  'permissionStatus': PermissionStatus;
  '@type': string;
  'grantedPermissions': string[];
  'additionalUserData': {
    updateUserId: string;
  };
}

export interface TransactionRequirementsCheckResult {
  '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckResult';
  'resultType': RequirementsCheckResultType;
}

export interface TransactionDecisionResult {
  '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValue';
  'transactionDecision': TransactionDecisionType;
  'order': Order;
}

export interface TransactionDeliveryAddressResult {
  '@type': 'type.googleapis.com/google.actions.v2.DeliveryAddressValue';
  'userDecision': TransactionDeliveryAddressUserDecisionType;
  'location': Location;
}

export interface TransactionDigitalPurchaseCheckResult {
  '@type': 'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckResult';
  'resultType': DigitalPurchaseCheckResultType;
}

export interface TransactionDigitalPurchaseCompleteResult {
  purchaseStatus: CompletePurchaseType;
}

export interface SkuId {
  skuType: SkuType;
  id: string;
  packageName: string;
}

export interface Sku {
  title: string;
  description: string;
  skuId: SkuId;
  formattedPrice: string;
  price: Money;
}

export enum GoogleAssistantDeviceName {
  GOOGLE_ASSISTANT_SPEAKER = 'GOOGLE_ASSISTANT_SPEAKER',
  GOOGLE_ASSISTANT_PHONE = 'GOOGLE_ASSISTANT_PHONE',
  GOOGLE_ASSISTANT_SMARTDISPLAY = 'GOOGLE_ASSISTANT_SMARTDISPLAY',
}
export interface Simple {
  speech?: string;
  text?: string;
}

export interface Image {
  url: string;
  alt: string;
  height?: number;
  width?: number;
}
export interface OpenUrl {
  url: string;
  hint: UrlHint;
}

export interface Link {
  name: string;
  open: OpenUrl;
}
export interface Card {
  title: string;
  subtitle?: string;
  text: string; // required, unless image is present
  image?: Image;
  imageFill?: ImageFill;
  button?: Link;
}

export interface TableColumn {
  header: string;
  align?: HorizontalAlignment;
}

export interface TableCell {
  text: string;
}

export interface TableRow {
  cells: TableCell[];
  divider?: boolean;
}

export interface Table {
  title: string;
  subtitle?: string;
  image?: Image;
  columns: TableColumn[];
  rows: TableRow[];
  button?: Link;
}

export interface MediaImage {
  large?: Image;
  icon?: Image;
}
export interface MediaObject {
  name: string;
  description: string;
  url: string;
  image?: MediaImage;
}

export interface Media {
  mediaType: MediaType;
  mediaObjects: MediaObject[];
  startOffset?: string; // Example: "3.5s".
  optionalMediaControls?: OptionalMediaControls[];
}

export interface ExpectedPhrase {
  phrase: string;
  alternativePhrases: string[];
}

export interface ContinuousMatchConfig {
  expectedPhrases: ExpectedPhrase[];
  durationSeconds: number;
}

export interface Canvas {
  url: string;
  // tslint:disable-next-line:no-any
  data: any;
  suppressMic?: boolean;
}

export interface CollectionItem {
  key: string;
}
export interface Collection {
  title?: string;
  subtitle?: string;
  items?: CollectionItem[]; // min 2, max 10
  imageFill?: ImageFill;
}

export interface CollectionBrowseItem {
  title: string;
  description?: string;
  footer?: string;
  image?: Image;
  openUriAction: OpenUrl;
}

export interface CollectionBrowse {
  items?: CollectionBrowseItem[]; // min 2, max 10
  imageFill?: ImageFill;
}

export interface Content {
  // can only be one of the following
  card?: Card;
  image?: Image;
  table?: Table;
  media?: Media;
  canvas?: Canvas;
  collection?: Collection;
  list?: List;
}
export interface ListItem {
  key: string;
}
export interface List {
  title?: string;
  subtitle?: string;
  items?: ListItem[]; // min 2, max 30
}
export interface Suggestion {
  title: string;
}

export interface Prompt {
  append?: boolean; // deprecated
  override?: boolean;
  firstSimple?: Simple;
  content?: Content;
  lastSimple?: Simple;
  suggestions?: Suggestion[];
  link?: Link;
  canvas?: Canvas;
  orderUpdate?: OrderUpdate;
}

export interface Slot {
  mode: SlotMode;
  status: SlotStatus;
  // tslint:disable-next-line:no-any
  value: any;
  updated: boolean;
  prompt?: Prompt;
}

export interface NextScene {
  name: string;
}

export interface Scene {
  name: string;
  slotFillingStatus: SlotFillingStatus;
  slots: Record<string, Slot>;
  next: NextScene;
}

export interface EntryDisplay {
  title: string;
  description?: string;
  image?: Image;
  footer?: string;
  openUrl?: OpenUrl;
}

export interface Entry {
  name: string;
  synonyms: string[];
  display?: EntryDisplay;
}

export interface SynonymType {
  entries: Entry[];
}

export interface TypeOverride {
  name: string;
  mode: TypeOverrideMode;
  synonym: SynonymType;
}

export interface Session {
  id: string;
  params: Params;
  typeOverrides?: TypeOverride[];
  languageCode?: string;
}

export interface Home {
  params: Params;
}

export interface Device {
  capabilities: Capability[];
  currentLocation?: CurrentLocation;
  timeZone?: TimeZone
}

export interface CurrentLocation {
  coordinates?: LatLng,
  postalAddress?: PostalAddress
}

export interface TimeZone {
  /**
   * IANA Time Zone Database time zone, e.g. "America/New_York".
   */
  id?: string
  /**
   * Optional. IANA Time Zone Database version number, e.g. "2019a".
   */
  version?: string
}

export interface Expected {
  speech: string[];
  languageCode: string;
}

export interface MediaContext {
  progress: string; // Example: "3.5s
}
export interface User {
  locale: string;
  params: Params;
  accountLinkingStatus: AccountLinkingStatus;
  verificationStatus: UserVerificationStatus;
  lastSeenTime: string;
  engagement?: Engagement;
  packageEntitlements?: PackageEntitlement[];
}

export interface Engagement {
  pushNotificationIntents?: IntentSubscription[];
  dailyUpdateIntents?: IntentSubscription[];
}
export interface IntentSubscription {
  intent: string;
  contentTitle: string;
}

export interface PackageEntitlement {
  packageName: string;
  entitlements: Entitlement[];
}

export interface Entitlement {
  sku: string;
  skuType: SkuType;
  inAppDetails: SignedData;
}

export interface SignedData {
  // tslint:disable-next-line:no-any
  inAppPurchaseData: any;
  inAppDataSignature: string;
}
export interface Context {
  media: MediaContext;
}

export interface UpdateMask {
  paths: string[];
}

export interface OrderUpdate {
  type?: string;
  reason?: string;
  order: Order;
  updateMask: UpdateMask | string;
  userNotification?: UserNotification;
}
export interface UserNotification {
  title: string;
  text: string;
}
export interface Order {
  googleOrderId?: string;
  merchantOrderId?: string;
  userVisibleOrderId?: string;
  userVisibleStateLabel?: string;

  buyerInfo?: UserInfo;
  image?: Image;
  createTime?: string;
  lastUpdateTime?: string;
  transactionMerchant?: Merchant;
  contents?: Contents;
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
export interface TicketOrderExtension {
  ticketEvent: TicketEvent;
}
export interface TicketEvent {
  type: EventType;
  name: string;
  description: string;
  url: string;
  location: Location;
  eventCharacters: EventCharacter[];
  startDate: Time;
  endDate: Time;
  doorTime: Time;
}

export interface EventCharacter {
  type: CharacterType;
  name: string;
  image: Image;
}

export interface PurchaseOrderExtension {
  status?: PurchaseStatus;
  userVisibleStatusLabel?: string;
  type?: PurchaseType;
  returnsInfo?: PurchaseReturnsInfo;
  fulfillmentInfo?: PurchaseFulfillmentInfo;
  purchaseLocationType?: PurchaseLocationType;
  errors?: PurchaseError[];
}
export interface PurchaseError {
  type: ErrorType;
  description: string;
  entityId: string;
  updatedPrice: PriceAttribute;
  availableQuantity: number;
}
export interface Promotion {
  coupon: string;
}

export interface Contents {
  lineItems: LineItem[];
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
  image?: Image;
  phoneNumbers?: PhoneNumber[];
  address?: Location;
}

export interface LatLng {
  latitude?: number;
  longitude?: number;
}
export interface Location {
  coordinates?: LatLng;
  formattedAddress?: string;
  zipCode?: string;
  city?: string;
  postalAddress?: PostalAddress;
  name?: string;
  phoneNumber?: string;
  notes?: string;
  placeId?: string;
}

export interface PostalAddress {
  revision?: number;
  regionCode?: string;
  languageCode?: string;
  postalCode?: string;
  sortingCode?: string;
  administrativeArea?: string;
  locality?: string;
  sublocality?: string;
  addressLines?: string[];
  recipients?: string[];
  organization?: string;
}

export interface LineItem {
  id?: string;
  name?: string;
  description?: string;
  provider?: Merchant;
  priceAttributes?: PriceAttribute[];
  followUpActions?: Action[];
  recipients?: UserInfo[];
  image?: Image;
  notes?: string[];
  disclosures?: Disclosure[];
  // purchase OR reservation
  purchase?: PurchaseItemExtension;
  reservation?: ReservationItemExtension;
}

export interface PriceAttribute {
  type: MoneyType;
  name: string;
  id: string;
  state: State;
  taxIncluded: boolean;
  amount?: Money;
  amountMillipercentage?: number;
}
export interface Money {
  currencyCode: string; //  ISO 4217
  amountInMicros: string; // 2990000 for $2.99
}

export interface Action {
  type?: Type;
  title?: string;
  openUrlAction?: OpenUrlAction;
  actionMetadata?: ActionMetadata;
}
export interface VersionFilter {
  minVersion: number;
  maxVersion: number;
}
export interface AndroidApp {
  packageName: string;
  versions: VersionFilter[];
}

export interface OpenUrlAction {
  url?: string;
  androidApp?: AndroidApp;
  urlTypeHint?: UrlTypeHint;
}

export interface ActionMetadata {
  expireTime: string;
}

export interface PaymentData {
  paymentResult?: PaymentResult;
  paymentInfo?: PaymentInfo;
}

export interface PaymentResult {
  googlePaymentData?: string;
  // OR
  merchantPaymentMethodId?: string;
}

export interface PaymentInfo {
  paymentMethodDisplayInfo?: PaymentMethodDisplayInfo;
  paymentMethodProvenance?: PaymentMethodProvenance;
}

export interface Disclosure {
  title: string;
  disclosureText: DisclosureText;
  presentationOptions: DisclosurePresentationOptions;
}

export interface DisclosureText {
  template: string;
  textLinks: TextLink[];
}

export interface TextLink {
  displayText: string;
  url: string;
}

export interface DisclosurePresentationOptions {
  presentationRequirement: PresentationRequirement;
  initiallyExpanded: boolean;
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

export interface PurchaseReturnsInfo {
  isReturnable: boolean;
  daysToReturn: number;
  policyUrl: string;
}

export interface PurchaseFulfillmentInfo {
  id: string;
  fulfillmentType: FulfillmentType;

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

export interface Time {
  timeIso8601: string;
}

export interface PickupInfo {
  pickupType: PickupType;
  curbsideInfo: CurbsideInfo;
  checkInInfo: CheckInInfo;
}

export interface CurbsideInfo {
  curbsideFulfillmentType: CurbsideFulfillmentType;
  userVehicle: Vehicle;
}

export interface Vehicle {
  make: string;
  model: string;
  licensePlate: string;
  colorName: string;
  image: Image;
}

export interface CheckInInfo {
  checkInType: CheckInType;
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

export interface ReservationItemExtension {
  status?: ReservationStatus;
  userVisibleStatusLabel?: string;
  type?: ReservationType;
  reservationTime?: Time;
  userAcceptableTimeRange?: Time;
  confirmationCode?: string;
  partySize?: number;
  staffFacilitators?: StaffFacilitator[];
  location?: Location;
}

export interface StaffFacilitator {
  name: string;
  image?: Image;
}

export interface PresentationOptions {
  actionDisplayName: string;
}

export interface OrderOptions {
  requestDeliveryAddress?: boolean;
  userInfoOptions?: {
    userInfoProperties: string[];
  };
}

export interface PaymentParameters {
  merchantPaymentOption?: MerchantPaymentOption;
  googlePaymentOption?: GooglePaymentOption;
}

export interface GooglePaymentOption {
  facilitationSpec: string;
}

export interface MerchantPaymentOption {
  defaultMerchantPaymentMethodId?: string;
  managePaymentMethodUrl?: string;
  merchantPaymentMethod?: MerchantPaymentMethod[];
}

export interface MerchantPaymentMethod {
  paymentMethodGroup?: string;
  paymentMethodId?: string;
  paymentMethodDisplayInfo?: PaymentMethodDisplayInfo;
  paymentMethodStatus?: PaymentMethodStatus;
}
export interface PaymentMethodStatus {
  status: PaymentMethodStatusType;
  statusMessage: string;
}

export interface PaymentMethodDisplayInfo {
  paymentType?: PaymentType;
  paymentMethodVoiceName?: string;
  paymentMethodDisplayName?: string;
}

export type RequirementsCheckResultType =
  | 'USER_ACTION_REQUIRED'
  | 'OK'
  | 'CAN_TRANSACT'
  | 'ASSISTANT_SURFACE_NOT_SUPPORTED'
  | 'REGION_NOT_SUPPORTED';

export type DigitalPurchaseCheckResultType = 'CAN_PURCHASE' | 'CANNOT_PURCHASE' | string;

export interface Reservation extends Order {}
export enum EnumGoogleAssistantRequestType {
  ON_PERMISSION = 'ON_PERMISSION',
  ON_SIGN_IN = 'ON_SIGN_IN',
  ON_CONFIRMATION = 'ON_CONFIRMATION',
  ON_DATETIME = 'ON_DATETIME',
  ON_PLACE = 'ON_PLACE',
  ON_HEALTH_CHECK = 'ON_HEALTH_CHECK',
  ON_NEW_SURFACE = 'ON_NEW_SURFACE',

  ON_NOINPUT1 = 'ON_NOINPUT1',
  ON_NOINPUT2 = 'ON_NOINPUT2',
  ON_NOINPUTFINAL = 'ON_NOINPUTFINAL',
  ON_NOMATCH1 = 'ON_NOMATCH1',
  ON_NOMATCH2 = 'ON_NOMATCH2',
  ON_NOMATCHFINAL = 'ON_NOMATCHFINAL',

  ON_SCENE = 'ON_SCENE',
}
export type Reprompt = string | SpeechBuilder;

export interface ConversationalSession {
  new?: boolean;
  createdAt?: string;
  // tslint:disable-next-line:no-any
  reprompts?: any;
}

export interface HtmlResponse {
  url?: string;
  // tslint:disable-next-line:no-any
  data?: Record<string, any>;
  suppressMic?: boolean;
  enableFullScreen?: boolean;
  continueTtsDuringTouch?: boolean;
}
