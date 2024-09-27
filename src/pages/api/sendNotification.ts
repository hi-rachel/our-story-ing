import { NextApiRequest, NextApiResponse } from 'next';
import { messaging, db } from '../../lib/firebaseAdmin';
import admin from '@/lib/firebaseAdmin';

const sendNotification = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Only POST requests allowed' });
	}

	try {
		const { fcmToken, title, body, userId, coupleId } = req.body;

		if (!fcmToken || !title || !body || !userId || !coupleId) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		const message = {
			token: fcmToken,
			notification: {
				title,
				body,
			},
			data: {
				coupleId,
			},
		};

		try {
			// Attempt to send the notification
			const response = await messaging.send(message);
			console.log('Successfully sent message:', response);

			return res.status(200).json({
				success: true,
				message: 'Notification sent successfully',
			});
		} catch (error) {
			// Handle invalid token error
			if (
				(error as admin.FirebaseError).code ===
				'messaging/registration-token-not-registered'
			) {
				await db.collection('users').doc(userId).update({
					fcmToken: admin.firestore.FieldValue.delete(),
				});
				return res.status(200).json({
					success: true,
					message: 'FCM token was invalid and removed',
				});
			}
			throw error;
		}
	} catch (error) {
		console.error('Error sending notification:', error);
		return res.status(500).json({
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export default sendNotification;
