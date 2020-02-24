import { App } from 'jovo-framework';

import { GoogleAssistant } from 'jovo-platform-googleassistant';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';

const app = new App({ logging: true });

app.use(
	new GoogleAssistant({
		transactions: {
		    // androidPackageName: '',
		    // keyFile: require('keyfile.json')
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
			if (this.$googleAction!.$transaction!.canPurchase()) {
				try {

					const id = 'managedproduct1';

					const result = await this.$googleAction!.$transaction!.getConsumables([id]);

					this.$googleAction!.$transaction!.completePurchase({
						skuType: 'SKU_TYPE_IN_APP',
						id,
						packageName: '',
					});
				} catch(e) {
					console.log(e);
				}
			}
		},
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
