import { Plugin } from 'jovo-core';
import { Alexa } from '../Alexa';
import { AlexaSkill } from '../core/AlexaSkill';
export declare class InSkillPurchase {
    alexaSkill: AlexaSkill;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Verifies if user's account is valid for en-US ISP feature
     * @return {boolean}
     */
    isIspAllowed(): boolean;
    /**
     * Sends buy request
     * @param {string} productId your product id in the format amzn1.adg.product
     * @param {string} token
     */
    buy(productId: string, token: string): void;
    /**
     * Sends upsell request
     * @param {string} productId
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsell(productId: string, upsellMessage: string, token: string): void;
    /**
     * Sends cancel request
     * @param {string} productId
     * @param {string} token
     */
    cancel(productId: string, token: string): void;
    /**
     * Returns purchase request payload
     * @return {*}
     */
    getPayload(): any;
    /**
     * Returns purchase result
     * @return {*}
     */
    getPurchaseResult(): any;
    /**
     * Returns purchase product id
     * @return {*}
     */
    getProductId(): any;
    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    buyByReferenceName(referenceName: string, token: string): Promise<void>;
    /**
     * Calls buy after retrieving product id
     * @param {string} referenceName
     * @param {string} upsellMessage
     * @param {string} token
     */
    upsellByReferenceName(referenceName: string, upsellMessage: string, token: string): Promise<void>;
    /**
     * Calls cancel after retrieving product id
     * @param {string} referenceName
     * @param {string} token
     */
    cancelByReferenceName(referenceName: string, token: string): Promise<void>;
    /**
     * Returns product by reference name
     * @param {string} referenceName
     */
    getProductByReferenceName(referenceName: string): Promise<any>;
    /**
     * Returns productlist
     * @param {function} callback
     */
    getProductList(): Promise<any>;
}
export declare class InSkillPurchasePlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
