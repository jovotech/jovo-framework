import { App, Jovo } from 'jovo-framework';

import {
	GoogleAssistant,
	PaymentParameters,
	TransactionDecisionType,
} from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App();

app.use(
	new GoogleAssistant({
		transactions: {
			androidPackageName: 'com.package.demo',
			keyFile: require('./service-account.json'),
		},
	}),
	new JovoDebugger(),
	new FileDb()
);

app.setHandler({
	LAUNCH() {
		return this.toIntent('TransactionDigitalPurchaseRequirementsIntent');
	},

	TransactionDigitalPurchaseRequirementsIntent() {
		this.$googleAction!.$transaction!.checkDigitalPurchaseRequirements();
		this.$googleAction!.setNextScene('TransactionDigitalPurchaseCheck');
	},

	TransactionCheckRequirementsIntent() {
		this.$googleAction!.setNextScene('TransactionRequirementsCheck');
	},

	TransactionDeliveryAddressIntent() {
		this.$googleAction!.$transaction!.askForDeliveryAddress(
			'To know where to send the order'
		);
		this.$googleAction!.setNextScene('TransactionDeliveryAddress');
	},

	ON_TRANSACTION: {
		TRANSACTION_DECISION() {
			//
		},
		async DIGITAL_PURCHASE_CHECK() {
			if (this.$googleAction!.$transaction!.canPurchase()) {
			} else {
				// this.tell(`You can't use digital purchasing.`);
			}

			const skus = await this.$googleAction!.$transaction!.getSkus(
				['testproduct1337'],
				'SKU_TYPE_IN_APP'
			);

			if (skus.length > 0) {
				this.$session.$data.skuId = skus[0].skuId;
				this.ask(`Do you want to buy ${skus[0].title}?`);
			}
		},
	},

	YesIntent() {
		this.$googleAction!.$transaction!.completePurchase(
			this.$session.$data.skuId
		);

		this.$googleAction!.setNextScene('TransactionCompletePurchase');
	},
});
function uniqueId() {
	return Math.random().toString(36).substr(2, 9);
}
export { app };
