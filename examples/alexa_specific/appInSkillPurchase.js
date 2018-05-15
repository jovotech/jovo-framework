'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================
app.setHandler({

    'LAUNCH': function() {
        this.ask('What\'s next?', 'What\'s next?');
    },
    'BuySkillItemIntent': function() {
        let productRefName = this.getInput('ProductName').id;
        this.alexaSkill()
            .inSkillPurchase()
            .getProductByReferenceName(productRefName, (error, product) => {
            if (product.entitled === 'ENTITLED') {
                this.tell('You own it already');
                return;
            }

            this.alexaSkill().inSkillPurchase().buy(product.productId);
        });
    },
    'RefundSkillItemIntent': function() {
        let productRefName = this.getInput('ProductName').id;
        this.alexaSkill()
            .inSkillPurchase()
            .getProductByReferenceName(productRefName, (error, product) => {
                if (product.entitled !== 'ENTITLED') {
                    this.tell('You don\'t own it.');
                } else {
                    this.alexaSkill().inSkillPurchase().cancel(product.productId);
                }
            });
    },
    'ON_PURCHASE': function() {
            this.tell(this.alexaSkill().inSkillPurchase().getPurchaseResult());
    },
});

module.exports.app = app;

