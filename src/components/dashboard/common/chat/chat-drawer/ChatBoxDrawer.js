// import node module libraries
import { useEffect, useRef } from 'react';

// import sub custom components
import ChatFooter from '../chatbox/ChatFooter';
import Message from '../chatbox/Message';

// import hook file
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ChatBoxDrawer = (props) => {
	const { formattedThreadData, chatMessageArray, usersList, chatBoxId, aiChatName, setActiveThread } = props;

	let activeId = chatBoxId;

	const navigate = useNavigate();

	const getThreadMessages = (messageId) => {
		let result = (chatMessageArray ? chatMessageArray?.find(({ id }) => id === messageId) : [])
		return typeof result === 'object' && result?.chatMessages?.length > 0
			? result
			: 0 
	};

	let thread = 0;
	if (formattedThreadData && formattedThreadData.length > 0) {
		try {
			thread = getThreadMessages(formattedThreadData.find(({ id }) => id === activeId).id);	
			setActiveThread(formattedThreadData.find(({ id }) => id === activeId))
		} catch (error) {
			activeId = formattedThreadData[0].id;

			navigate(`/${location.pathname.includes('/i/') ? 'i/' : ''}chat/${activeId}`);
			thread = getThreadMessages(formattedThreadData[0].id);
		}
	  } 
	  

	// Auto scroll to bottom when the new chat has been added.
	const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	};

	useEffect(scrollToBottom);

	// const hideChatView = violationChatroom?.messages && violationChatroom.messages.length > 0 && violationChatroom.messages.map(message => message.chatroom_id)?.includes(activeId);
	const hideChatView = false;

	return (
		<div>
			{!hideChatView ? 
			<div>
					<div className="px-4 py-4 chat-drawer-body">
						{thread === 0
							? null
							: thread.chatMessages.map((item, index) => {
								return <Message chatScript={item} key={index} usersList={usersList} drawer activeId={thread.id} />;
							})}
					</div>
					<div ref={messagesEndRef} />
			<ChatFooter drawer chatBoxId={chatBoxId} aiChatName={aiChatName} />
			</div> : (
                <div>
					<Alert variant="warning m-3">
						<Alert.Heading>Alert: Policy Violation Detected ⚠️</Alert.Heading>
						<p>
							There has been a violation of chat policy in this conversation. Please contact the <span className='fw-bold'>administrator</span> immediately to address this issue.
						</p>
						<hr className='text-dark-warning'/>
						<p className="mb-0">
							Thank you for your attention.
						</p>
					</Alert>
				</div>
            )}
		</div>
	);
};
export default ChatBoxDrawer;
