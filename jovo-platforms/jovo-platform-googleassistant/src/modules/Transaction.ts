import {EnumRequestType, Plugin, SpeechBuilder, ErrorCode, JovoError} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";
import {GoogleActionAPI} from "../services/GoogleActionAPI";
import {GoogleActionAPIResponse} from "../services/GoogleActionAPIResponse";

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
    requestDeliveryAddress: boolean;
}

export interface Requirements {
    orderOptions: OrderOptions;
    googleProvidedOptions: GoogleProvidedOptions;
}


export type RequirementsCheckResult = 'USER_ACTION_REQUIRED' | 'OK' | 'ASSISTANT_SURFACE_NOT_SUPPORTED' | 'REGION_NOT_SUPPORTED';
export type DeliveryAddressDecision = 'ACCEPTED' | 'REJECTED';
export type TransactionDecision = 'ORDER_ACCEPTED' | 'REJECTED' | 'ORDER_REJECTED' | 'DELIVERY_ADDRESS_UPDATED' | 'CART_CHANGE_REQUESTED';
export type SkuType = 'SKU_TYPE_IN_APP' | 'SKU_TYPE_SUBSCRIPTION';
export type PurchaseStatus = 'PURCHASE_STATUS_OK' | 'PURCHASE_STATUS_ITEM_CHANGE_REQUESTED' | 'PURCHASE_STATUS_USER_CANCELLED' | 'PURCHASE_STATUS_ERROR' | 'PURCHASE_STATUS_UNSPECIFIED';

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
        title: string,
    };
    type: string;

}
export interface UserNotification {
    text: string;
    title: string;
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
     * @param {OrderOptions} orderOptions
     * @param {PaymentOptions} paymentOptions
     * @returns {this}
     */
    checkRequirements(orderOptions: OrderOptions, paymentOptions: PaymentOptions) {
        this.googleAction.$output.GoogleAssistant = {
            TransactionRequirementsCheck: {
                orderOptions,
                paymentOptions
            }
        };
        return this;
    }

