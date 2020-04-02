import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaSkill } from '../core/AlexaSkill';
import { AlexaRequest } from '../core/AlexaRequest';
import { EnumAlexaRequestType } from '../core/alexa-enums';

export class AmazonPay {
  private alexaSkill: AlexaSkill;

  constructor(alexaSkill: AlexaSkill) {
    this.alexaSkill = alexaSkill;
  }

  createSetupPayload(): SetupPayloadBuilder {
    return new SetupPayloadBuilder();
  }

  createChargePayload(): ChargePayloadBuilder {
    return new ChargePayloadBuilder();
  }
}

export class AmazonPayPlugin implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    AlexaSkill.prototype.$pay = undefined;
    AlexaSkill.prototype.pay = function () {
      return new AmazonPay(this);
    };
  }

  uninstall(alexa: Alexa) {}

  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;

    if (
      alexaRequest.request?.type === 'Connections.Response' &&
      (alexaRequest.request?.name === 'Charge' || alexaRequest.request?.name === 'Setup')
    ) {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_PURCHASE,
      };
    }

    alexaSkill.$pay = new AmazonPay(alexaSkill);
  }
}

export type CurrencyCodes = 'EUR' | 'GBP' | 'JPY' | 'USD';
export type CountryCodes =
  | 'AT'
  | 'BE'
  | 'CH'
  | 'CY'
  | 'DE'
  | 'DK'
  | 'ES'
  | 'FR'
  | 'HU'
  | 'IE'
  | 'IT'
  | 'JP'
  | 'LU'
  | 'NL'
  | 'PT'
  | 'SE'
  | 'UK'
  | 'US';
export type Locales = 'de_DE' | 'en_GB' | 'en_US' | 'es_ES' | 'fr_FR' | 'it_IT' | 'ja_JP';
export type BillingAgreementType = 'CustomerInitiatedTransaction' | 'MerchantInitiatedTransaction';

// only extract optional attributes into their own interface
export interface SetupPayload {
  '@type': 'SetupAmazonPayRequest';
  '@version': '2';
  'countryOfEstablishment': CountryCodes;
  'ledgerCurrency': CurrencyCodes;
  'sellerId': string;
  'checkoutLanguage'?: Locales;
  'billingAgreementAttributes'?: BillingAgreementAttributes;
  'needAmazonShippingAddress'?: boolean;
  'sandboxMode'?: boolean; // default is false
  'sandboxCustomerEmailId'?: string; // needed if sandboxMode is true
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
  'amount': string; // min: 0.01, max: 150,000.00
  'currencyCode': CurrencyCodes;
}

export interface SellerBillingAgreementAttributes {
  '@type': 'SellerBillingAgreementAttributes';
  '@version': '2';
  'sellerBillingAgreementId'?: string; // only (a-z)(A-Z)(0-9)(-)(_) allowed
  'storeName'?: string;
  'customInformation'?: string;
}

// No interface for SetupResponsePayload because it's different for every region (DE, JP, UK, US).

export class SetupPayloadBuilder {
  // flags that are used when building the final payload.
  private wasBillingAgreementAttributesModified = false;
  private wasSubscriptionAmountModified = false;
  private wasSellerBillingAgreementAttributesModified = false;

  payload: SetupPayload = {
    '@type': 'SetupAmazonPayRequest',
    '@version': '2',
    'countryOfEstablishment': 'US',
    'ledgerCurrency': 'USD',
    'sellerId': '',
  };
  billingAgreementAttributes: BillingAgreementAttributes = {
    '@type': 'BillingAgreementAttributes',
    '@version': '2',
  };
  subscriptionAmount: SubscriptionAmount = {
    '@type': 'Price',
    '@version': '2',
    'amount': '',
    'currencyCode': 'USD',
  };
  sellerBillingAgreementAttributes: SellerBillingAgreementAttributes = {
    '@type': 'SellerBillingAgreementAttributes',
    '@version': '2',
  };

  setCountryOfEstablishment(countryCode: CountryCodes): this {
    this.payload.countryOfEstablishment = countryCode;
    return this;
  }

  setLedgerCurrency(currencyCode: CurrencyCodes): this {
    this.payload.ledgerCurrency = currencyCode;
    return this;
  }

  setSellerId(sellerId: string): this {
    this.payload.sellerId = sellerId;
    return this;
  }

  setCheckoutLanguage(locale: Locales): this {
    this.payload.checkoutLanguage = locale;
    return this;
  }

  setNeedAmazonShippingAddress(bool: boolean): this {
    this.payload.needAmazonShippingAddress = bool;
    return this;
  }

  setSandboxMode(bool: boolean): this {
    this.payload.sandboxMode = bool;
    return this;
  }

  setSandboxEmail(email: string): this {
    this.payload.sandboxCustomerEmailId = email;
    return this;
  }

