import { ErrorCode, JovoError, Plugin } from 'jovo-core';

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import { GoogleActionResponse } from '..';
import { GoogleActionAPI } from '../services/GoogleActionAPI';
import { Order, PaymentType, Reservation } from '../core/Interfaces';
import _set = require('lodash.set');
import _get = require('lodash.get');

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
  status: 'STATUS_OK'; // TODO: what else ?
  statusMessage: string;
}

export interface PaymentOptions {
  googleProvidedOptions: GoogleProvidedOptions;
}

export type SupportedCardNetworks = 'AMEX' | 'DISCOVER' | 'MASTERCARD' | 'VISA' | 'JCB';

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

// TODO changed check results?
export type RequirementsCheckResult =
  | 'USER_ACTION_REQUIRED'
  | 'OK'
  | 'CAN_TRANSACT'
  | 'ASSISTANT_SURFACE_NOT_SUPPORTED'
  | 'REGION_NOT_SUPPORTED';

export type DigitalPurchaseRequirementsCheckResult = 'CAN_PURCHASE';

export type DeliveryAddressDecision = 'ACCEPTED' | 'REJECTED';
export type TransactionDecision =
  | 'ORDER_ACCEPTED'
  | 'REJECTED'
  | 'ORDER_REJECTED'
  | 'DELIVERY_ADDRESS_UPDATED'
  | 'CART_CHANGE_REQUESTED';
export type SkuType = 'SKU_TYPE_IN_APP' | 'SKU_TYPE_SUBSCRIPTION';
export type PurchaseStatus =
  | 'PURCHASE_STATUS_OK'
  | 'PURCHASE_STATUS_ITEM_CHANGE_REQUESTED'
  | 'PURCHASE_STATUS_USER_CANCELLED'
  | 'PURCHASE_STATUS_ERROR'
  | 'PURCHASE_STATUS_UNSPECIFIED';

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

export class Transaction {
  googleAction: GoogleAction;
  googleAssistant: GoogleAssistant;

  constructor(googleAction: GoogleAction, googleAssistant: GoogleAssistant) {
    this.googleAction = googleAction;
    this.googleAssistant = googleAssistant;
  }

  // REQUIREMENTS CHECK

  /**
   * Send check requirements
   * @returns {this}
   */
  checkRequirements() {
    this.googleAction.$output.GoogleAssistant = {
      TransactionRequirementsCheck: {},
    };
    return this;
  }

  /**
   * Send check requirements
   * @returns {this}
   */
  checkDigitalPurchaseRequirements() {
    this.googleAction.$output.GoogleAssistant = {
      TransactionDigitalPurchaseRequirementsCheck: {},
    };
    return this;
  }

  buildOrder(
    order: Order,
    presentationOptions: PresentationOptions = { actionDisplayName: 'PLACE_ORDER' },
    orderOptions: OrderOptions = { requestDeliveryAddress: false },
    paymentParameters?: PaymentParameters,
  ) {
    this.googleAction.$output.GoogleAssistant = {
      TransactionOrder: {
        order,
        presentationOptions,
        orderOptions,
        paymentParameters,
      },
    };
  }

  updateOrder(order: Order, reason: string, type = 'SNAPSHOT') {
    this.googleAction.$output.GoogleAssistant = {
      TransactionOrderUpdate: {
        orderUpdate: {
          order,
          reason,
          type,
        },
      },
    };
  }

  buildReservation(
    reservation: Reservation,
    presentationOptions: PresentationOptions = { actionDisplayName: 'RESERVE' },
    orderOptions: OrderOptions = { requestDeliveryAddress: false },
  ) {
    this.buildOrder(reservation, presentationOptions, orderOptions);
  }

  updateReservation(reservation: Reservation, reason: string, type = 'SNAPSHOT') {
    this.updateOrder(reservation, reason, type);
  }

