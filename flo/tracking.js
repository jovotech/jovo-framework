
const config = require('./../config/config');

const googleAnalytics = require('universal-analytics');
// const murmurhash = require('murmurhash');

module.exports = {
    defaultEventAndState: function(jovo) {
        const visitor = initializeVisitor(jovo);
        const path = jovo.user().data.startState || '/';
        visitor
            .screenview(
                // path,
                // jovo.getLocale(),
                // jovo.user().data.purchase.entitled ? 'premium' : 'base'
                {
                    cd: path,
                    an: 'Kids Court',
                    av: jovo.user().data.purchase.entitled ? 'premium' : 'base',
                    ul: jovo.getLocale(),
                    sr: jovo.user().data.viewport || 'none'
                }
            )
            .event(
                {
                    ec: 'response',
                    ea: jovo.user().data.requestName,
                    el: jovo.user().data.requestDetail,
                    p: path,
                }
            )
            .send();
    },

    chooseModeEvent: function(jovo, flag = 'default') {
        const visitor = initializeVisitor(jovo);
        visitor.event(
            {
                ec: 'modeChoice',
                ea: jovo.user().data.requestName,
                el: jovo.user().data.requestDetail,
                ev: flag === 'premiumChoice' ? 1 : 0,
                p: jovo.user().data.startState,
            }
        );

        if (flag === 'offerPurchase') {
            visitor.event(
                {
                    ec: 'purchaseFlow',
                    ea: jovo.user().data.requestName,
                    el: jovo.user().data.startState,
                    ev: flag === 0,
                    p: jovo.user().data.startState,
                }
            )
        }

        visitor.send();
    },

    productNotPurchasableException: function(jovo) {
        const visitor = initializeVisitor(jovo);
        visitor
            .exception(
                'product not purchasable',
                false
            )
            .send();
    },

    sessionEndedException: function(jovo, errorString) {
        const visitor = initializeVisitor(jovo);
        visitor
            .exception(
                errorString,
                true
            )
            .send();
    },

    // TODO: Add this event to the entire purchase flow!
    purchaseFlowEvent: function(jovo) {
        const visitor = initializeVisitor(jovo);
        visitor.event(
            {
                ec: 'purchaseFlow',
                ea: jovo.user().data.requestName,
                el: jovo.user().data.startState,
                p: jovo.user().data.startState,
            }
        ).send();
    },

    completeRoundIntent: function(jovo, label, count) {
        const visitor = initializeVisitor(jovo);
        visitor.event(
            {
                ec: 'completeRound',
                ea: jovo.user().data.requestName,
                el: label,
                ev: count || 0,
                p: jovo.user().data.startState,
            }
        ).send();
    },

    unhandledEvent: function(jovo) {
        let extraInfo = {
            "state": jovo.getSessionAttribute('STATE'),
        };
        return getTrackingPromise(
            jovo,
            'Unhandled / help request',
            extraInfo
        );
    },

    endSessionEvent: function(jovo, extraInfo) {
        return getTrackingPromise(
            jovo,
            'Ending session',
            extraInfo
        );
    },
};

function initializeVisitor(jovo) {
    return googleAnalytics(
        config.tracking.googleAnalyticsKey,
        jovo.user().data.nickname,
        {
            strictCidFormat: false,
        }
    );
}
