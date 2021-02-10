"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _set = require("lodash.set");
const AlexaSkill_1 = require("../core/AlexaSkill");
const alexa_enums_1 = require("../core/alexa-enums");
const index_1 = require("../index");
class InSkillPurchase {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
    }
    /**
     * Verifies if user's account is valid for en-US ISP feature
     * @return {boolean}
     */
    isIspAllowed() {
        const alexaRequest = this.alexaSkill.$request;
        const ALLOWED_ISP_ENDPOINTS = {
            'en-US': 'https://api.amazonalexa.com',
        };
        const locale = alexaRequest.getLocale();
        const endpoint = _get(alexaRequest, 'context.System.apiEndpoint', 'https://api.amazonalexa.com');
        return ALLOWED_ISP_ENDPOINTS[locale] === endpoint;
    }
    /**
     * Sends buy request
     * @param {string} productId your product id in the format amzn1.adg.product
     * @param {string} token
     */
    buy(productId, token) {
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
    upsell(productId, upsellMessage, token) {
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
    cancel(productId, token) {
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
        const alexaRequest = this.alexaSkill.$request;
        return _get(alexaRequest, 'request.payload');
    }
    /**
     * Returns purchase result
     * @return {*}
     */
    getPurchaseResult() {
        const alexaRequest = this.alexaSkill.$request;
        return _get(alexaRequest, 'request.payload.purchaseResult');
    }
    /**
     * Returns purchase product id
     * @return {*}
     */
    getProductId() {
        const alexaRequest = this.alexaSkill.$request;
        return _get(alexaRequest, 'request.payload.productId');
    }
    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    async buyByReferenceName(referenceName, token) {
        return this.getProductByReferenceName(referenceName).then((product) => this.buy(product.productId, token));
    }
    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsellByReferenceName(referenceName, upsellMessage, token) {
        return this.getProductByReferenceName(referenceName).then((product) => this.upsell(product.productId, upsellMessage, token));
    }
    /**
     * Calls cancel after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    cancelByReferenceName(referenceName, token) {
        return this.getProductByReferenceName(referenceName).then((product) => this.cancel(product.productId, token));
    }
    /**
     * Returns product by reference name
     * @param {string} referenceName
     */
    async getProductByReferenceName(referenceName) {
        // tslint:disable-next-line
        return this.getProductList().then((result) => {
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
        const alexaRequest = this.alexaSkill.$request;
        const hostName = _get(alexaRequest, 'context.System.apiEndpoint', 'https://api.amazonalexa.com').substr(8);
        const path = '/v1/users/~current/skills/~current/inSkillProducts';
        const url = `https://${hostName}${path}`;
        const config = {
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': alexaRequest.getLocale(),
                'Authorization': `Bearer ${alexaRequest.getApiAccessToken()}`,
            },
        };
        const response = await jovo_core_1.HttpService.request(config);
        return response.data;
    }
}
exports.InSkillPurchase = InSkillPurchase;
class InSkillPurchasePlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.$inSkillPurchase = undefined;
        AlexaSkill_1.AlexaSkill.prototype.inSkillPurchase = function () {
            return new InSkillPurchase(this);
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        const responseNames = ['Upsell', 'Buy', 'Cancel', 'Setup', 'Charge'];
        if (_get(alexaRequest, 'request.type') === 'Connections.Response' &&
            responseNames.includes(_get(alexaRequest, 'request.name'))) {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_PURCHASE,
            };
        }
        alexaSkill.$inSkillPurchase = new InSkillPurchase(alexaSkill);
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new index_1.AlexaResponse();
        }
        if (_get(output, 'Alexa.Isp')) {
            let directives = _get(alexaSkill.$response, 'response.directives', []);
            if (Array.isArray(_get(output, 'Alexa.Isp'))) {
                directives = directives.concat(_get(output, 'Alexa.Isp'));
            }
            else {
                directives.push(_get(output, 'Alexa.Isp'));
            }
            _set(alexaSkill.$response, 'response.directives', directives);
        }
    }
}
exports.InSkillPurchasePlugin = InSkillPurchasePlugin;
class IspDirective {
    constructor(type, name, token, payload) {
        this.type = type;
        this.name = name;
        this.token = token;
        this.payload = payload;
    }
}
class IspBuyDirective extends IspDirective {
    constructor(token, payload) {
        super('Connections.SendRequest', 'Buy', token, payload);
    }
}
class IspUpsellDirective extends IspDirective {
    constructor(token, payload) {
        super('Connections.SendRequest', 'Upsell', token, payload);
    }
}
class IspCancelDirective extends IspDirective {
    constructor(token, payload) {
        super('Connections.SendRequest', 'Cancel', token, payload);
    }
}
//# sourceMappingURL=InSkillPurchasePlugin.js.map