  /**
   * Return requirements check result
   * @returns {RequirementsCheckResult | undefined}
   */
  getRequirementsCheckResult(): RequirementsCheckResult | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'TRANSACTION_REQUIREMENTS_CHECK_RESULT') {
        return _get(argument, 'extension.resultType');
      }
    }
  }

  /**
   * Return requirements check result
   * @returns {RequirementsCheckResult | undefined}
   */
  getDigitalPurchaseRequirementsCheckResult(): DigitalPurchaseRequirementsCheckResult | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'DIGITAL_PURCHASE_CHECK_RESULT') {
        return _get(argument, 'extension.resultType');
      }
    }
  }

  canTransact() {
    return this.getRequirementsCheckResult() === 'CAN_TRANSACT';
  }

  canPurchase() {
    return this.getDigitalPurchaseRequirementsCheckResult() === 'CAN_PURCHASE';
  }

  /**
   * Check if requirements result is USER_ACTION_REQUIRED
   * @returns {boolean}
   */
  isRequirementsCheckUserActionRequired() {
    return this.getRequirementsCheckResult() === 'USER_ACTION_REQUIRED';
  }

  /**
   * Check if requirements result is ASSISTANT_SURFACE_NOT_SUPPORTED
   * @returns {boolean}
   */
  isRequirementsCheckAssistantSurfaceNotSupported() {
    return this.getRequirementsCheckResult() === 'ASSISTANT_SURFACE_NOT_SUPPORTED';
  }

  /**
   * Check if requirements result is REGION_NOT_SUPPORTED
   * @returns {boolean}
   */
  isRequirementsCheckRegionNotSupported() {
    return this.getRequirementsCheckResult() === 'REGION_NOT_SUPPORTED';
  }

  /**
   * Ask for delivery address. `reason` is prepended to a text provided by the assistant.
   * @param {string} reason
   * @returns {this}
   */
  askForDeliveryAddress(reason = '') {
    this.googleAction.$output.GoogleAssistant = {
      AskForDeliveryAddress: {
        reason,
      },
    };
    return this;
  }

  /**
   * Returns delivery address decision by the user.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getDeliveryAddressDecision(): DeliveryAddressDecision | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'DELIVERY_ADDRESS_VALUE') {
        return _get(argument, 'extension.userDecision');
      }
    }
  }

  /**
   * Returns true if the user gave access to the delivery address.
   * @returns {boolean}
   */
  isDeliveryAddressAccepted(): boolean {
    return this.getDeliveryAddressDecision() === 'ACCEPTED';
  }

  /**
   * Returns true if the user rejected the access to the delivery address.
   * @returns {boolean}
   */
  isDeliveryAddressRejected(): boolean {
    return this.getDeliveryAddressDecision() === 'REJECTED';
  }

  /**
   * Returns delivery address decision by the user.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getDeliveryAddress() {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'TRANSACTION_REQUIREMENTS_CHECK_RESULT') {
        return _get(argument, 'extension.resultType');
      }
    }
  }
  /**
   * Returns the process order.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getOrder(): Order | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'TRANSACTION_DECISION_VALUE') {
        return _get(argument, 'extension.order');
      }
    }
  }

  /**
   * Returns the process order.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getReservation(): Reservation | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'TRANSACTION_DECISION_VALUE') {
        return _get(argument, 'extension.order');
      }
    }
  }

  /**
   * Returns delivery address object.
   * @returns {DeliveryAddressLocation | undefined}
   */
  getDeliveryAddressLocation(): DeliveryAddressLocation | undefined {
    if (!this.isDeliveryAddressAccepted()) {
      return;
    }
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'DELIVERY_ADDRESS_VALUE') {
        return _get(argument, 'extension.location');
      }
    }
  }

  /**
   * Asks for transaction confirmation for the given order and payment options.
   * @param {OrderOptions} orderOptions
   * @param {PaymentOptions} paymentOptions
   * @param proposedOrder
   * @returns {this}
   */
  transactionDecision(
    orderOptions: OrderOptions,
    paymentOptions: PaymentOptions,
    proposedOrder: any, // tslint:disable-line
  ) {
    this.googleAction.$output.GoogleAssistant = {
      TransactionDecision: {
        orderOptions,
        paymentOptions,
        proposedOrder,
      },
    };
    return this;
  }

  /**
   * Creates order update (created) response
   * @param {string} speech
   * @param {OrderUpdate} orderUpdate
   */
  createOrder(speech: string, orderUpdate: OrderUpdate) {
    this.googleAction.$output.GoogleAssistant = {
      OrderUpdate: {
        orderUpdate,
        speech,
      },
    };
  }

  /**
   * Returns transaction decision
   * @returns {TransactionDecision | undefined}
   */
  getTransactionDecisionResult(): TransactionDecision | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'TRANSACTION_DECISION_VALUE') {
        return _get(argument, 'extension.transactionDecision');
      }
    }
  }

  /**
   * Returns true if user accepted transaction
   * @returns {boolean}
   */
  isOrderAccepted(): boolean {
    return this.getTransactionDecisionResult() === 'ORDER_ACCEPTED';
  }

  /**
   * Returns true if user accepted reservation
   * @returns {boolean}
   */
  isReservationAccepted(): boolean {
    return this.getTransactionDecisionResult() === 'ORDER_ACCEPTED';
  }

  /**
   * Returns true if user rejected transaction
   * @returns {boolean}
   */
  isOrderRejected(): boolean {
    return this.getTransactionDecisionResult() === 'ORDER_REJECTED';
  }

  /**
   * Returns true if user rejected transaction
   * @returns {boolean}
   */
  isReservationRejected(): boolean {
    return this.getTransactionDecisionResult() === 'ORDER_REJECTED';
  }

  /**
   * Returns true if user updated the delivery address
   * @returns {boolean}
   */
  isDeliveryAddressUpdated(): boolean {
    return this.getTransactionDecisionResult() === 'DELIVERY_ADDRESS_UPDATED';
  }

  /**
   * Returns true if user asked for a cart change
   * @returns {boolean}
   */
  isCartChangeRequested(): boolean {
    return this.getTransactionDecisionResult() === 'CART_CHANGE_REQUESTED';
  }

  getSubscriptions(skus: string[]): Promise<Sku[]> {
    return this.getSkus(skus, 'SKU_TYPE_SUBSCRIPTION');
  }

  getConsumables(skus: string[]): Promise<Sku[]> {
    return this.getSkus(skus, 'SKU_TYPE_IN_APP');
  }

  completePurchase(skuId: SkuId) {
    this.googleAction.$output.GoogleAssistant = {
      CompletePurchase: {
        skuId,
      },
    };
  }
  getPurchaseStatus(): PurchaseStatus | undefined {
    for (const argument of _get(
      this.googleAction.$originalRequest || this.googleAction.$request,
      'inputs[0]["arguments"]',
      [],
    )) {
      if (argument.name === 'COMPLETE_PURCHASE_VALUE') {
        return argument.extension.purchaseStatus;
      }
    }
  }
  async getSkus(skus: string[], type: SkuType) {
    const conversationId = _get(
      this.googleAction.$request,
      'originalDetectIntentRequest.payload.conversation.conversationId',
    );
    if (
      !this.googleAssistant.config.transactions ||
      !this.googleAssistant.config.transactions.androidPackageName
    ) {
      throw new JovoError(
        'getSkus needs the Android App package name',
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
      );
    }

    const accessToken = await this.getGoogleApiAccessToken();

    try {
      const response = await GoogleActionAPI.apiCall({
        endpoint: 'https://actions.googleapis.com',
        path: `/v3/packages/${
          this.googleAssistant.config.transactions!.androidPackageName
        }/skus:batchGet`,
        method: 'POST',
        permissionToken: accessToken as string,
        json: {
          conversationId,
          skuType: type,
          ids: skus,
        },
      });

      if (response.data?.skus) {
        return response.data.skus;
      }
    } catch (e) {
      throw e;
    }
  }

  async getGoogleApiAccessToken() {
    if (
      !this.googleAssistant.config.transactions ||
      !this.googleAssistant.config.transactions.keyFile
    ) {
      throw new JovoError(
        'Please add a valid keyFile object to the GoogleAssistant transaction config',
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
      );
    }
    /**
     * DigitalGoods.ts needs the googleapis package to function.
     * To reduce overall package size, googleapis wasn't added as a dependency.
     * googleapis has to be manually installed
     */
    try {
      const { google } = require('googleapis');

      // tslint:disable-next-line:no-any
      const serviceAccount: any = this.googleAssistant.config.transactions!.keyFile;

      const jwtClient = new google.auth.JWT(
        serviceAccount.client_email,
        null,
        serviceAccount.private_key,
        ['https://www.googleapis.com/auth/actions.purchases.digital'],
        null,
      );

      return await this.authorizePromise(jwtClient);
    } catch (e) {
      if (e.message === "Cannot find module 'googleapis'") {
        return Promise.reject(
          new JovoError(
            e.message,
            ErrorCode.ERR,
            'jovo-platform-googleassistant',
            undefined,
            'Please run `npm install googleapis`',
          ),
        );
      }
      // return reject(new Error('Could not retrieve Google API access token'));
    }
  }
  // tslint:disable-next-line
  authorizePromise(jwtClient: any) {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line
      jwtClient.authorize((err: Error, tokens: any) => {
        if (err) {
          return reject(err);
        }
        resolve(tokens.access_token as string);
      });
    });
  }
}

