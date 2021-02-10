import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaSkill } from '../core/AlexaSkill';
export declare class AmazonPay {
    private alexaSkill;
    constructor(alexaSkill: AlexaSkill);
    createSetupPayload(): SetupPayloadBuilder;
    createChargePayload(): ChargePayloadBuilder;
}
export declare class AmazonPayPlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
}
export declare type CurrencyCodes = 'EUR' | 'GBP' | 'JPY' | 'USD';
export declare type CountryCodes = 'AT' | 'BE' | 'CH' | 'CY' | 'DE' | 'DK' | 'ES' | 'FR' | 'HU' | 'IE' | 'IT' | 'JP' | 'LU' | 'NL' | 'PT' | 'SE' | 'UK' | 'US';
export declare type Locales = 'de_DE' | 'en_GB' | 'en_US' | 'es_ES' | 'fr_FR' | 'it_IT' | 'ja_JP';
export declare type BillingAgreementType = 'CustomerInitiatedTransaction' | 'MerchantInitiatedTransaction';
export interface SetupPayload {
    '@type': 'SetupAmazonPayRequest';
    '@version': '2';
    'countryOfEstablishment': CountryCodes;
    'ledgerCurrency': CurrencyCodes;
    'sellerId': string;
    'checkoutLanguage'?: Locales;
    'billingAgreementAttributes'?: BillingAgreementAttributes;
    'needAmazonShippingAddress'?: boolean;
    'sandboxMode'?: boolean;
    'sandboxCustomerEmailId'?: string;
}
export interface BillingAgreementAttributes {
    '@type': 'BillingAgreementAttributes';
    '@version': '2';
    'billingAgreementType'?: BillingAgreementType;
    'subscriptionAmount'?: SubscriptionAmount;
    'sellerBillingAgreementAttributes'?: SellerBillingAgreementAttributes;
}
export interface SubscriptionAmount {
    '@type': 'Price';
    '@version': '2';
    'amount': string;
    'currencyCode': CurrencyCodes;
}
export interface SellerBillingAgreementAttributes {
    '@type': 'SellerBillingAgreementAttributes';
    '@version': '2';
    'sellerBillingAgreementId'?: string;
    'storeName'?: string;
    'customInformation'?: string;
}
export declare class SetupPayloadBuilder {
    private wasBillingAgreementAttributesModified;
    private wasSubscriptionAmountModified;
    private wasSellerBillingAgreementAttributesModified;
    payload: SetupPayload;
    billingAgreementAttributes: BillingAgreementAttributes;
    subscriptionAmount: SubscriptionAmount;
    sellerBillingAgreementAttributes: SellerBillingAgreementAttributes;
    setCountryOfEstablishment(countryCode: CountryCodes): this;
    setLedgerCurrency(currencyCode: CurrencyCodes): this;
    setSellerId(sellerId: string): this;
    setCheckoutLanguage(locale: Locales): this;
    setNeedAmazonShippingAddress(bool: boolean): this;
    setSandboxMode(bool: boolean): this;
    setSandboxEmail(email: string): this;
    setBillingAgreementType(type: BillingAgreementType): this;
    setSubscriptionAmount(amount: string): this;
    setSubscriptionCurrencyCode(currencyCode: CurrencyCodes): this;
    setSellerBillingAgreementId(id: string): this;
    setStoreName(name: string): this;
    setCustomInformation(info: string): this;
    build(): SetupPayload;
}
export interface ChargePayload {
    '@type': 'ChargeAmazonPayRequest';
    '@version': '2';
    'billingAgreementId': string;
    'paymentAction': PaymentActions;
    'sellerId': string;
    'authorizeAttributes': {
        '@type': 'AuthorizeAttributes';
        '@version': '2';
        'authorizationReferenceId': string;
        'authorizationAmount': {
            '@type': 'Price';
            '@version': '2';
            'amount': string;
            'currencyCode': CurrencyCodes;
        };
        'sellerAuthorizationNote'?: string;
        'softDescriptor'?: string;
        'transactionTimeout'?: string;
    };
    'sellerOrderAttributes'?: SellerOrderAttributes;
}
export interface SellerOrderAttributes {
    '@type': 'SellerOrderAttributes';
    '@version': '2';
    'sellerOrderId'?: string;
    'storeName'?: string;
    'customInformation'?: string;
    'sellerNote'?: string;
}
export declare type PaymentActions = 'Authorize' | 'AuthorizeAndCapture';
export declare class ChargePayloadBuilder {
    private wasSellerOrderAttributesModified;
    payload: ChargePayload;
    sellerOrderAttributes: SellerOrderAttributes;
    setBillingAgreementId(id: string): this;
    setPaymentAction(action: PaymentActions): this;
    setSellerId(id: string): this;
    setAuthorizationReferenceId(id: string): this;
    setAuthorizationAmount(amount: string): this;
    setAuthorizationCurrencyCode(code: CurrencyCodes): this;
    setSellerAuthorizationNote(note: string): this;
    setSoftDescriptor(description: string): this;
    setTransactionTimeout(timeout: string): this;
    setSellerOrderId(id: string): this;
    setStoreName(name: string): this;
    setCustomInformation(info: string): this;
    setSellerNote(note: string): this;
    build(): ChargePayload;
}
