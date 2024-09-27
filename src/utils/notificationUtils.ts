export const sendPushNotification = async (
	fcmToken: string,
	title: string,
	body: string,
	userId: string,
	coupleId: string
) => {
	try {
		// Ensure all required fields are present
		if (!fcmToken || !title || !body || !userId || !coupleId) {
			console.error('Missing required fields');
			return;
		}

		// Send the notification request to the backend API
		const response = await fetch('/api/sendNotification', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fcmToken, title, body, userId, coupleId }),
		});

		const data = await response.json();

		if (data.success) {
			console.log('Notification sent successfully');
		} else {
			console.error('Failed to send notification', data.message);
		}
	} catch (error) {
		console.error('Error sending notification:', error);
	}
};
