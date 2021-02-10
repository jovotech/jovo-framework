"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaSkill_1 = require("../core/AlexaSkill");
const alexa_enums_1 = require("../core/alexa-enums");
class AmazonPay {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
    }
    createSetupPayload() {
        return new SetupPayloadBuilder();
    }
    createChargePayload() {
        return new ChargePayloadBuilder();
    }
}
exports.AmazonPay = AmazonPay;
class AmazonPayPlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.$pay = undefined;
        AlexaSkill_1.AlexaSkill.prototype.pay = function () {
            return new AmazonPay(this);
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        var _a, _b, _c;
        const alexaRequest = alexaSkill.$request;
        if (((_a = alexaRequest.request) === null || _a === void 0 ? void 0 : _a.type) === 'Connections.Response' &&
            (((_b = alexaRequest.request) === null || _b === void 0 ? void 0 : _b.name) === 'Charge' || ((_c = alexaRequest.request) === null || _c === void 0 ? void 0 : _c.name) === 'Setup')) {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_PURCHASE,
            };
        }
        alexaSkill.$pay = new AmazonPay(alexaSkill);
    }
}
exports.AmazonPayPlugin = AmazonPayPlugin;
// No interface for SetupResponsePayload because it's different for every region (DE, JP, UK, US).
class SetupPayloadBuilder {
    constructor() {
        // flags that are used when building the final payload.
        this.wasBillingAgreementAttributesModified = false;
        this.wasSubscriptionAmountModified = false;
        this.wasSellerBillingAgreementAttributesModified = false;
        this.payload = {
            '@type': 'SetupAmazonPayRequest',
            '@version': '2',
            'countryOfEstablishment': 'US',
            'ledgerCurrency': 'USD',
            'sellerId': '',
        };
        this.billingAgreementAttributes = {
            '@type': 'BillingAgreementAttributes',
            '@version': '2',
        };
        this.subscriptionAmount = {
            '@type': 'Price',
            '@version': '2',
            'amount': '',
            'currencyCode': 'USD',
        };
        this.sellerBillingAgreementAttributes = {
            '@type': 'SellerBillingAgreementAttributes',
            '@version': '2',
        };
    }
    setCountryOfEstablishment(countryCode) {
        this.payload.countryOfEstablishment = countryCode;
        return this;
    }
    setLedgerCurrency(currencyCode) {
        this.payload.ledgerCurrency = currencyCode;
        return this;
    }
    setSellerId(sellerId) {
        this.payload.sellerId = sellerId;
        return this;
    }
    setCheckoutLanguage(locale) {
        this.payload.checkoutLanguage = locale;
        return this;
    }
    setNeedAmazonShippingAddress(bool) {
        this.payload.needAmazonShippingAddress = bool;
        return this;
    }
    setSandboxMode(bool) {
        this.payload.sandboxMode = bool;
        return this;
    }
    setSandboxEmail(email) {
        this.payload.sandboxCustomerEmailId = email;
        return this;
    }
    setBillingAgreementType(type) {
        this.wasBillingAgreementAttributesModified = true;
        this.billingAgreementAttributes.billingAgreementType = type;
        return this;
    }
    setSubscriptionAmount(amount) {
        this.wasSubscriptionAmountModified = true;
        this.subscriptionAmount.amount = amount;
        return this;
    }
    setSubscriptionCurrencyCode(currencyCode) {
        this.wasSubscriptionAmountModified = true;
        this.subscriptionAmount.currencyCode = currencyCode;
        return this;
    }
    setSellerBillingAgreementId(id) {
        this.wasSellerBillingAgreementAttributesModified = true;
        this.sellerBillingAgreementAttributes.sellerBillingAgreementId = id;
        return this;
    }
    setStoreName(name) {
        this.wasSellerBillingAgreementAttributesModified = true;
        this.sellerBillingAgreementAttributes.storeName = name;
        return this;
    }
    setCustomInformation(info) {
        this.wasSellerBillingAgreementAttributesModified = true;
        this.sellerBillingAgreementAttributes.customInformation = info;
        return this;
    }
    build() {
        if (this.wasSubscriptionAmountModified) {
            /**
             * case where only subscriptionAmount was modified;
             * billingAgreementAttributes has to be added to `payload`.
             */
            this.wasBillingAgreementAttributesModified = true;
            this.billingAgreementAttributes.subscriptionAmount = this.subscriptionAmount;
        }
        if (this.wasSellerBillingAgreementAttributesModified) {
            /**
             * case where only sellerBillingAgreementAttributes was modified;
             * billingAgreementAttributes has to be added to `payload`.
             */
            this.wasBillingAgreementAttributesModified = true;
            this.billingAgreementAttributes.sellerBillingAgreementAttributes = this.sellerBillingAgreementAttributes;
        }
        if (this.wasBillingAgreementAttributesModified) {
            this.payload.billingAgreementAttributes = this.billingAgreementAttributes;
        }
        return this.payload;
    }
}
exports.SetupPayloadBuilder = SetupPayloadBuilder;
// No interface for ChargeResponsePayload because it's different for every region (DE, JP, UK, US).
class ChargePayloadBuilder {
    constructor() {
        this.wasSellerOrderAttributesModified = false;
        this.payload = {
            '@type': 'ChargeAmazonPayRequest',
            '@version': '2',
            'billingAgreementId': '',
            'paymentAction': 'AuthorizeAndCapture',
            'sellerId': '',
            'authorizeAttributes': {
                '@type': 'AuthorizeAttributes',
                '@version': '2',
                'authorizationReferenceId': '',
                'authorizationAmount': {
                    '@type': 'Price',
                    '@version': '2',
                    'amount': '',
                    'currencyCode': 'USD',
                },
            },
        };
        this.sellerOrderAttributes = {
            '@type': 'SellerOrderAttributes',
            '@version': '2',
        };
    }
    setBillingAgreementId(id) {
        this.payload.billingAgreementId = id;
        return this;
    }
    setPaymentAction(action) {
        this.payload.paymentAction = action;
        return this;
    }
    setSellerId(id) {
        this.payload.sellerId = id;
        return this;
    }
    setAuthorizationReferenceId(id) {
        this.payload.authorizeAttributes.authorizationReferenceId = id;
        return this;
    }
    setAuthorizationAmount(amount) {
        this.payload.authorizeAttributes.authorizationAmount.amount = amount;
        return this;
    }
    setAuthorizationCurrencyCode(code) {
        this.payload.authorizeAttributes.authorizationAmount.currencyCode = code;
        return this;
    }
    setSellerAuthorizationNote(note) {
        this.payload.authorizeAttributes.sellerAuthorizationNote = note;
        return this;
    }
    setSoftDescriptor(description) {
        this.payload.authorizeAttributes.softDescriptor = description;
        return this;
    }
    setTransactionTimeout(timeout) {
        this.payload.authorizeAttributes.transactionTimeout = timeout;
        return this;
    }
    setSellerOrderId(id) {
        this.wasSellerOrderAttributesModified = true;
        this.sellerOrderAttributes.sellerOrderId = id;
        return this;
    }
    setStoreName(name) {
        this.wasSellerOrderAttributesModified = true;
        this.sellerOrderAttributes.storeName = name;
        return this;
    }
    setCustomInformation(info) {
        this.wasSellerOrderAttributesModified = true;
        this.sellerOrderAttributes.customInformation = info;
        return this;
    }
    setSellerNote(note) {
        this.wasSellerOrderAttributesModified = true;
        this.sellerOrderAttributes.sellerNote = note;
        return this;
    }
    build() {
        if (this.wasSellerOrderAttributesModified) {
            this.payload.sellerOrderAttributes = this.sellerOrderAttributes;
        }
        return this.payload;
    }
}
exports.ChargePayloadBuilder = ChargePayloadBuilder;
//# sourceMappingURL=AmazonPay.js.map