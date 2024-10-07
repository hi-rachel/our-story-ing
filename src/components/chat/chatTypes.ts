export interface ChatMessage {
	id: string;
	text: string;
	userId: string;
	displayName: string;
	photoURL: string;
	createdAt: Date;
	isRead: boolean;
}

export interface ChatPresentationProps {
	chatting: ChatMessage[];
	newChat: string;
	setNewChat: (value: string) => void;
	handleSendMessage: () => void;
	handleKeyDown: (e: React.KeyboardEvent) => void;
	handleCompositionStart: () => void;
	handleCompositionEnd: () => void;
	handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
	handleGoBack: () => void;
	showScrollButton: boolean;
	formatDate: (date: Date) => string;
	chatEndRef: React.MutableRefObject<HTMLDivElement | null>;
	scrollToBottom: () => void;
}
