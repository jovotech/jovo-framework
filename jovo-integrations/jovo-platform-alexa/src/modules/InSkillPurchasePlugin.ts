import {Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";
import * as https from "https";
import * as _ from "lodash";
import {AlexaRequest} from "../core/AlexaRequest";
import {AlexaSkill} from "../core/AlexaSkill";
import {EnumAlexaRequestType} from "../core/alexa-enums";
import {AlexaResponse} from "..";


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

        const ALLOWED_ISP_ENDPOINTS: {[key: string]: string} = {
            'en-US': 'https://api.amazonalexa.com',
        };
        const locale = alexaRequest.getLocale();
        const endpoint = _.get(alexaRequest, 'context.System.apiEndpoint', 'https://api.amazonalexa.com');

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
                productId
            },
        };
        _.set(this.alexaSkill.$output, 'Alexa.Isp',
            new IspBuyDirective(token, payload)
        );
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
                productId
            },
            upsellMessage
        };
        _.set(this.alexaSkill.$output, 'Alexa.Isp',
            new IspUpsellDirective(token, payload)
        );
    }

    /**
     * Sends cancel request
     * @param {string} productId
     * @param {string} token
     */
    cancel(productId: string, token: string) {
        const payload = {
            InSkillProduct: {
                productId
            }
        };
        _.set(this.alexaSkill.$output, 'Alexa.Isp',
            new IspCancelDirective(token, payload)
        );
    }

    /**
     * Returns purchase request payload
     * @return {*}
     */
    getPayload() {
        const alexaRequest = this.alexaSkill.$request as AlexaRequest;
        return _.get(alexaRequest, 'request.payload');
    }

    /**
     * Returns purchase result
     * @return {*}
     */
    getPurchaseResult() {
        const alexaRequest = this.alexaSkill.$request as AlexaRequest;
        return _.get(alexaRequest, 'request.payload.purchaseResult');
    }

    /**
     * Returns purchase product id
     * @return {*}
     */
    getProductId() {
        const alexaRequest = this.alexaSkill.$request as AlexaRequest;
        return _.get(alexaRequest, 'request.payload.productId');
    }

    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    async buyByReferenceName(referenceName: string, token: string) {

        return this.getProductByReferenceName(referenceName)
            .then((product) => this.buy(product.productId, token));
    }

    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsellByReferenceName(referenceName: string, upsellMessage: string, token: string) {
        return this.getProductByReferenceName(referenceName)
            .then((product) => this.upsell(product.productId, upsellMessage, token));

    }

    /**
     * Calls cancel after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    cancelByReferenceName(referenceName: string, token: string) {
        return this.getProductByReferenceName(referenceName)
            .then((product) => this.cancel(product.productId, token));
    }

    /**
     * Returns product by reference name
     * @param {string} referenceName
     */
    async getProductByReferenceName(referenceName: string) {
        return this.getProductList().then((result: any) => { // tslint:disable-line
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
    getProductList() {
        const alexaRequest = this.alexaSkill.$request as AlexaRequest;

        return new Promise((resolve, reject) => {
            const options = {
                hostname: _.get(alexaRequest, 'context.System.apiEndpoint', 'https://api.amazonalexa.com').substr(8),
                port: 443,
                path: '/v1/users/~current/skills/~current/inSkillProducts',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': alexaRequest.getLocale(),
                    'Authorization': 'Bearer ' + alexaRequest.getApiAccessToken(),
                },
            };
            let rawData = '';

            const req = https.get(options, (res) => {
                res.setEncoding('utf8');

                if (res.statusCode !== 200) {
                    return reject(new Error('Something went wrong'));
                }

                res.on('data', (chunk) => {
                    rawData += chunk;
                });

                res.on('end', () => {
                    try {
                        return resolve(JSON.parse(rawData));
                    } catch (error) {
                        return reject(error);
                    }
                });
            });

            req.on('error', (e) => {
                return reject(e);
            });
        });

    }
}

export class InSkillPurchasePlugin implements Plugin {


    install(alexa: Alexa) {

        alexa.middleware('$type')!.use(this.type.bind(this));
        alexa.middleware('$out')!.use(this.output.bind(this));
        AlexaSkill.prototype.$inSkillPurchase = undefined;
        AlexaSkill.prototype.inSkillPurchase = function() {
            return new InSkillPurchase(this);
        };
    }
    uninstall(alexa: Alexa) {
    }

    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        alexaSkill.$inSkillPurchase = new InSkillPurchase(alexaSkill);

        if (_.get(alexaRequest, 'request.type') === 'Connections.Response') {
            alexaSkill.$type = {
                type: EnumAlexaRequestType.ON_PURCHASE,
            };
        }
    }

    output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;
        if (!alexaSkill.$response) {
            alexaSkill.$response = new AlexaResponse();
        }
        if (_.get(output, 'Alexa.Isp')) {
            _.set(alexaSkill.$response, 'response.directives',
                [_.get(output, 'Alexa.Isp')]
            );
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
