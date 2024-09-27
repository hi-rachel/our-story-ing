// firebaseAdmin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert({
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
				clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
				privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
					/\\n/g,
					'\n'
				),
			}),
		});
		console.log('Firebase Admin initialized successfully');
	} catch (error) {
		console.error('Error initializing Firebase Admin:', error);
	}
}

export const db = admin.firestore();
export const messaging = admin.messaging();

export default admin;
