const { google } = require('googleapis');
const axios = require('axios');
const serviceAccount = require('./service-account.json');

const jwtClient = new google.auth.JWT(
	serviceAccount.client_email,
	undefined,
	serviceAccount.private_key,
	['https://www.googleapis.com/auth/actions.order.developer'],
	undefined
);

async function updateOrder() {
	const tokens = await jwtClient.authorize();
	const orderId = '7ec5hsei5';

	// Declare order update.
	const orderUpdate = {
		updateMask: {
			paths: ['purchase.status', 'purchase.user_visible_status_label'],
		},
		order: {
			merchantOrderId: orderId, // Specify the ID of the order to update.
			lastUpdateTime: new Date().toISOString(),
			purchase: {
				status: 'DELIVERED',
				userVisibleStatusLabel: 'Order delivered',
			},
		},
		reason: 'Order status updated to delivered.',
		userNotification: {
			text: 'Order status updated to delivered.',
			title: 'Updated order',
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

async () => {
	try {
		const response = await updateOrder();
	} catch (err) {
		console.log(err);
		console.log(err.response.data);
	}
};
