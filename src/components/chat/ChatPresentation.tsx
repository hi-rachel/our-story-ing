import { IoArrowBackOutline, IoArrowDown } from 'react-icons/io5';
import { auth } from '../../../firebase';
import { ChatPresentationProps } from './chatTypes';
import DefaultProfile from '../common/profile/DefaultProfile';

const ChatPresentation: React.FC<ChatPresentationProps> = ({
	chatting,
	newChat,
	setNewChat,
	handleSendMessage,
	handleKeyDown,
	handleCompositionStart,
	handleCompositionEnd,
	handleScroll,
	handleGoBack,
	showScrollButton,
	formatDate,
	chatEndRef,
	scrollToBottom,
}) => {
	return (
		<div className='flex flex-col h-screen bg-background p-4'>
			{/* Chat Header */}
			<div className='flex items-center bg-white p-4 shadow-lg rounded-lg mb-4'>
				<IoArrowBackOutline
					className='text-2xl cursor-pointer mr-2'
					onClick={handleGoBack}
				/>
				<div className='flex-grow text-center font-semibold'>
					Couple Chat
				</div>
			</div>

			{/* Chat Messages List */}
			<div
				className='flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-card'
				onScroll={handleScroll}>
				{chatting.map((msg) => (
					<div
						key={msg.id}
						className={`mb-3 flex items-start ${
							msg.userId === auth.currentUser?.uid
								? 'justify-end'
								: 'justify-start'
						}`}>
						{msg.userId !== auth.currentUser?.uid ? (
							<div className='flex items-start mr-3'>
								<DefaultProfile
									size={38}
									photoURL={
										msg.photoURL ? msg.photoURL : null
									}
								/>
								<div className='ml-2'>
									<div className='text-sm text-gray-600'>
										{msg.displayName}
									</div>
									<div className='flex items-end gap-2 mt-2'>
										<p
											className={`p-3 rounded-lg inline-block ${
												msg.userId ===
												auth.currentUser?.uid
													? 'bg-primary text-white'
													: 'bg-secondary text-text'
											}`}>
											{msg.text}
										</p>
										<div>
											<span className='text-xs text-gray-500 block'>
												{formatDate(msg.createdAt)}
											</span>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='flex flex-col items-end'>
								<div className='flex items-end gap-2'>
									<div className='flex flex-col items-end'>
										<span className='text-xs text-primary font-semibold'>
											{msg.isRead ? '' : '1'}
										</span>
										<span className='text-xs text-gray-500 block'>
											{formatDate(msg.createdAt)}
										</span>
									</div>
									<p className='bg-primary text-white p-3 rounded-lg inline-block'>
										{msg.text}
									</p>
								</div>
							</div>
						)}
					</div>
				))}
				<div ref={chatEndRef} />
			</div>

			{/* Scroll to bottom button */}
			{showScrollButton && (
				<button
					className='fixed bottom-20 right-5 p-2 bg-primary text-white rounded-full shadow-lg'
					onClick={scrollToBottom}>
					<IoArrowDown className='text-2xl' />
				</button>
			)}

			{/* Input Field */}
			<div className='flex mt-4'>
				<input
					type='text'
					value={newChat}
					onChange={(e) => setNewChat(e.target.value)}
					onKeyDown={handleKeyDown}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
					placeholder='Type your message...'
					className='flex-1 p-3 rounded-l-lg border border-gray-300 shadow-button focus:outline-none'
				/>
				<button
					onClick={handleSendMessage}
					className='bg-primary text-white p-3 rounded-r-lg shadow-button hover:bg-accent'>
					Send
				</button>
			</div>
		</div>
	);
};

export default ChatPresentation;
