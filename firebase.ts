import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, getToken, Messaging } from 'firebase/messaging';

interface FirebaseConfig {
	apiKey: string | undefined;
	authDomain: string | undefined;
	projectId: string | undefined;
	storageBucket: string | undefined;
	messagingSenderId: string | undefined;
	appId: string | undefined;
	measurementId: string | undefined;
}

const firebaseConfig: FirebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// 클라이언트 사이드에서만 초기화
export const getClientAuth = (): Auth | null => {
	if (typeof window !== 'undefined') {
		return getAuth(app);
	}
	return null;
};

export const getClientStorage = (): FirebaseStorage | null => {
	if (typeof window !== 'undefined') {
		return getStorage(app);
	}
	return null;
};

export const getClientFirestore = (): Firestore | null => {
	if (typeof window !== 'undefined') {
		return getFirestore(app);
	}
	return null;
};

export const getClientMessaging = (): Messaging | null => {
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		return getMessaging(app);
	}
	return null;
};

export const initializeMessaging = async (): Promise<void> => {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
		return;
	}

	try {
		const registration = await navigator.serviceWorker.register(
			'/firebase-messaging-sw.js'
		);
		console.log('Service Worker registered: ', registration);

		const messaging = getMessaging(app);

		const currentToken = await getToken(messaging, {
			vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
			serviceWorkerRegistration: registration,
		});

		if (currentToken) {
			const auth = getClientAuth();
			if (auth?.currentUser) {
				await saveFcmTokenToFirestore(auth.currentUser.uid, currentToken);
			}
		} else {
			console.log(
				'No registration token available. Request permission to generate one.'
			);
		}
	} catch (err) {
		console.error('Failed to register service worker or get FCM token:', err);
	}
};

export const saveFcmTokenToFirestore = async (
	userId: string,
	fcmToken: string
): Promise<void> => {
	const db = getClientFirestore();
	if (!db) {
		console.error('Firestore is not available');
		return;
	}

	try {
		await setDoc(doc(db, 'users', userId), { fcmToken }, { merge: true });
		console.log('FCM token saved to Firestore');
	} catch (error) {
		console.error('Error saving FCM token:', error);
	}
};

export const requestPermissionAndSaveToken = async (): Promise<void> => {
	const auth = getClientAuth();
	if (!auth?.currentUser) return;

	try {
		const permission = await Notification.requestPermission();
		if (permission === 'granted') {
			console.log('Notification permission granted.');

			const messaging = getClientMessaging();
			if (messaging) {
				const fcmToken = await getToken(messaging, {
					vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
				});
				if (fcmToken) {
					await saveFcmTokenToFirestore(auth.currentUser.uid, fcmToken);
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

// 클라이언트 사이드에서만 auth state 변화 감지
export const initializeAuthStateListener = (): void => {
	if (typeof window === 'undefined') return;

	const auth = getClientAuth();
	if (!auth) return;

	onAuthStateChanged(auth, (user) => {
		if (user) {
			requestPermissionAndSaveToken();
		}
	});
};
