"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const GoogleAction_1 = require("../core/GoogleAction");
const _set = require("lodash.set");
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
    checkPhysicalTransactionRequirements() {
        return this.checkRequirements();
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
    updateOrder(orderUpdate) {
        this.googleAction.$output.GoogleAssistant = {
            TransactionOrderUpdate: {
                orderUpdate,
            },
        };
    }
    buildReservation(reservation, presentationOptions = { actionDisplayName: 'RESERVE' }, orderOptions = { requestDeliveryAddress: false }) {
        this.buildOrder(reservation, presentationOptions, orderOptions);
    }
    updateReservation(orderUpdate) {
        this.updateOrder(orderUpdate);
    }
    getRequirementsCheckResult() {
        var _a, _b, _c, _d, _e, _f;
        const request = this.googleAction
            .$request;
        if (((_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.TransactionRequirementsCheck) &&
            ((_d = (_c = request.session) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.TransactionRequirementsCheck['@type']) ===
                'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckResult') {
            return (_f = (_e = request.session) === null || _e === void 0 ? void 0 : _e.params) === null || _f === void 0 ? void 0 : _f.TransactionRequirementsCheck.resultType;
        }
        return;
    }
    getDigitalPurchaseRequirementsCheckResult() {
        var _a, _b, _c, _d, _e, _f;
        const request = this.googleAction
            .$request;
        if (((_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.DigitalPurchaseCheck) &&
            ((_d = (_c = request.session) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.DigitalPurchaseCheck['@type']) ===
                'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckResult') {
            return (_f = (_e = request.session) === null || _e === void 0 ? void 0 : _e.params) === null || _f === void 0 ? void 0 : _f.DigitalPurchaseCheck.resultType;
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
        var _a, _b;
        const request = this.googleAction
            .$request;
        return ((_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.TransactionDeliveryAddress)
            .userDecision;
    }
    isDeliveryAddressAccepted() {
        return this.getDeliveryAddressDecision() === 'ACCEPTED';
    }
    isDeliveryAddressRejected() {
        return this.getDeliveryAddressDecision() === 'REJECTED';
    }
    getDeliveryAddress() {
        return this.getDeliveryAddressLocation();
    }
    getOrder() {
        var _a, _b, _c;
        const request = this.googleAction
            .$request;
        return (_c = (_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.order) === null || _c === void 0 ? void 0 : _c.order;
    }
    getReservation() {
        return this.getOrder();
    }
    getDeliveryAddressLocation() {
        var _a, _b, _c;
        const request = this.googleAction
            .$request;
        return (_c = (_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.TransactionDeliveryAddress) === null || _c === void 0 ? void 0 : _c.location;
    }
    createOrder(orderUpdate) {
        this.googleAction.$output.GoogleAssistant = {
            TransactionOrderUpdate: {
                orderUpdate,
            },
        };
    }
    getTransactionDecisionResult() {
        var _a, _b, _c;
        const conversationalRequest = this.googleAction
            .$request;
        return ((_c = (_b = (_a = conversationalRequest.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.TransactionDecision) === null || _c === void 0 ? void 0 : _c.resolved).transactionDecision;
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
    getPurchaseCompleteStatus() {
        var _a, _b, _c;
        const conversationalRequest = this.googleAction
            .$request;
        return ((_c = (_b = (_a = conversationalRequest.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.CompletePurchase) === null || _c === void 0 ? void 0 : _c.resolved).purchaseStatus;
    }
    async getSkus(skus, type) {
        var _a, _b, _c;
        const conversationId = (_a = this.googleAction.$request.session) === null || _a === void 0 ? void 0 : _a.id;
        if (!((_b = this.googleAssistant.config.transactions) === null || _b === void 0 ? void 0 : _b.androidPackageName)) {
            throw new jovo_core_1.JovoError('getSkus needs the Android App package name', jovo_core_1.ErrorCode.ERR, 'jovo-platform-googleassistant');
        }
        const accessToken = await this.getGoogleApiAccessToken();
        try {
            const response = await jovo_core_1.HttpService.request({
                url: `https://actions.googleapis.com/v3/packages/${this.googleAssistant.config.transactions.androidPackageName}/skus:batchGet`,
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                data: {
                    conversationId,
                    skuType: type,
                    ids: skus,
                },
            });
            return (_c = response.data) === null || _c === void 0 ? void 0 : _c.skus;
        }
        catch (e) {
            throw e;
        }
    }
    async getGoogleApiAccessToken(keyFile) {
        var _a;
        if (!keyFile && !((_a = this.googleAssistant.config.transactions) === null || _a === void 0 ? void 0 : _a.keyFile)) {
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
            throw e;
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const conversationalRequest = googleAction.$request;
        if (((_b = (_a = conversationalRequest.intent) === null || _a === void 0 ? void 0 : _a.params) === null || _b === void 0 ? void 0 : _b.TransactionRequirementsCheck) &&
            ((_e = (_d = (_c = conversationalRequest.intent) === null || _c === void 0 ? void 0 : _c.params) === null || _d === void 0 ? void 0 : _d.TransactionRequirementsCheck) === null || _e === void 0 ? void 0 : _e.resolved)['@type'] ===
                'type.googleapis.com/google.actions.transactions.v3.TransactionRequirementsCheckResult') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'TRANSACTION_REQUIREMENTS_CHECK');
        }
        if (((_g = (_f = conversationalRequest.intent) === null || _f === void 0 ? void 0 : _f.params) === null || _g === void 0 ? void 0 : _g.TransactionDecision) &&
            ((_k = (_j = (_h = conversationalRequest.intent) === null || _h === void 0 ? void 0 : _h.params) === null || _j === void 0 ? void 0 : _j.TransactionDecision) === null || _k === void 0 ? void 0 : _k.resolved)['@type'] ===
                'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValue') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'TRANSACTION_DECISION');
        }
        if (((_m = (_l = conversationalRequest.intent) === null || _l === void 0 ? void 0 : _l.params) === null || _m === void 0 ? void 0 : _m.TransactionDeliveryAddress) &&
            ((_q = (_p = (_o = conversationalRequest.intent) === null || _o === void 0 ? void 0 : _o.params) === null || _p === void 0 ? void 0 : _p.TransactionDeliveryAddress) === null || _q === void 0 ? void 0 : _q.resolved)['@type'] ===
                'type.googleapis.com/google.actions.v2.DeliveryAddressValue') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'DELIVERY_ADDRESS');
        }
        if (((_s = (_r = conversationalRequest.intent) === null || _r === void 0 ? void 0 : _r.params) === null || _s === void 0 ? void 0 : _s.DigitalPurchaseCheck) &&
            ((_v = (_u = (_t = conversationalRequest.intent) === null || _t === void 0 ? void 0 : _t.params) === null || _u === void 0 ? void 0 : _u.DigitalPurchaseCheck) === null || _v === void 0 ? void 0 : _v.resolved)['@type'] ===
                'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckResult') {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'DIGITAL_PURCHASE_CHECK');
        }
        if ((_x = (_w = conversationalRequest.intent) === null || _w === void 0 ? void 0 : _w.params) === null || _x === void 0 ? void 0 : _x.CompletePurchase) {
            _set(googleAction.$type, 'type', 'ON_TRANSACTION');
            _set(googleAction.$type, 'subType', 'ON_COMPLETE_PURCHASE');
        }
        googleAction.$transaction = new Transaction(googleAction, this.googleAssistant);
    }
    output(googleAction) {
        const output = googleAction.$output;
        if (output.GoogleAssistant.TransactionOrder) {
            const { order, orderOptions, presentationOptions, paymentParameters, } = googleAction.$output.GoogleAssistant.TransactionOrder;
            _set(googleAction.$response, 'session.params.order', {
                '@type': 'type.googleapis.com/google.actions.transactions.v3.TransactionDecisionValueSpec',
                'orderOptions': orderOptions,
                'presentationOptions': presentationOptions,
                'order': order,
                'paymentParameters': paymentParameters,
            });
            _set(googleAction.$response, 'session.params.TransactionRequirementsCheck', undefined);
        }
        if (output.GoogleAssistant.TransactionOrderUpdate) {
            _set(googleAction.$response, 'prompt.orderUpdate', googleAction.$output.GoogleAssistant.TransactionOrderUpdate.orderUpdate);
        }
        if (output.GoogleAssistant.AskForDeliveryAddress) {
            _set(googleAction.$response, 'session.params.TransactionDeliveryAddress', {
                '@type': 'type.googleapis.com/google.actions.v2.DeliveryAddressValueSpec',
                'addressOptions': {
                    reason: output.GoogleAssistant.AskForDeliveryAddress.reason,
                },
            });
        }
        if (output.GoogleAssistant.TransactionDigitalPurchaseRequirementsCheck) {
            _set(googleAction.$response, 'session.params.DigitalPurchaseCheck', {
                '@type': 'type.googleapis.com/google.actions.transactions.v3.DigitalPurchaseCheckSpec',
            });
        }
        if (output.GoogleAssistant.CompletePurchase) {
            _set(googleAction.$response, 'session.params.purchase', {
                '@type': 'type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec',
                'skuId': output.GoogleAssistant.CompletePurchase.skuId,
            });
        }
    }
    uninstall(googleAssistant) { }
}
exports.TransactionsPlugin = TransactionsPlugin;
//# sourceMappingURL=Transaction.js.map