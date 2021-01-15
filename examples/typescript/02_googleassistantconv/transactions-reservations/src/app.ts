import { App, Jovo } from 'jovo-framework';

import {
	GoogleAssistant,
	TransactionDecisionType,
} from 'jovo-platform-googleassistantconv';
import { JovoDebugger } from 'jovo-plugin-debugger';
import { FileDb } from 'jovo-db-filedb';
import reservation from './reservation';

const app = new App();

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
	LAUNCH() {
		return this.toIntent('TransactionDecision');
	},

	TransactionCheckRequirementsIntent() {
		this.$googleAction!.setNextScene('TransactionRequirementsCheck');
	},

	TransactionDecision() {
		reservation.merchantOrderId = uniqueId();
		reservation.userVisibleOrderId = reservation.merchantOrderId;
		this.$googleAction!.$transaction!.buildReservation(
			reservation,

			{
				actionDisplayName: 'RESERVE',
			},
			{
				requestDeliveryAddress: false,
			}
		);

		this.$googleAction!.setNextScene('TransactionDecision');
	},

	ON_TRANSACTION: {
		TRANSACTION_REQUIREMENTS_CHECK() {
			if (this.$googleAction!.$transaction!.canTransact()) {
				reservation.merchantOrderId = uniqueId();
				reservation.userVisibleOrderId = reservation.merchantOrderId;
				this.$googleAction!.$transaction!.buildReservation(
					reservation,

					{
						actionDisplayName: 'RESERVE',
					},
					{
						requestDeliveryAddress: false,
					}
				);

				return this.ask('Would you like to reserve?');
			}

			this.tell('Transactions are not possible with your account.');
		},
		TRANSACTION_DECISION() {
			if (this.$googleAction!.$transaction!.isReservationAccepted()) {
				const reservation = this.$googleAction!.$transaction!.getReservation();

				this.$googleAction!.$transaction!.updateOrder({
					reason: 'Reason string',
					updateMask: {
						paths: [
							'contents.lineItems[0].reservation.status',
							'contents.lineItems[0].reservation.userVisibleStatusLabel',
							'contents.lineItems[0].reservation.confirmationCode',
							// 'contents.line_items[0].reservation.status',
							// 'contents.line_items[0].reservation.user_visible_status_label',
							// 'contents.line_items[0].reservation.confirmation_code',
							// 'reservation.confirmationCode',
						],
					},

					// updateMask:
					// 	'contents.line_items.reservation.status,contents.line_items.reservation.user_visibleStatus_label,contents.line_items.reservation.confirmation_code',
					order: {
						merchantOrderId: reservation.merchantOrderId,
						lastUpdateTime: new Date().toISOString(),
						// @ts-ignore
						contents: {
							lineItems: [
								{
									reservation: {
										// @ts-ignore
										status: 'CONFIRMED',
										userVisibleStatusLabel: 'Reservation confirmed',
										confirmationCode: '123ABCDEFGXYZA',
									},
								},
							],
						},

						// contents: {
						// 	lineItems: [
						// 		{
						// 			reservation: {
						// 				status: 'FULFILLED',
						// 				confirmationCode: '123ABCDEFGXYZ',
						// 				userVisibleStatusLabel: 'Reservation fulfilled',
						// 			},
						// 		},
						// 	],
						// },
					},
					userNotification: {
						text: 'Updated reservation',
						title: 'Updated reservation',
					},
				});

				this.tell("Great! You're all set.");
			} else if (this.$googleAction!.$transaction!.isReservationRejected()) {
				this.tell('Too bad!');
			} else {
				const transactionsDecision = this.$googleAction!.$transaction!.getTransactionDecisionResult();
				this.tell('Something went wrong');
			}
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