    /**
     * Return requirements check result
     * @returns {RequirementsCheckResult | undefined}
     */
    getRequirementsCheckResult(): RequirementsCheckResult | undefined {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_REQUIREMENTS_CHECK_RESULT') {
                return _get(argument, 'extension.resultType');
            }
        }
    }


    /**
     * Check if requirements result is OK
     * @returns {boolean}
     */
    isRequirementsCheckOk() {
        return this.getRequirementsCheckResult() === 'OK';
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
            }
        };
        return this;
    }


    /**
     * Returns delivery address decision by the user.
     * @returns {DeliveryAddressDecision | undefined}
     */
    getDeliveryAddressDecision(): DeliveryAddressDecision | undefined {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
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
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_REQUIREMENTS_CHECK_RESULT') {
                return _get(argument, 'extension.resultType');
            }
        }
    }

    /**
     * Returns delivery address object.
     * @returns {DeliveryAddressLocation | undefined}
     */
    getDeliveryAddressLocation(): DeliveryAddressLocation | undefined {
        if(!this.isDeliveryAddressAccepted()) {
            return;
        }
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
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
    transactionDecision(orderOptions: OrderOptions, paymentOptions: PaymentOptions, proposedOrder: any) { // tslint:disable-line
        this.googleAction.$output.GoogleAssistant = {
            TransactionDecision: {
                orderOptions,
                paymentOptions,
                proposedOrder,
            }
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
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_DECISION_VALUE') {
                return _get(argument, 'extension.userDecision');
            }
        }
    }


    /**
     * Returns true if user accepted transaction
     * @returns {boolean}
     */
    isOrderAccepted(): boolean {
        return this.getTransactionDecisionResult() === "ORDER_ACCEPTED";
    }

    /**
     * Returns true if user rejected transaction
     * @returns {boolean}
     */
    isOrderRejected(): boolean {
        return this.getTransactionDecisionResult() === "ORDER_REJECTED";
    }

    /**
     * Returns true if user updated the delivery address
     * @returns {boolean}
     */
    isDeliveryAddressUpdated(): boolean {
        return this.getTransactionDecisionResult() === "DELIVERY_ADDRESS_UPDATED";
    }

    /**
     * Returns true if user asked for a cart change
     * @returns {boolean}
     */
    isCartChangeRequested(): boolean {
        return this.getTransactionDecisionResult() === "CART_CHANGE_REQUESTED";
    }


    getSubscriptions(skus: string[]): Promise<any[]> { // tslint:disable-line
        return this.getSkus(skus, "SKU_TYPE_SUBSCRIPTION");
    }

    getConsumables(skus: string[]): Promise<any[]> { // tslint:disable-line
        return this.getSkus(skus, "SKU_TYPE_IN_APP");
    }

    completePurchase(skuId: string) {
        this.googleAction.$output.GoogleAssistant = {
            CompletePurchase: {
                skuId,
            }
        };
    }
    getPurchaseStatus(): PurchaseStatus | undefined {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'COMPLETE_PURCHASE_VALUE') {
                return argument.extension.purchaseStatus;
            }
        }
    }

    private getSkus(skus: string[], type: SkuType): Promise<any[]> { // tslint:disable-line
        const conversationId = _get(this.googleAction.$request, 'originalDetectIntentRequest.payload.conversation.conversationId');

        if (!this.googleAssistant.config.transactions || !this.googleAssistant.config.transactions.androidPackageName) {
            throw new JovoError(
                'getSkus needs the Android App package name',
                ErrorCode.ERR,
                'jovo-platform-googleassistant'
            );
        }

        const promise = this.getGoogleApiAccessToken()
            .then((accessToken: string) => {
                return GoogleActionAPI.apiCall({
                    endpoint: 'https://actions.googleapis.com',
                    path: `/v3/packages/${this.googleAssistant.config.transactions!.androidPackageName}/skus:batchGet`,
                    method: 'POST',
                    permissionToken: accessToken,
                    json: {
                        conversationId,
                        skuType: type,
                        ids: skus
                    }
                }) as Promise<GoogleActionAPIResponse>;
            });

        return promise.then((response: GoogleActionAPIResponse) => response.data);
    }

    private getGoogleApiAccessToken(): Promise<string> {
        if (!this.googleAssistant.config.transactions || !this.googleAssistant.config.transactions.keyFile) {
            throw new JovoError(
                'Please add a valid keyFile object to the GoogleAssistant transaction config',
                ErrorCode.ERR,
                'jovo-platform-googleassistant'
            );
        }
        /**
         * DigitalGoods.ts needs the googleapis package to function.
         * To reduce overall package size, googleapis wasn't added as a dependency.
         * googleapis has to be manually installed
         */
        try {
            const googleapis = require('googleapis').google;

            return googleapis.auth.getClient({
                keyFile: this.googleAssistant.config.transactions!.keyFile,
                scopes: [ 'https://www.googleapis.com/auth/actions.purchases.digital' ]
            })
                .then((client: any) => client.authorize()) // tslint:disable-line
                .then((authorization: any) => authorization.access_token as string); // tslint:disable-line

        } catch (e) {
            console.log(e);
            console.log(e.stack);
            if (e.message === 'Cannot find module \'googleapis\'') {
                return Promise.reject(new JovoError(
                    e.message,
                    ErrorCode.ERR,
                    'jovo-platform-googleassistant',
                    undefined,
                    'Please run `npm install googleapis`'
                ));
            }
            return Promise.reject(new Error('Could not retrieve Google API access token'));
        }

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
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.TRANSACTION_REQUIREMENTS_CHECK') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'TRANSACTION_REQUIREMENTS_CHECK');

        }

        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.DELIVERY_ADDRESS') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'DELIVERY_ADDRESS');

        }

        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.TRANSACTION_DECISION') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'TRANSACTION_DECISION');
        }


        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.TRANSACTION_DECISION') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'COMPLETE_PURCHASE');
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
                    '@type': "type.googleapis.com/google.actions.v2.TransactionRequirementsCheckSpec",
                    paymentOptions: _get(output, 'GoogleAssistant.TransactionRequirementsCheck.paymentOptions')
                }
                // TODO: orderOptions
            });
        }


        if (_get(output, 'GoogleAssistant.AskForDeliveryAddress')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.DELIVERY_ADDRESS',
                data: {
                    '@type': "type.googleapis.com/google.actions.v2.DeliveryAddressValueSpec",
                    addressOptions: {
                        reason: _get(output, 'GoogleAssistant.AskForDeliveryAddress.reason')
                    }
                }
            });
        }

        if (_get(output, 'GoogleAssistant.TransactionDecision')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.TRANSACTION_DECISION',
                data: {
                    '@type': "type.googleapis.com/google.actions.v2.TransactionDecisionValueSpec",
                    orderOptions: {
                        requestDeliveryAddress: true,
                    },
                    paymentOptions: _get(output, 'GoogleAssistant.TransactionDecision.paymentOptions'),
                    proposedOrder: _get(output, 'GoogleAssistant.TransactionDecision.proposedOrder')
                    // TODO: orderOptions

                }
            });
        }


        if (_get(output, 'GoogleAssistant.OrderUpdate')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            richResponseItems.push({
                structuredResponse: {
                    orderUpdate: _get(output, 'GoogleAssistant.OrderUpdate.orderUpdate'),
                }
            });

            richResponseItems.push({
                simpleResponse: {
                    textToSpeech: _get(output, 'GoogleAssistant.OrderUpdate.speech'),
                }
            });
            _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
        }

        const completePurchase = _get(output, "GoogleAssistant.CompletePurchase");

        if (completePurchase) {
            _set(googleAction.$originalResponse, "expectUserResponse", true);
            _set(googleAction.$originalResponse, "systemIntent", {
                intent: "actions.intent.COMPLETE_PURCHASE",
                inputValueData: {
                    "@type": "type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec",
                    skuId: completePurchase.skuId
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
    uninstall(googleAssistant: GoogleAssistant) {

    }
}
