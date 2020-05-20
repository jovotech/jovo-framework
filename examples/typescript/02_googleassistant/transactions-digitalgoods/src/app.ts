import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App({ logging: true });

app.use(
	new GoogleAssistant({
		transactions: {
		    androidPackageName: 'tech.jovo.transactionsdemo',
		    keyFile: require('./../transactionsdemo-yxcogf-4a7d51565d40.json')
		}
	}),
	new JovoDebugger(),
	new FileDb()
);

app.setHandler({
	LAUNCH() {
		return this.toIntent('CheckRequirementsGooglePay');
	},

	CheckRequirementsGooglePay() {
		this.$googleAction!.$transaction!.checkDigitalPurchaseRequirements();
		this.ask('Check?');
	},

	GetDeliveryAddressIntent() {
		this.$googleAction!.$transaction!.askForDeliveryAddress(
			'I need your address'
		);
	},
	ON_TRANSACTION: {

		async DIGITAL_PURCHASE_CHECK() {
			console.log('IN DIGITAL PURCHASE CHECK');
			// Check Requirements Check status
			console.log('CAN PURCHASE ', this.$googleAction!.$transaction!.canPurchase());
			if (this.$googleAction!.$transaction!.canPurchase()) {
				try {
					// let id = 'qotd_member';
					const id = 'annual.subs';

					const result = await this.$googleAction!.$transaction!.getSubscriptions([id]);
					console.log('RESULT IS', result);
					this.$googleAction!.$transaction!.completePurchase({
						skuType: 'SKU_TYPE_SUBSCRIPTION',
						id,
						packageName: 'tech.jovo.transactionsdemo',
					});
				} catch (e) {
					console.log(e);
				}
			}
		},

		// async DIGITAL_PURCHASE_CHECK() {
		// 	if (this.$googleAction!.$transaction!.canPurchase()) {
		// 		try {
		//
		// 			const id = 'annual.subs';
		// 			const result = await this.$googleAction!.$transaction!.getSubscriptions([id]);
		//
		// 			this.$googleAction!.$transaction!.completePurchase({
		// 				skuType: 'SKU_TYPE_SUBSCRIPTION',
		// 				id,
		// 				packageName: 'tech.jovo.transactionsdemo',
		// 			});
		// 		} catch(e) {
		// 			console.log(e);
		// 		}
		// 	}
		// },
		ON_COMPLETE_PURCHASE() {
				const purchaseStatus = this.$googleAction!.$transaction!.getPurchaseStatus();

				this.ask('Okay');
		},
	}
});

function uniqueId() {
	return Math.random()
		.toString(36)
		.substr(2, 9);
}

export { app };
