import { ErrorCode, HttpService, JovoError, Plugin } from 'jovo-core';

import { GoogleAssistant } from '../GoogleAssistant';
import { GoogleAction } from '../core/GoogleAction';
import {
  DigitalPurchaseCheckResultType,
  Location,
  Order,
  OrderOptions,
  OrderUpdate,
  PaymentParameters,
  PaymentType,
  PresentationOptions,
  PurchaseStatus,
  RequirementsCheckResultType,
  Reservation,
  Sku,
  SkuId,
  SkuType,
  TransactionDecisionResult,
  TransactionDecisionType,
  TransactionDeliveryAddressResult,
  TransactionDeliveryAddressUserDecisionType,
  TransactionDigitalPurchaseCheckResult,
  TransactionRequirementsCheckResult,
} from '../core/Interfaces';
import _set = require('lodash.set');
import { ConversationalActionRequest } from '../core/ConversationalActionRequest';

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

  updateOrder(orderUpdate: OrderUpdate) {
    this.googleAction.$output.GoogleAssistant = {
      TransactionOrderUpdate: {
        orderUpdate,
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

  updateReservation(orderUpdate: OrderUpdate) {
    this.updateOrder(orderUpdate);
  }

  /**
   * Return requirements check result
   * @returns {RequirementsCheckResultType | undefined}
   */
  getRequirementsCheckResult(): RequirementsCheckResultType | undefined {
    const request: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;

    if (
      request.session?.params?.TransactionRequirementsCheck &&
      request.session?.params?.TransactionRequirementsCheck['@type'] ===
        'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckResult'
    ) {
      return request.session?.params?.TransactionRequirementsCheck.resultType;
    }
    return;
  }

  /**
   * Return requirements check result
   * @returns {DigitalPurchaseCheckResultType | undefined}
   */
  getDigitalPurchaseRequirementsCheckResult(): DigitalPurchaseCheckResultType | undefined {
    const request: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;

    if (
      request.session?.params?.DigitalPurchaseCheck &&
      request.session?.params?.DigitalPurchaseCheck['@type'] ===
        'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckResult'
    ) {
      return request.session?.params?.DigitalPurchaseCheck.resultType;
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
  getDeliveryAddressDecision(): TransactionDeliveryAddressUserDecisionType | undefined {
    const request: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;
    return (request.session?.params?.TransactionDeliveryAddress as TransactionDeliveryAddressResult)
      .userDecision;
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
    return this.getDeliveryAddressLocation();
  }
  /**
   * Returns the process order.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getOrder(): Order {
    const request: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;

    return request.session?.params?.order?.order;
  }

  /**
   * Returns the process order.
   * @returns {DeliveryAddressDecision | undefined}
   */
  getReservation(): Reservation {
    return this.getOrder();
  }

  /**
   * Returns delivery address object.
   * @returns {DeliveryAddressLocation | undefined}
   */
  getDeliveryAddressLocation(): Location | undefined {
    const request: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;

    return request.session?.params?.TransactionDeliveryAddress?.location;
  }

  /**
   * Asks for transaction confirmation for the given order and payment options.
   * @param {OrderOptions} orderOptions
   * @param {PaymentOptions} paymentOptions
   * @param proposedOrder
   * @returns {this}
   */
  // transactionDecision(
  //   orderOptions: OrderOptions,
  //   paymentOptions: PaymentOptions,
  //   proposedOrder: any, // tslint:disable-line
  // ) {
  //   this.googleAction.$output.GoogleAssistant = {
  //     TransactionDecision: {
  //       orderOptions,
  //       paymentOptions,
  //       proposedOrder,
  //     },
  //   };
  //   return this;
  // }

  /**
   * Creates order update (created) response
   * @param {string} speech
   * @param {OrderUpdate} orderUpdate
   */
  createOrder(orderUpdate: OrderUpdate) {
    this.googleAction.$output.GoogleAssistant = {
      TransactionOrderUpdate: {
        orderUpdate,
      },
    };
  }

  /**
   * Returns transaction decision
   * @returns {TransactionDecisionType | undefined}
   */
  getTransactionDecisionResult(): TransactionDecisionType | undefined {
    const conversationalRequest: ConversationalActionRequest = this.googleAction
      .$request as ConversationalActionRequest;

    return (conversationalRequest.intent?.params?.TransactionDecision
      ?.resolved as TransactionDecisionResult).transactionDecision;
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
  // isDeliveryAddressUpdated(): boolean {
  //   return this.getTransactionDecisionResult() === 'DELIVERY_ADDRESS_UPDATED';
  // }

  /**
   * Returns true if user asked for a cart change
   * @returns {boolean}
   */
  isCartChangeRequested(): boolean {
    return this.getTransactionDecisionResult() === 'CART_CHANGE_REQUESTED';
  }

  getSubscriptions(skus: string[]): Promise<Sku[] | undefined> {
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

  // TODO: Implement getPurchaseStatus
  getPurchaseStatus(): PurchaseStatus | undefined {
    return;
  }
  async getSkus(skus: string[], type: SkuType): Promise<Sku[]> {
    const conversationId = (this.googleAction.$request as ConversationalActionRequest).session?.id;
    if (!this.googleAssistant.config.transactions?.androidPackageName) {
      throw new JovoError(
        'getSkus needs the Android App package name',
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
      );
    }

    const accessToken = await this.getGoogleApiAccessToken();

    try {
      const response = await HttpService.request({
        url: `https://actions.googleapis.com/v3/packages/${
          this.googleAssistant.config.transactions!.androidPackageName
        }/skus:batchGet`,
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        data: {
          conversationId,
          skuType: type,
          ids: skus,
        },
      });

      return response.data?.skus;
    } catch (e) {
      throw e;
    }
  }

  async getGoogleApiAccessToken(keyFile?: unknown) {
    if (!keyFile && !this.googleAssistant.config.transactions?.keyFile) {
      throw new JovoError(
        'Please add a valid keyFile object to the GoogleAssistant transaction config',
        ErrorCode.ERR,
        'jovo-platform-googleassistant',
      );
    }
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
      throw e;
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
    const conversationalRequest: ConversationalActionRequest = googleAction.$request as ConversationalActionRequest;

    if (
      conversationalRequest.intent?.params?.TransactionRequirementsCheck &&
      (conversationalRequest.intent?.params?.TransactionRequirementsCheck
        ?.resolved as TransactionRequirementsCheckResult)['@type'] ===
        'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckResult'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'TRANSACTION_REQUIREMENTS_CHECK');
    }

    if (
      conversationalRequest.intent?.params?.TransactionDecision &&
      (conversationalRequest.intent?.params?.TransactionDecision
        ?.resolved as TransactionDecisionResult)['@type'] ===
        'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValue'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'TRANSACTION_DECISION');
    }

    if (
      conversationalRequest.intent?.params?.TransactionDeliveryAddress &&
      (conversationalRequest.intent?.params?.TransactionDeliveryAddress
        ?.resolved as TransactionDeliveryAddressResult)['@type'] ===
        'type.googleapis.com/google.actions.v2.DeliveryAddressValue'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'DELIVERY_ADDRESS');
    }

    if (
      conversationalRequest.intent?.params?.DigitalPurchaseCheck &&
      (conversationalRequest.intent?.params?.DigitalPurchaseCheck
        ?.resolved as TransactionDigitalPurchaseCheckResult)['@type'] ===
        'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckResult'
    ) {
      _set(googleAction.$type, 'type', 'ON_TRANSACTION');
      _set(googleAction.$type, 'subType', 'DIGITAL_PURCHASE_CHECK');
    }

    //TODO: Implement ON_COMPLETE_PURCHASE
    //
    // if (
    //   _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
    //   'actions.intent.COMPLETE_PURCHASE'
    // ) {
    //   _set(googleAction.$type, 'type', 'ON_TRANSACTION');
    //   _set(googleAction.$type, 'subType', 'ON_COMPLETE_PURCHASE');
    // }
    //

    googleAction.$transaction = new Transaction(googleAction, this.googleAssistant!);
  }

  output(googleAction: GoogleAction) {
    const output = googleAction.$output;
    if (output.GoogleAssistant.TransactionOrder) {
      const {
        order,
        orderOptions,
        presentationOptions,
        paymentParameters,
      } = googleAction.$output.GoogleAssistant.TransactionOrder!;

      _set(googleAction.$response!, 'session.params.order', {
        '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValueSpec',
        'orderOptions': orderOptions,
        'presentationOptions': presentationOptions,
        'order': order,
        'paymentParameters': paymentParameters,
      });

      _set(googleAction.$response!, 'session.params.TransactionRequirementsCheck', undefined);
    }

    if (output.GoogleAssistant.TransactionOrderUpdate) {
      _set(
        googleAction.$response!,
        'prompt.orderUpdate',
        googleAction.$output.GoogleAssistant.TransactionOrderUpdate!.orderUpdate,
      );
    }

    if (output.GoogleAssistant.AskForDeliveryAddress) {
      _set(googleAction.$response!, 'session.params.TransactionDeliveryAddress', {
        '@type': 'type.googleapis.com/google.actions.v2.DeliveryAddressValueSpec',
        'addressOptions': {
          reason: output.GoogleAssistant.AskForDeliveryAddress.reason,
        },
      });
    }
    if (output.GoogleAssistant.TransactionDigitalPurchaseRequirementsCheck) {
      _set(googleAction.$response!, 'session.params.DigitalPurchaseCheck', {
        '@type': 'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckSpec',
      });
    }

    if (output.GoogleAssistant.CompletePurchase) {
      _set(googleAction.$response!, 'session.params.purchase', {
        '@type': 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
        'skuId': output.GoogleAssistant.CompletePurchase.skuId,
      });
    }
  }
  uninstall(googleAssistant: GoogleAssistant) {}
}
