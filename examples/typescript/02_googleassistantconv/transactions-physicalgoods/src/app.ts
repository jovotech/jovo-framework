import { App, Jovo } from 'jovo-framework';

import {
	GoogleAssistant,
	PaymentParameters,
	TransactionDecisionType,
} from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import order from './order';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('TransactionDeliveryAddressIntent');
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

	// TransactionDecision() {
	// 	reservation.merchantOrderId = uniqueId();
	// 	reservation.userVisibleOrderId = reservation.merchantOrderId;
	// 	this.$googleAction!.$transaction!.buildReservation(
	// 		reservation,
	//
	// 		{
	// 			actionDisplayName: 'RESERVE',
	// 		},
	// 		{
	// 			requestDeliveryAddress: false,
	// 		}
	// 	);
	//
	// 	this.$googleAction!.setNextScene('TransactionDecision');
	// },

	ON_TRANSACTION: {
		DELIVERY_ADDRESS() {
			if (this.$googleAction!.$transaction!.isDeliveryAddressAccepted()) {
				const location = this.$googleAction!.$transaction!.getDeliveryAddress();

				// order.purchase!.fulfillmentInfo!.location = location;
				order.merchantOrderId = uniqueId();
				order.userVisibleOrderId = order.merchantOrderId;
				const presentationOptions = {
					actionDisplayName: 'PLACE_ORDER',
				};

				const orderOptions = {
					requestDeliveryAddress: true,
					userInfoOptions: {
						userInfoProperties: ['EMAIL'],
					},
				};

				const paymentParamenters: PaymentParameters = {
					merchantPaymentOption: {
						defaultMerchantPaymentMethodId: '12345678',
						managePaymentMethodUrl: 'https://example.com/managePayment',
						merchantPaymentMethod: [
							{
								paymentMethodDisplayInfo: {
									paymentMethodDisplayName: 'VISA **** 1234',
									paymentType: 'PAYMENT_CARD',
								},
								paymentMethodGroup: 'Payment method group',
								paymentMethodId: '12345678',
								paymentMethodStatus: {
									status: 'STATUS_OK',
									statusMessage: 'Status message',
								},
							},
						],
					},
				};

				this.$googleAction!.$transaction!.buildOrder(
					order,
					presentationOptions,
					orderOptions,
					paymentParamenters
				);
				this.$googleAction!.setNextScene('TransactionDecision');

				this.ask('Okay we have your address now.');
			}
		},
		TRANSACTION_DECISION() {
			if (this.$googleAction!.$transaction!.isOrderAccepted()) {
				const order = this.$googleAction!.$transaction!.getOrder();

				this.$googleAction!.$transaction!.updateOrder({
					updateMask: {
						paths: ['purchase.status', 'purchase.user_visible_status_label'],
					},
					order: {
						merchantOrderId: order.merchantOrderId,
						lastUpdateTime: new Date().toISOString(),
						purchase: {
							status: 'CONFIRMED',
							userVisibleStatusLabel: 'Order confirmed',
						},
					},
					reason: 'Reason string',
				});

				this.ask('Completed');
			}
			//
		},
	},

	YesIntent() {
		this.$googleAction!.setNextScene('TransactionDecision');
	},
});
function uniqueId() {
	return Math.random().toString(36).substr(2, 9);
}
export { app };
