import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

export let messaging: Messaging | null = null;

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
	messaging = getMessaging(app);
}

export const initializeMessaging = async () => {
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.register(
				'/firebase-messaging-sw.js'
			);
			console.log('Service Worker registered: ', registration);

			messaging = getMessaging(app);

			const currentToken = await getToken(messaging, {
				vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
				serviceWorkerRegistration: registration,
			});

			if (currentToken) {
				const user = auth.currentUser;
				if (user) {
					await saveFcmTokenToFirestore(user.uid, currentToken);
				}
			} else {
				console.log(
					'No registration token available. Request permission to generate one.'
				);
			}
		} catch (err) {
			console.error('Failed to register service worker or get FCM token:', err);
		}
	}
};

export const saveFcmTokenToFirestore = async (
	userId: string,
	fcmToken: string
) => {
	try {
		await setDoc(doc(db, 'users', userId), { fcmToken }, { merge: true });
		console.log('FCM token saved to Firestore');
	} catch (error) {
		console.error('Error saving FCM token:', error);
	}
};

export const requestPermissionAndSaveToken = async () => {
	const user = auth.currentUser;
	if (!user) return;

	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			console.log('Notification permission granted.');

			if (messaging) {
				const fcmToken = await getToken(messaging, {
					vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
				});
				if (fcmToken) {
					await saveFcmTokenToFirestore(user.uid, fcmToken);
				} else {
					console.error('Failed to retrieve FCM token.');
				}
			} else {
				console.error('Firebase Messaging is not available.');
			}
		} else {
			console.error('Unable to get permission to notify.');
		}
	} catch (error) {
		console.error('Error getting FCM token:', error);
	}
};

onAuthStateChanged(auth, (user) => {
	if (user) {
		requestPermissionAndSaveToken();
	}
});
