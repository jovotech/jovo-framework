import {Plugin, JovoError, ErrorCode} from "jovo-core";

import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";
import {GoogleActionAPI} from "../services/GoogleActionAPI";
import {GoogleActionAPIResponse} from "../services/GoogleActionAPIResponse";

export enum SkuType {
  SKU_TYPE_IN_APP = 'SKU_TYPE_IN_APP',
  SKU_TYPE_SUBSCRIPTION = 'SKU_TYPE_SUBSCRIPTION'
}

export enum PurchaseStatus {
  PURCHASE_STATUS_OK = 'PURCHASE_STATUS_OK',
  PURCHASE_STATUS_ITEM_CHANGE_REQUESTED = 'PURCHASE_STATUS_ITEM_CHANGE_REQUESTED',
  PURCHASE_STATUS_USER_CANCELLED = 'PURCHASE_STATUS_USER_CANCELLED',
  PURCHASE_STATUS_ERROR = 'PURCHASE_STATUS_ERROR',
  PURCHASE_STATUS_UNSPECIFIED = 'PURCHASE_STATUS_UNSPECIFIED'
}

export class DigitalGoods {
  googleAction: GoogleAction;
  googleAssistant: GoogleAssistant;

  constructor(googleAction: GoogleAction, googleAssistant: GoogleAssistant) {
    this.googleAction = googleAction;
    this.googleAssistant = googleAssistant;
  }

  getSubscriptions(skus: string[]): Promise<any[]> { // tslint:disable-line
    return this.getSkus(skus, SkuType.SKU_TYPE_SUBSCRIPTION);
  }

  getConsumables(skus: string[]): Promise<any[]> { // tslint:disable-line
    return this.getSkus(skus, SkuType.SKU_TYPE_IN_APP);
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

    if (!this.googleAssistant.config.transactions || !this.googleAssistant.config.transactions.androidAppID) {
        throw new JovoError(
            'getSkus needs the Android App package id',
            ErrorCode.ERR,
            'jovo-platform-googleassistant'
        );
    }

    const promise = this.getGoogleApiAccessToken()
      .then((accessToken: string) => {
        return GoogleActionAPI.apiCall({
          endpoint: 'https://actions.googleapis.com',
          path: `/v3/packages/${this.googleAssistant.config.transactions!.androidAppID}/skus:batchGet`,
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

          return googleapis.google.auth.getClient({
              keyFile: this.googleAssistant.config.transactions!.keyFile,
              scopes: [ 'https://www.googleapis.com/auth/actions.purchases.digital' ]
          })
              .then((client: any) => client.authorize()) // tslint:disable-line
              .then((authorization: any) => authorization.access_token as string); // tslint:disable-line

      } catch (e) {

          if (e.message === 'Cannot find module \'googleapis\'') {
              Promise.reject(new JovoError(
                  e.message,
                  ErrorCode.ERR,
                  'jovo-platform-googleassistant',
                  undefined,
                  'Please run `npm install googleapis`'
              ));
          }
      }
      return Promise.reject(new Error('Could not retrieve Google API access token'));
  }
}

export class DigitalGoodsPlugin implements Plugin {
  googleAssistant?: GoogleAssistant;

  install(googleAssistant: GoogleAssistant) {
    googleAssistant.middleware('$type')!.use(this.type.bind(this));
    googleAssistant.middleware('$output')!.use(this.output.bind(this));
    this.googleAssistant = googleAssistant;

    GoogleAction.prototype.$digitalGoods = undefined;
  }

  type(googleAction: GoogleAction) {
    const intentName = _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent');

    if (intentName === 'actions.intent.COMPLETE_PURCHASE') {
      _set(googleAction.$type, 'type', 'ON_COMPLETE_PURCHASE');
    }

    googleAction.$digitalGoods = new DigitalGoods(googleAction, this.googleAssistant!);
  }

  output(googleAction: GoogleAction) {
    if (!googleAction.$response) {
      googleAction.$response = new GoogleActionResponse();
    }

    const output = googleAction.$output;

    const completePurchase = _get(output, "GoogleAssistant.CompletePurchase");

    if (completePurchase) {
        _set(googleAction.$response, "expectUserResponse", true);
        _set(googleAction.$response, "systemIntent", {
          intent: "actions.intent.COMPLETE_PURCHASE",
          inputValueData: {
              "@type": "type.googleapis.com/google.actions.transactions.v3.CompletePurchaseValueSpec",
              skuId: completePurchase.skuId
          },
        });
        _set(googleAction.$response, 'inputPrompt', {
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
