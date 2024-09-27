importScripts(
	'https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js'
);
importScripts(
	'https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js'
);

firebase.initializeApp({
	apiKey: 'AIzaSyDr3Qj-AaCLJ4c0J4YUb3ZhchyazI30BYA',
	projectId: 'our-story-ing',
	messagingSenderId: '313181532212',
	appId: '1:313181532212:web:87771c2bc797c6eb049a61',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: '/icons/couple.svg',
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', function (event) {
	try {
		const data = event.data.json();

		const notificationTitle = data.notification.title || '커플 채팅';
		const notificationOptions = {
			body: data.notification.body || '새로운 메시지가 있습니다.',
			icon: '/icons/couple.svg',
		};

		self.registration.showNotification(
			notificationTitle,
			notificationOptions
		);
	} catch (error) {
		console.error('Error parsing push event data:', error);
	}
});