export class TransactionsPlugin implements Plugin {
  googleAssistant?: GoogleAssistant;

  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));
    this.googleAssistant = googleAssistant;

    GoogleAction.prototype.$transaction = undefined;
  }

  type(googleAction: GoogleAction) {
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.TRANSACTION_REQUIREMENTS_CHECK'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'TRANSACTION_REQUIREMENTS_CHECK');
    }

    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.DIGITAL_PURCHASE_CHECK'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'DIGITAL_PURCHASE_CHECK');
    }

    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.DELIVERY_ADDRESS'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'DELIVERY_ADDRESS');
    }
    //
    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.COMPLETE_PURCHASE'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'ON_COMPLETE_PURCHASE');
    }

    if (
      _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
      'actions.intent.TRANSACTION_DECISION'
    ) {
      if (
        _get(
          googleAction.$originalRequest || googleAction.$request,
          'inputs[0].arguments[0].name',
        ) === 'TRANSACTION_DECISION_VALUE'
      ) {
        _set(googleAction.$type, 'type', 'ON_TRANSACTION');

        // possible
        _set(googleAction.$type, 'subType', 'TRANSACTION_DECISION');
      }
    }
    googleAction.$transaction = new Transaction(googleAction, this.googleAssistant!);
  }

  output(googleAction: GoogleAction) {
    if (!googleAction.$originalResponse) {
      googleAction.$originalResponse = new GoogleActionResponse();
    }
    const output = googleAction.$output;

    if (_get(output, 'GoogleAssistant.TransactionRequirementsCheck')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.TRANSACTION_REQUIREMENTS_CHECK',
        data: {
          '@type':
            'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckSpec',
        },
      });
    }

    if (_get(output, 'GoogleAssistant.TransactionDigitalPurchaseRequirementsCheck')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.DIGITAL_PURCHASE_CHECK',
        data: {
          '@type': 'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckSpec',
        },
      });
    }

    if (_get(output, 'GoogleAssistant.TransactionOrder')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.TRANSACTION_DECISION',
        data: {
          '@type':
            'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValueSpec',
          'order': _get(output, 'GoogleAssistant.TransactionOrder.order'),
          'orderOptions': _get(output, 'GoogleAssistant.TransactionOrder.orderOptions'),
          'presentationOptions': _get(
            output,
            'GoogleAssistant.TransactionOrder.presentationOptions',
          ),
          'paymentParameters': _get(output, 'GoogleAssistant.TransactionOrder.paymentParameters'),
        },
      });
    }

    if (_get(output, 'GoogleAssistant.TransactionOrderUpdate')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        structuredResponse: {
          orderUpdateV3: {
            type: _get(output, 'GoogleAssistant.TransactionOrderUpdate.orderUpdate.type'),
            reason: _get(output, 'GoogleAssistant.TransactionOrderUpdate.orderUpdate.reason'),
            order: _get(output, 'GoogleAssistant.TransactionOrderUpdate.orderUpdate.order'),
          },
        },
      });

      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }

    if (_get(output, 'GoogleAssistant.AskForDeliveryAddress')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.DELIVERY_ADDRESS',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.DeliveryAddressValueSpec',
          'addressOptions': {
            reason: _get(output, 'GoogleAssistant.AskForDeliveryAddress.reason'),
          },
        },
      });
    }

    if (_get(output, 'GoogleAssistant.TransactionDecision')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.TRANSACTION_DECISION',
        data: {
          '@type': 'type.googleapis.com/google.actions.v2.TransactionDecisionValueSpec',
          'orderOptions': {
            requestDeliveryAddress: true,
          },
          'paymentOptions': _get(output, 'GoogleAssistant.TransactionDecision.paymentOptions'),
          'proposedOrder': _get(output, 'GoogleAssistant.TransactionDecision.proposedOrder'),
          // TODO: orderOptions
        },
      });
    }

    if (_get(output, 'GoogleAssistant.OrderUpdate')) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
      richResponseItems.push({
        structuredResponse: {
          orderUpdate: _get(output, 'GoogleAssistant.OrderUpdate.orderUpdate'),
        },
      });

      richResponseItems.push({
        simpleResponse: {
          textToSpeech: _get(output, 'GoogleAssistant.OrderUpdate.speech'),
        },
      });
      _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
    }

    const completePurchase = _get(output, 'GoogleAssistant.CompletePurchase');

    if (completePurchase) {
      _set(googleAction.$originalResponse, 'expectUserResponse', true);
      _set(googleAction.$originalResponse, 'systemIntent', {
        intent: 'actions.intent.COMPLETE_PURCHASE',
        inputValueData: {
          '@type': 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
          'skuId': completePurchase.skuId,
        },
      });
      _set(googleAction.$originalResponse, 'inputPrompt', {
        initialPrompts: [
          {
            textToSpeech: 'PLACEHOLDER',
          },
        ],
        noInputPrompts: [],
      });
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
