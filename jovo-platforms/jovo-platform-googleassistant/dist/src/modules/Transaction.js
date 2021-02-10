"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleAction_1 = require("../core/GoogleAction");
const __1 = require("..");
const GoogleActionAPI_1 = require("../services/GoogleActionAPI");
const _set = require("lodash.set");
const _get = require("lodash.get");
class Transaction {
    constructor(googleAction, googleAssistant) {
        this.googleAction = googleAction;
        this.googleAssistant = googleAssistant;
    }
    checkRequirements() {
        this.googleAction.$output.GoogleAssistant = {
            TransactionRequirementsCheck: {},
        };
        return this;
    }
    checkDigitalPurchaseRequirements() {
        this.googleAction.$output.GoogleAssistant = {
            TransactionDigitalPurchaseRequirementsCheck: {},
        };
        return this;
    }
    buildOrder(order, presentationOptions = { actionDisplayName: 'PLACE_ORDER' }, orderOptions = { requestDeliveryAddress: false }, paymentParameters) {
        this.googleAction.$output.GoogleAssistant = {
            TransactionOrder: {
                order,
                presentationOptions,
                orderOptions,
                paymentParameters,
            },
        };
    }
    updateOrder(order, reason, type = 'SNAPSHOT') {
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
    buildReservation(reservation, presentationOptions = { actionDisplayName: 'RESERVE' }, orderOptions = { requestDeliveryAddress: false }) {
        this.buildOrder(reservation, presentationOptions, orderOptions);
    }
    updateReservation(reservation, reason, type = 'SNAPSHOT') {
        this.updateOrder(reservation, reason, type);
    }
    getRequirementsCheckResult() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_REQUIREMENTS_CHECK_RESULT') {
                return _get(argument, 'extension.resultType');
            }
        }
    }
    getDigitalPurchaseRequirementsCheckResult() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
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
    isRequirementsCheckUserActionRequired() {
        return this.getRequirementsCheckResult() === 'USER_ACTION_REQUIRED';
    }
    isRequirementsCheckAssistantSurfaceNotSupported() {
        return this.getRequirementsCheckResult() === 'ASSISTANT_SURFACE_NOT_SUPPORTED';
    }
    isRequirementsCheckRegionNotSupported() {
        return this.getRequirementsCheckResult() === 'REGION_NOT_SUPPORTED';
    }
    askForDeliveryAddress(reason = '') {
        this.googleAction.$output.GoogleAssistant = {
            AskForDeliveryAddress: {
                reason,
            },
        };
        return this;
    }
    getDeliveryAddressDecision() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'DELIVERY_ADDRESS_VALUE') {
                return _get(argument, 'extension.userDecision');
            }
        }
    }
    isDeliveryAddressAccepted() {
        return this.getDeliveryAddressDecision() === 'ACCEPTED';
    }
    isDeliveryAddressRejected() {
        return this.getDeliveryAddressDecision() === 'REJECTED';
    }
    getDeliveryAddress() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'DELIVERY_ADDRESS_VALUE') {
                return _get(argument, 'extension.location');
            }
        }
    }
    getOrder() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_DECISION_VALUE') {
                return _get(argument, 'extension.order');
            }
        }
    }
    getReservation() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_DECISION_VALUE') {
                return _get(argument, 'extension.order');
            }
        }
    }
    getDeliveryAddressLocation() {
        if (!this.isDeliveryAddressAccepted()) {
            return;
        }
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'DELIVERY_ADDRESS_VALUE') {
                return _get(argument, 'extension.location');
            }
        }
    }
    transactionDecision(orderOptions, paymentOptions, proposedOrder) {
        this.googleAction.$output.GoogleAssistant = {
            TransactionDecision: {
                orderOptions,
                paymentOptions,
                proposedOrder,
            },
        };
        return this;
    }
    createOrder(speech, orderUpdate) {
        this.googleAction.$output.GoogleAssistant = {
            OrderUpdate: {
                orderUpdate,
                speech,
            },
        };
    }
    getTransactionDecisionResult() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'TRANSACTION_DECISION_VALUE') {
                return (_get(argument, 'extension.transactionDecision') ||
                    _get(argument, 'extension.userDecision'));
            }
        }
    }
    isOrderAccepted() {
        return this.getTransactionDecisionResult() === 'ORDER_ACCEPTED';
    }
    isReservationAccepted() {
        return this.getTransactionDecisionResult() === 'ORDER_ACCEPTED';
    }
    isOrderRejected() {
        return this.getTransactionDecisionResult() === 'ORDER_REJECTED';
    }
    isReservationRejected() {
        return this.getTransactionDecisionResult() === 'ORDER_REJECTED';
    }
    isDeliveryAddressUpdated() {
        return this.getTransactionDecisionResult() === 'DELIVERY_ADDRESS_UPDATED';
    }
    isCartChangeRequested() {
        return this.getTransactionDecisionResult() === 'CART_CHANGE_REQUESTED';
    }
    getSubscriptions(skus) {
        return this.getSkus(skus, 'SKU_TYPE_SUBSCRIPTION');
    }
    getConsumables(skus) {
        return this.getSkus(skus, 'SKU_TYPE_IN_APP');
    }
    completePurchase(skuId) {
        this.googleAction.$output.GoogleAssistant = {
            CompletePurchase: {
                skuId,
            },
        };
    }
    getPurchaseStatus() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'COMPLETE_PURCHASE_VALUE') {
                return argument.extension.purchaseStatus;
            }
        }
    }
    async getSkus(skus, type) {
        var _a;
        const conversationId = _get(this.googleAction.$request, 'originalDetectIntentRequest.payload.conversation.conversationId');
        if (!this.googleAssistant.config.transactions ||
            !this.googleAssistant.config.transactions.androidPackageName) {
            throw new jovo_core_1.JovoError('getSkus needs the Android App package name', jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant');
        }
        const accessToken = await this.getGoogleApiAccessToken();
        console.log({
            conversationId,
            skuType: type,
            ids: skus,
        });
        try {
            const response = await GoogleActionAPI_1.GoogleActionAPI.apiCall({
                endpoint: 'https://actions.googleapis.com',
                path: `/v3/packages/${this.googleAssistant.config.transactions.androidPackageName}/skus:batchGet`,
                method: 'POST',
                permissionToken: accessToken,
                json: {
                    conversationId,
                    skuType: type,
                    ids: skus,
                },
            });
            console.log(response.data);
            if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.skus) {
                return response.data.skus;
            }
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
    async getGoogleApiAccessToken() {
        if (!this.googleAssistant.config.transactions ||
            !this.googleAssistant.config.transactions.keyFile) {
            throw new jovo_core_1.JovoError('Please add a valid keyFile object to the GoogleAssistant transaction config', jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant');
        }
        try {
            const { google } = require('googleapis');
            const serviceAccount = this.googleAssistant.config.transactions.keyFile;
            const jwtClient = new google.auth.JWT(serviceAccount.client_email, null, serviceAccount.private_key, ['https://www.googleapis.com/auth/actions.purchases.digital'], null);
            return await this.authorizePromise(jwtClient);
        }
        catch (e) {
            if (e.message === "Cannot find module 'googleapis'") {
                return Promise.reject(new jovo_core_1.JovoError(e.message, jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant', undefined, 'Please run `npm install googleapis`'));
            }
        }
    }
    authorizePromise(jwtClient) {
        return new Promise((resolve, reject) => {
            jwtClient.authorize((err, tokens) => {
                if (err) {
                    return reject(err);
                }
                resolve(tokens.access_token);
            });
        });
    }
}
exports.Transaction = Transaction;
class TransactionsPlugin {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        this.googleAssistant = googleAssistant;
        GoogleAction_1.GoogleAction.prototype.$transaction = undefined;
    }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.TRANSACTION_REQUIREMENTS_CHECK') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'TRANSACTION_REQUIREMENTS_CHECK');
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.DIGITAL_PURCHASE_CHECK') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'DIGITAL_PURCHASE_CHECK');
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.DELIVERY_ADDRESS') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'DELIVERY_ADDRESS');
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.COMPLETE_PURCHASE') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'ON_COMPLETE_PURCHASE');
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.TRANSACTION_DECISION') {
            if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].arguments[0].name') === 'TRANSACTION_DECISION_VALUE') {
                _set(googleAction.$type, 'type', 'ON_TRANSACTION');
                _set(googleAction.$type, 'subType', 'TRANSACTION_DECISION');
            }
        }
        googleAction.$transaction = new Transaction(googleAction, this.googleAssistant);
    }
    output(googleAction) {
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new __1.GoogleActionResponse();
        }
        const output = googleAction.$output;
        if (_get(output, 'GoogleAssistant.TransactionRequirementsCheck')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.TRANSACTION_REQUIREMENTS_CHECK',
                data: {
                    '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckSpec',
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
                    '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValueSpec',
                    'order': _get(output, 'GoogleAssistant.TransactionOrder.order'),
                    'orderOptions': _get(output, 'GoogleAssistant.TransactionOrder.orderOptions'),
                    'presentationOptions': _get(output, 'GoogleAssistant.TransactionOrder.presentationOptions'),
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
    uninstall(googleAssistant) { }
}
exports.TransactionsPlugin = TransactionsPlugin;
//# sourceMappingURL=Transaction.js.map