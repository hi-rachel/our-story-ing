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
import Loading from '../common/Loading';
import ErrorPage from '../common/ErrorPage';

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
	const [isSending, setIsSending] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

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

	// Scroll to the bottom of chat
	const scrollToBottom = () => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// Handle sending a new chat message
	const handleSendMessage = async () => {
		if (newChat.trim() === '' || isSending) return;

		const user = auth.currentUser;
		if (!user) return;

		setIsSending(true);
		try {
			await addDoc(
				collection(db, 'couple-chats', coupleId as string, 'messages'),
				{
					text: newChat,
					createdAt: new Date(),
					userId: user.uid,
					displayName: user.displayName || 'Unknown',
					photoURL: user.photoURL || '',
				}
			);
			setNewChat('');
			scrollToBottom();
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setIsSending(false);
		}
	};

	// Handle enter key for sending messages
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isComposing) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = () => {
		setIsComposing(false);
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
		if (scrollTop + clientHeight < scrollHeight) {
			setShowScrollButton(true);
		} else {
			setShowScrollButton(false);
		}
	};

	// Handle going back
	const handleGoBack = () => {
		// 뒤로가기가 'invite/[랜덤id]'초대하기 페이지 혹은 couple-anniversary 설정 페이지면 '/'로 이동
		router.back();
	};

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return <ErrorPage errorMessage={error} t={t} />;
	}

	return isAuthorized ? (
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
	) : null;
};

export default ChatContainer;
