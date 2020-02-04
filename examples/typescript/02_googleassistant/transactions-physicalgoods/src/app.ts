
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import order from './order';

const app = new App({logging: true});

const UNIQUE_MERCHANT_ORDER_ID = 'MerchantOrderId1';

app.use(
    new GoogleAssistant({
        // transactions: {
        //     androidPackageName: 'com.example.app',
        //     keyFile: require('./keyfile.json')
        // }
    }),
    new JovoDebugger(),
    new FileDb(),
);


app.setHandler({
    LAUNCH() {
        return this.toIntent('CheckRequirementsGooglePay');
    },

    CheckRequirementsGooglePay() {
        this.$googleAction!.$transaction!.checkRequirements();
        this.ask('Check?');
    },

    GetDeliveryAddressIntent() {
        this.$googleAction!.$transaction!.askForDeliveryAddress('I need your address');
    },
    ON_TRANSACTION: {
        TRANSACTION_REQUIREMENTS_CHECK() {
            if (this.$googleAction!.$transaction!.canTransact()) {
                this.$googleAction!.showSuggestionChips(['get delivery address'])
                return this.ask(`You're good to go. Next I'll need your delivery address. Try saying "get delivery address".`);
            }
        },
        DELIVERY_ADDRESS() {
            if (this.$googleAction!.$transaction!.isDeliveryAddressAccepted()) {
                console.log();

                order.purchase.fulfillmentInfo.location = this.$googleAction!.$transaction!.getDeliveryAddress();
                order.merchantOrderId = uniqueId();
                order.userVisibleOrderId = order.merchantOrderId;
                this.$session.$data.merchantOrderId = order.merchantOrderId;
                const presentationOptions = {
                    actionDisplayName: 'PLACE_ORDER',
                };

                const orderOptions = {
                    userInfoOptions: {
                        userInfoProperties: [
                            'EMAIL',
                        ],
                    },
                };

                this.$googleAction!.$transaction!.buildOrder(order, presentationOptions, orderOptions);

                this.ask('Thank you! We have your address now.');
            } else if (this.$googleAction!.$transaction!.isDeliveryAddressRejected()) {
                this.tell('We need your address to proceed.');
            }
        },
        TRANSACTION_DECISION() {

            if (this.$googleAction!.$transaction!.isOrderAccepted()) {

               const order = this.$googleAction!.$transaction!.getOrder();
               order!.purchase!.status = 'CONFIRMED';
               order!.purchase!.userVisibleStatusLabel = 'Order confirmed';

                order!.lastUpdateTime = new Date().toISOString()


               this.$googleAction!.$transaction!.updateOrder(order!, 'Reason string');

               this.ask('Completed')
               console.log(this.$output);
            }

        }

    },
});


function uniqueId () {
    return Math.random().toString(36).substr(2, 9);
}




export {app};
