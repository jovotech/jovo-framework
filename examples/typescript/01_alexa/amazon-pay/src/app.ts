
import { App } from 'jovo-framework';


import { Alexa } from 'jovo-platform-alexa';
import { JovoDebugger } from 'jovo-plugin-debugger';


const app = new App();

app.use(
    new Alexa(),
    new JovoDebugger(),
);

app.setHandler({
    LAUNCH() {
        if (this.$alexaSkill!.isAmazonPayPermissionDenied()) {
            this.$alexaSkill!.showAskForAmazonPayPermissionCard();
        } else {
            return this.toIntent('GetBuyerId');
            // return this.toIntent('SetupDirective');
            // return this.toIntent('ChargeDirective');
            // return this.toIntent('GetBuyerAddress');
        }
    },

    SetupDirective() {
        const payload = this.$alexaSkill!.$pay!.createSetupPayload()
            .setSellerId('YOUR SELLER ID')
            .setCountryOfEstablishment('DE')
            .setLedgerCurrency('EUR')
            .setCheckoutLanguage('en_US')
            .setSellerBillingAgreementId('id')
            .setBillingAgreementType('CustomerInitiatedTransaction')
            .setSubscriptionAmount('19.99')
            .setSubscriptionCurrencyCode('EUR')
            .setStoreName('Test name')
            .setCustomInformation('custom info')
            .setNeedAmazonShippingAddress(true)
            .setSandboxMode(true)
            .setSandboxEmail('test@jovo.tech')
            .build();
        
        const directive = {
            type: 'Connections.SendRequest',
            name: 'Setup',
            token: 'token',
            payload,
        };

        return this.$alexaSkill!.addDirective(directive);
    },

    ChargeDirective() {
        const payload = this.$alexaSkill!.$pay!.createChargePayload()
            .setSellerId('YOUR SELLER ID')
            .setBillingAgreementId('billing id')
            .setPaymentAction('AuthorizeAndCapture')
            .setAuthorizationReferenceId('reference id')
            .setAuthorizationAmount('19.99')
            .setAuthorizationCurrencyCode('EUR')
            .setSoftDescriptor('description')
            .setTransactionTimeout('0')
            .setSellerAuthorizationNote('note')
            .setStoreName('name')
            .setCustomInformation('custom info')
            .setSellerNote('sellerNote')
            .setSellerOrderId('order id')
            .build()

        const directive = {
            type: 'Connections.SendRequest',
            name: 'Charge',
            token: 'token',
            payload,
        };

        return this.$alexaSkill!.addDirective(directive);
    },

    async GetBuyerId() {
        const response = await this.$alexaSkill!.$user.getBuyerId();
        console.log(response);

        return this.tell('Done!');
    },

    async GetBuyerAddress() {
        const options = {
            sellerId: 'YOUR SELLER ID',
            sandbox: true,
            sandBoxEmail: 'YOUR TEST ACCOUNT EMAILs'
        };

        const response = await this.$alexaSkill!.$user.getDefaultBuyerAddress(options);
        console.log(response);

        return this.tell('Done!');
    }
});


export {app};
