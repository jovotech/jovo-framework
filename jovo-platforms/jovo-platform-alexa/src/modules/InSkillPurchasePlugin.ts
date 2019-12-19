import { Plugin, AxiosRequestConfig, HttpService } from 'jovo-core';
import { Alexa } from '../Alexa';
import _get = require('lodash.get');
import _set = require('lodash.set');

import { AlexaRequest } from '../core/AlexaRequest';
import { AlexaSkill } from '../core/AlexaSkill';
import { EnumAlexaRequestType } from '../core/alexa-enums';
import { AlexaResponse } from '../index';

export class InSkillPurchase {
  alexaSkill: AlexaSkill;

  constructor(alexaSkill: AlexaSkill) {
    this.alexaSkill = alexaSkill;
  }

  /**
   * Verifies if user's account is valid for en-US ISP feature
   * @return {boolean}
   */
  isIspAllowed() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;

    const ALLOWED_ISP_ENDPOINTS: { [key: string]: string } = {
      'en-US': 'https://api.amazonalexa.com',
    };
    const locale = alexaRequest.getLocale();
    const endpoint = _get(
      alexaRequest,
      'context.System.apiEndpoint',
      'https://api.amazonalexa.com',
    );

    return ALLOWED_ISP_ENDPOINTS[locale] === endpoint;
  }

  /**
   * Sends buy request
   * @param {string} productId your product id in the format amzn1.adg.product
   * @param {string} token
   */
  buy(productId: string, token: string) {
    const payload = {
      InSkillProduct: {
        productId,
      },
    };
    _set(this.alexaSkill.$output, 'Alexa.Isp', new IspBuyDirective(token, payload));
  }

  /**
   * Sends upsell request
   * @param {string} productId
   * @param {string} upsellMessage
   * @param {string} token
   */
  upsell(productId: string, upsellMessage: string, token: string) {
    const payload = {
      InSkillProduct: {
        productId,
      },
      upsellMessage,
    };
    _set(this.alexaSkill.$output, 'Alexa.Isp', new IspUpsellDirective(token, payload));
  }

  /**
   * Sends cancel request
   * @param {string} productId
   * @param {string} token
   */
  cancel(productId: string, token: string) {
    const payload = {
      InSkillProduct: {
        productId,
      },
    };
    _set(this.alexaSkill.$output, 'Alexa.Isp', new IspCancelDirective(token, payload));
  }

  /**
   * Returns purchase request payload
   * @return {*}
   */
  getPayload() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;
    return _get(alexaRequest, 'request.payload');
  }

  /**
   * Returns purchase result
   * @return {*}
   */
  getPurchaseResult() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;
    return _get(alexaRequest, 'request.payload.purchaseResult');
  }

  /**
   * Returns purchase product id
   * @return {*}
   */
  getProductId() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;
    return _get(alexaRequest, 'request.payload.productId');
  }

  /**
   * Calls buy after retrieving product id
   * @param {string} referenceName
   * @param {string} token
   */
  async buyByReferenceName(referenceName: string, token: string) {
    return this.getProductByReferenceName(referenceName).then((product) =>
      this.buy(product.productId, token),
    );
  }

  /**
   * Calls buy after retrieving product id
   * @param {string} referenceName
   * @param {string} upsellMessage
   * @param {string} token
   */
  upsellByReferenceName(referenceName: string, upsellMessage: string, token: string) {
    return this.getProductByReferenceName(referenceName).then((product) =>
      this.upsell(product.productId, upsellMessage, token),
    );
  }

  /**
   * Calls cancel after retrieving product id
   * @param {string} referenceName
   * @param {string} token
   */
  cancelByReferenceName(referenceName: string, token: string) {
    return this.getProductByReferenceName(referenceName).then((product) =>
      this.cancel(product.productId, token),
    );
  }

  /**
   * Returns product by reference name
   * @param {string} referenceName
   */
  async getProductByReferenceName(referenceName: string) {
    // tslint:disable-next-line
    return this.getProductList().then((result: any) => {
      for (const item of result.inSkillProducts) {
        if (item.referenceName === referenceName) {
          return Promise.resolve(item);
        }
      }
      return Promise.resolve(undefined);
    });
  }

  /**
   * Returns productlist
   * @param {function} callback
   */
  async getProductList() {
    const alexaRequest = this.alexaSkill.$request as AlexaRequest;

    const hostName = _get(
      alexaRequest,
      'context.System.apiEndpoint',
      'https://api.amazonalexa.com',
    ).substr(8);
    const path = '/v1/users/~current/skills/~current/inSkillProducts';
    const url = `https://${hostName}${path}`;

    const config: AxiosRequestConfig = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': alexaRequest.getLocale(),
        'Authorization': `Bearer ${alexaRequest.getApiAccessToken()}`,
      },
    };

    const response = await HttpService.request(config);
    return response.data;
  }
}

export class InSkillPurchasePlugin implements Plugin {
  install(alexa: Alexa) {
    alexa.middleware('$type')!.use(this.type.bind(this));
    alexa.middleware('$output')!.use(this.output.bind(this));
    AlexaSkill.prototype.$inSkillPurchase = undefined;
    AlexaSkill.prototype.inSkillPurchase = function() {
      return new InSkillPurchase(this);
    };
  }
  uninstall(alexa: Alexa) {}
  type(alexaSkill: AlexaSkill) {
    const alexaRequest = alexaSkill.$request as AlexaRequest;
    const responseNames = ['Upsell', 'Buy', 'Cancel', 'Setup', 'Charge'];
    if (
      _get(alexaRequest, 'request.type') === 'Connections.Response' &&
      responseNames.includes(_get(alexaRequest, 'request.name'))
    ) {
      alexaSkill.$type = {
        type: EnumAlexaRequestType.ON_PURCHASE,
      };
    }
    alexaSkill.$inSkillPurchase = new InSkillPurchase(alexaSkill);
  }

  output(alexaSkill: AlexaSkill) {
    const output = alexaSkill.$output;
    if (!alexaSkill.$response) {
      alexaSkill.$response = new AlexaResponse();
    }
    if (_get(output, 'Alexa.Isp')) {
      let directives = _get(alexaSkill.$response, 'response.directives', []);

      if (Array.isArray(_get(output, 'Alexa.Isp'))) {
        directives = directives.concat(_get(output, 'Alexa.Isp'));
      } else {
        directives.push(_get(output, 'Alexa.Isp'));
      }
      _set(alexaSkill.$response, 'response.directives', directives);
    }
  }
}

interface Payload {
  InSkillProduct: {
    productId: string;
  };
  upsellMessage?: string;
}

abstract class IspDirective {
  type: string;
  name: string;
  token: string;
  payload: Payload;

  constructor(type: string, name: string, token: string, payload: Payload) {
    this.type = type;
    this.name = name;
    this.token = token;
    this.payload = payload;
  }
}

class IspBuyDirective extends IspDirective {
  constructor(token: string, payload: Payload) {
    super('Connections.SendRequest', 'Buy', token, payload);
  }
}

class IspUpsellDirective extends IspDirective {
  constructor(token: string, payload: Payload) {
    super('Connections.SendRequest', 'Upsell', token, payload);
  }
}

class IspCancelDirective extends IspDirective {
  constructor(token: string, payload: Payload) {
    super('Connections.SendRequest', 'Cancel', token, payload);
  }
}
