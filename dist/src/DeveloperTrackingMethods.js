"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeveloperTrackingMethods {
    constructor(googleAnalytics, jovo) {
        this.globalGARef = googleAnalytics;
        this.jovo = jovo;
    }
    sendEvent(eventParameters) {
        this.globalGARef.sendEvent(this.jovo, eventParameters);
    }
    sendTransaction(transactionParams) {
        this.globalGARef.sendTransaction(this.jovo, transactionParams);
    }
    sendItem(itemParams) {
        this.globalGARef.sendItem(this.jovo, itemParams);
    }
    sendUserTransaction(transactionId) {
        this.globalGARef.sendUserTransaction(this.jovo, transactionId);
    }
    sendCustomMetric(indexInGA, value) {
        this.globalGARef.sendCustomMetric(this.jovo, indexInGA, value);
    }
    /**
    * User Events ties users to event category and action
    * @param eventName maps to category -> eventGroup
    * @param eventElement maps to action -> instance of eventGroup
    */
    sendUserEvent(eventCategory, eventElement = "defaultItem") {
        if (this.jovo) {
            const visitor = this.initVisitor();
            if (visitor) {
                const eventParams = {
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
    getUserId() {
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
    initVisitor() {
        return this.globalGARef.initVisitor(this.jovo);
    }
}
exports.DeveloperTrackingMethods = DeveloperTrackingMethods;
//# sourceMappingURL=DeveloperTrackingMethods.js.map