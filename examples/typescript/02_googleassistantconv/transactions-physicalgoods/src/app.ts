import { App } from 'jovo-framework';
import {
	GoogleAssistant,
	Location,
	Order,
	OrderOptions,
	PaymentParameters,
	PresentationOptions,
} from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import order from './order';

const app: App = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('TransactionCheckRequirementsIntent');
	},

	TransactionCheckRequirementsIntent() {
		this.$googleAction!.setNextScene('TransactionRequirementsCheckScene');
	},

	ON_TRANSACTION: {
		async TRANSACTION_REQUIREMENTS_CHECK() {
			if (this.$googleAction.$transaction.canTransact()) {
				this.$googleAction.$transaction.askForDeliveryAddress(
					'To know where to send the order'
				);
				this.$googleAction.setNextScene('TransactionDeliveryAddressScene');
			} else {
				this.tell(`You can't perform physical transactions.`);
			}
		},

		DELIVERY_ADDRESS() {
			if (this.$googleAction!.$transaction!.isDeliveryAddressAccepted()) {
				const location:
					| Location
					| undefined = this.$googleAction!.$transaction!.getDeliveryAddress();

				order.purchase!.fulfillmentInfo!.location = location!;
				order.merchantOrderId = uniqueId();
				order.userVisibleOrderId = order.merchantOrderId;
				const presentationOptions: PresentationOptions = {
					actionDisplayName: 'PLACE_ORDER',
				};

				const orderOptions: OrderOptions = {
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
				this.$googleAction!.setNextScene('TransactionDecisionScene');

				this.ask('Okay we have your address now.');
			}
		},

		TRANSACTION_DECISION() {
			if (this.$googleAction!.$transaction!.isOrderAccepted()) {
				const order: Order = this.$googleAction!.$transaction!.getOrder();

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
			} else {
				// Handle different results.
			}
		},
	},
});

function uniqueId() {
	return Math.random().toString(36).substr(2, 9);
}
export { app };
