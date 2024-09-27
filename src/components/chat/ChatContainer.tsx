import { useEffect, useState, useRef } from 'react';
import {
	collection,
	addDoc,
	query,
	onSnapshot,
	orderBy,
	getDoc,
	doc,
} from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { useRouter } from 'next/router';
import ChatPresentation from './ChatPresentation';
import { formatDate } from '@/utils/dateUtils';
import { ChatMessage } from './chatTypes';
import { useTranslation } from 'react-i18next';
import Loading from '../common/loading/Loading';
import ErrorPage from '@/pages/error';
import { sendPushNotification } from '@/utils/notificationUtils';

const ChatContainer: React.FC = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { coupleId } = router.query;
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [chatting, setChatting] = useState<ChatMessage[]>([]);
	const [newChat, setNewChat] = useState('');
	const [isComposing, setIsComposing] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

	const scrollToBottom = () => {
		if (chatEndRef.current) {
			chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Fetch chat messages from Firestore
	useEffect(() => {
		if (!coupleId) return;
		const q = query(
			collection(db, 'couple-chats', coupleId as string, 'messages'),
			orderBy('createdAt')
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const msgs = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
				createdAt: doc.data().createdAt.toDate(),
			})) as ChatMessage[];
			setChatting(msgs);
			scrollToBottom();
		});
		return () => unsubscribe();
	}, [coupleId]);

	// Check if the user is authorized to view the chat
	useEffect(() => {
		const checkAuthorization = async () => {
			const user = auth.currentUser;
			if (!user) {
				setError(t('chat.needLogin'));
				router.push('/login');
				return;
			}

			if (coupleId) {
				try {
					const coupleDoc = await getDoc(
						doc(db, 'couples', coupleId as string)
					);

					if (coupleDoc.exists()) {
						const coupleData = coupleDoc.data();

						if (
							coupleData.inviterId === user.uid ||
							coupleData.partnerId === user.uid
						) {
							setIsAuthorized(true);
						} else {
							setError(t('chat.unauthorized'));
						}
					} else {
						setError(t('chat.roomNotExist'));
					}
				} catch (err) {
					console.error('Error fetching couple chat:', err);
					setError(t('chat.errorLoading'));
				} finally {
					setLoading(false);
				}
			}
		};

		if (coupleId) {
			checkAuthorization();
		}
	}, [coupleId, router, t]);

	// Sending chat message and notification
	const handleSendMessage = async () => {
		const message = newChat.trim();
		if (!message) return;

		const user = auth.currentUser;
		if (!user) return;

		try {
			await addDoc(
				collection(db, 'couple-chats', coupleId as string, 'messages'),
				{
					text: message,
					createdAt: new Date(),
					userId: user.uid,
					displayName: user.displayName || 'Unknown',
				}
			);

			// Fetch recipient FCM token
			const coupleDoc = await getDoc(
				doc(db, 'couples', coupleId as string)
			);
			const recipientId =
				coupleDoc.data()?.inviterId === user.uid
					? coupleDoc.data()?.partnerId
					: coupleDoc.data()?.inviterId;
			const recipientDoc = await getDoc(doc(db, 'users', recipientId)); // Replace with actual recipient's userId
			const recipientToken = recipientDoc?.data()?.fcmToken;
			if (recipientToken) {
				await sendPushNotification(
					recipientToken,
					user.displayName || 'New message',
					message,
					recipientId as string, // Ensure recipientId is a string
					coupleId as string // Ensure coupleId is a string
				);
			} else {
				console.error('Recipient FCM token not found.');
			}

			setNewChat('');
			scrollToBottom();
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isComposing) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleCompositionStart = () => setIsComposing(true);
	const handleCompositionEnd = () => setIsComposing(false);
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
		setShowScrollButton(scrollTop + clientHeight < scrollHeight);
	};
	const handleGoBack = () => {
		// 📍 기념일 페이지 'couple-anniversary'페이지가 아니면 뒤로 가기
		router.push('/');
	};

	if (loading) return <Loading />;
	if (error) return <ErrorPage errorMessage={error} t={t} />;

	return isAuthorized ? (
		<>
			<ChatPresentation
				chatting={chatting}
				newChat={newChat}
				setNewChat={setNewChat}
				handleSendMessage={handleSendMessage}
				handleKeyDown={handleKeyDown}
				handleCompositionStart={handleCompositionStart}
				handleCompositionEnd={handleCompositionEnd}
				handleScroll={handleScroll}
				handleGoBack={handleGoBack}
				showScrollButton={showScrollButton}
				formatDate={formatDate}
				chatEndRef={chatEndRef}
				scrollToBottom={scrollToBottom}
			/>
		</>
	) : null;
};

export default ChatContainer;
