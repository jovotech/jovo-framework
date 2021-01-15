import { google } from 'googleapis';
import * as serviceAccount from './service-account.json';
import axios from 'axios';

const jwtClient = new google.auth.JWT(
	serviceAccount.client_email,
	undefined,
	serviceAccount.private_key,
	['https://www.googleapis.com/auth/actions.order.developer'],
	undefined
);
test();

async function test() {
	try {
		const response = await updateReservation();
	} catch (e) {
		console.log(e);
		console.log(e.response.data);
	}
}

async function updateReservation() {
	const tokens = await jwtClient.authorize();
	const orderId = '7ec5hsei5';

	// Declare order update
	const orderUpdate = {
		updateMask: {
			paths: [
				'contents.lineItems.reservation.status',
				'contents.lineItems.reservation.userVisibleStatusLabel',
			],
		},
		order: {
			merchantOrderId: orderId, // Specify the ID of the order to update
			lastUpdateTime: new Date().toISOString(),
			contents: {
				lineItems: [
					{
						reservation: {
							status: 'FULFILLED',
							userVisibleStatusLabel: 'Reservation fulfilled',
						},
					},
				],
			},
		},
		reason: 'Reservation status was updated to fulfilled.',
		userNotification: {
			text: 'Reservation status was updated to fulfilled',
			title: 'Updated reservation',
		},
	};
	return axios.request({
		method: 'PATCH',
		url: `https://actions.googleapis.com/v3/orders/${orderId}`,
		headers: { Authorization: `Bearer ${tokens.access_token}` },
		data: {
			header: {
				isInSandbox: true,
			},
			orderUpdate,
		},
	});
}