  setBillingAgreementType(type: BillingAgreementType): this {
    this.wasBillingAgreementAttributesModified = true;
    this.billingAgreementAttributes.billingAgreementType = type;
    return this;
  }

  setSubscriptionAmount(amount: string): this {
    this.wasSubscriptionAmountModified = true;
    this.subscriptionAmount.amount = amount;
    return this;
  }

  setSubscriptionCurrencyCode(currencyCode: CurrencyCodes): this {
    this.wasSubscriptionAmountModified = true;
    this.subscriptionAmount.currencyCode = currencyCode;
    return this;
  }

  setSellerBillingAgreementId(id: string): this {
    this.wasSellerBillingAgreementAttributesModified = true;
    this.sellerBillingAgreementAttributes.sellerBillingAgreementId = id;
    return this;
  }

  setStoreName(name: string): this {
    this.wasSellerBillingAgreementAttributesModified = true;
    this.sellerBillingAgreementAttributes.storeName = name;
    return this;
  }

  setCustomInformation(info: string): this {
    this.wasSellerBillingAgreementAttributesModified = true;
    this.sellerBillingAgreementAttributes.customInformation = info;
    return this;
  }

  build(): SetupPayload {
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

// only extract optional attributes into their own interface
export interface ChargePayload {
  '@type': 'ChargeAmazonPayRequest';
  '@version': '2';
  'billingAgreementId': string;
  'paymentAction': PaymentActions;
  'sellerId': string;
  'authorizeAttributes': {
    '@type': 'AuthorizeAttributes';
    '@version': '2';
    'authorizationReferenceId': string; // only (a-z)(A-Z)(0-9)(-)(_) allowed
    'authorizationAmount': {
      '@type': 'Price';
      '@version': '2';
      'amount': string; // min: 0.01, max: 150,000.00
      'currencyCode': CurrencyCodes;
    };
    'sellerAuthorizationNote'?: string; // max 255 char.
    'softDescriptor'?: string; // max 16 char.
    'transactionTimeout'?: string;
  };
  'sellerOrderAttributes'?: SellerOrderAttributes;
}

export interface SellerOrderAttributes {
  '@type': 'SellerOrderAttributes';
  '@version': '2';
  'sellerOrderId'?: string; // only (a-z)(A-Z)(0-9)(-)(_) allowed
  'storeName'?: string;
  'customInformation'?: string; // max 1024 char.
  'sellerNote'?: string; //max 1024 char.
}

export type PaymentActions = 'Authorize' | 'AuthorizeAndCapture';

// No interface for ChargeResponsePayload because it's different for every region (DE, JP, UK, US).

export class ChargePayloadBuilder {
  private wasSellerOrderAttributesModified = false;

  payload: ChargePayload = {
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

  sellerOrderAttributes: SellerOrderAttributes = {
    '@type': 'SellerOrderAttributes',
    '@version': '2',
  };

  setBillingAgreementId(id: string): this {
    this.payload.billingAgreementId = id;
    return this;
  }

  setPaymentAction(action: PaymentActions): this {
    this.payload.paymentAction = action;
    return this;
  }

  setSellerId(id: string): this {
    this.payload.sellerId = id;
    return this;
  }

  setAuthorizationReferenceId(id: string): this {
    this.payload.authorizeAttributes.authorizationReferenceId = id;
    return this;
  }

  setAuthorizationAmount(amount: string): this {
    this.payload.authorizeAttributes.authorizationAmount.amount = amount;
    return this;
  }

  setAuthorizationCurrencyCode(code: CurrencyCodes): this {
    this.payload.authorizeAttributes.authorizationAmount.currencyCode = code;
    return this;
  }

  setSellerAuthorizationNote(note: string): this {
    this.payload.authorizeAttributes.sellerAuthorizationNote = note;
    return this;
  }

  setSoftDescriptor(description: string): this {
    this.payload.authorizeAttributes.softDescriptor = description;
    return this;
  }

  setTransactionTimeout(timeout: string): this {
    this.payload.authorizeAttributes.transactionTimeout = timeout;
    return this;
  }

  setSellerOrderId(id: string): this {
    this.wasSellerOrderAttributesModified = true;
    this.sellerOrderAttributes.sellerOrderId = id;
    return this;
  }

  setStoreName(name: string): this {
    this.wasSellerOrderAttributesModified = true;
    this.sellerOrderAttributes.storeName = name;
    return this;
  }

  setCustomInformation(info: string): this {
    this.wasSellerOrderAttributesModified = true;
    this.sellerOrderAttributes.customInformation = info;
    return this;
  }

  setSellerNote(note: string): this {
    this.wasSellerOrderAttributesModified = true;
    this.sellerOrderAttributes.sellerNote = note;
    return this;
  }

  build(): ChargePayload {
    if (this.wasSellerOrderAttributesModified) {
      this.payload.sellerOrderAttributes = this.sellerOrderAttributes;
    }

    return this.payload;
  }
}
