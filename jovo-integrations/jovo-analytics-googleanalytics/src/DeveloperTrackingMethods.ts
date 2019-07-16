import { GoogleAnalyticsSender } from "./GoogleAnalyticsSender";
import {Jovo} from 'jovo-core';
import { AlexaRequest } from 'jovo-platform-alexa';
import _get = require('lodash.get');



import * as ua from 'universal-analytics';
import * as util from 'util';
import * as murmurhash from 'murmurhash';
import {EventParameters, ItemParams, TransactionParams} from './GoogleAnalyticsSender'



export class DeveloperTrackingMethods   {
    globalGARef : GoogleAnalyticsSender;
    jovo : Jovo;


    constructor (googleAnalytics : GoogleAnalyticsSender, jovo : Jovo) {
        this.globalGARef = googleAnalytics;
        this.jovo = jovo;

    }

    sendEvent(eventParameters: EventParameters) {
       this.globalGARef.sendEvent(this.jovo, eventParameters);
    }

    sendTransaction(transactionParams: TransactionParams) {
        this.globalGARef.sendTransaction(this.jovo, transactionParams);
    }

    sendItem(itemParams : ItemParams)   {
        this.globalGARef.sendItem(this.jovo, itemParams);
    }


    sendUserTransaction(transactionId: string)    {
       this.globalGARef.sendUserTransaction(this.jovo, transactionId);
    }


    sendCustomMetric(indexInGA : number, value : string)    {
        this.globalGARef.sendCustomMetric(this.jovo, indexInGA, value);
    }

     /**
     * User Events ties users to event category and action
     * @param eventName maps to category -> eventGroup
     * @param eventElement maps to action -> instance of eventGroup
     */
    sendUserEvent(eventCategory: string, eventElement = "defaultItem") {

        if (this.jovo) {
            const visitor = this.initVisitor();
            if (visitor) {

                const eventParams: EventParameters = {
                    eventCategory: eventCategory,
                    eventAction: eventElement,
                    eventLabel: this.getUserId(),
                    documentPath: this.getPageName()
                };
                this.globalGARef.sendIntentEvent(visitor, eventParams);
            }
            else {
                console.error("Missing Google Analytics visitor. Is: " + visitor);
            }
        }
        else {
            this.globalGARef.throwJovoNotSetError();
        }
    }


    /**
     * Generates Hash for User Id
     */
    getUserId(): string {
        return this.globalGARef.getUserId(this.jovo);
    }

    /**
     * Generates pageName from State and Intent Name
     * @param jovo 
     */
    getPageName() {
        return this.globalGARef.getPageName(this.jovo);
    }

    /**
     * Visitor initiation which sets needed fixed parameters
     * @param jovo
     */
    initVisitor(): ua.Visitor | undefined {
        return this.globalGARef.initVisitor(this.jovo);
    }


}