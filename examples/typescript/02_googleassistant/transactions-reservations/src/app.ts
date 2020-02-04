
import { App } from 'jovo-framework';


import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import reservation from './reservation';
import { ReservationUpdate } from 'jovo-platform-googleassistant/dist/src/core/Interfaces';
console.log('Transactions demo');

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
        return this.toIntent('TransactionCheckRequirementsIntent');
    },

    TransactionCheckRequirementsIntent() {
        this.$googleAction!.$transaction!.checkRequirements();
        this.ask('Check?');
    },
    ON_TRANSACTION: {
        TRANSACTION_REQUIREMENTS_CHECK() {

            if (this.$googleAction!.$transaction!.canTransact()) {
                reservation.merchantOrderId = uniqueId();
                this.$session.$data.merchantOrderId = reservation.merchantOrderId;
                this.$googleAction!.$transaction!.buildReservation(reservation);
                return this.ask('OK');
            }

            this.tell('Transactions are not possible with your account.');

        },
        TRANSACTION_DECISION() {

            if (this.$googleAction!.$transaction!.isReservationAccepted()) {

                const reservation = this.$googleAction!.$transaction!.getReservation() as any;

                reservation!.lastUpdateTime = new Date().toISOString();
                reservation!.contents!.lineItems[0].reservation!.status = 'CONFIRMED';
                reservation!.contents!.lineItems[0].reservation!.userVisibleStatusLabel = 'Reservation confirmed';
                reservation!.contents!.lineItems[0].reservation!.confirmationCode = '123ABCDEFGXYZ';

                reservation!.lastUpdateTime = new Date().toISOString();

               // @ts-ignore
               this.$googleAction!.$transaction!.updateReservation(reservation, 'Reason string');
               this.ask('Order confirmed');

            }

        }

    },
});


function uniqueId () {
    return Math.random().toString(36).substr(2, 9);
}




export {app};
