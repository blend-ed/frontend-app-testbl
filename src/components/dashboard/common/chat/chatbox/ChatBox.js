// import node module libraries
import React, { useRef, useEffect, useContext, useState } from 'react';
import SimpleBar from 'simplebar-react';

// import sub custom components
import ChatHeader from './ChatHeader';
import Message from './Message';
import ChatFooter from './ChatFooter';

// import hook file
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// import sub custom components
import { gql, useQuery, useSubscription } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../../context/Context';
import { useMediaQuery } from 'react-responsive';

// const VIOLATION_CHATROOMS = gql`
//     query MyQuery {
//         messages(where: {violation: {_eq: true}}, distinct_on: chatroom_id) {
//             chatroom_id
//         }
//     }
// `

const USER_PROGRAM_DETAILS = gql`
query userProgramEnrollments($_eq: uuid = "", $sub_org_name: String = "") {
	program_enrollment(where: {user_id: {_eq: $_eq}, program: {sub_org: {name: {_eq: $sub_org_name}}}}) {
	  program {
		category
		program_achieved
		program_brief
		title
		start_date
		publish
	  }
	}
  }
`; 

const STREAK_DATA = gql`
	query streakData($_eq: uuid = "", $sub_org: String = "") {
		streaks(where: {user_id: {_eq: $_eq}, sub_org: {name: {_eq: $sub_org}}}) {
			last_streak
			current_streak
			updated_at
		}
	}
`;

const AI_CHAT_HISTORY = gql`
subscription AIChatHistory($_eq: uuid = "") {
	ai_chat(limit: 10, order_by: {timestamp: desc}, where: {user_id: {_eq: $_eq}}) {
	  ai_message
	  message
	}
  }
`;

const ChatBox = (props) => {
	const { hideChatBox, setHideChatBox, formattedThreadData, chatMessageArray, usersList, groupChatList, aiChatName, setActiveThread } = props;
	const [history, setHistory] = useState([]);
	const [streakFormattedData, setStreakFormattedData] = useState("");

	let {id: activeId} = useParams()
	const navigate = useNavigate();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const ConfigContext = useContext(SubOrgContext)
	const sub_org_name = 'localhost'

	const { user } = useAuth0();


	const {data: userProgramDetails} = useQuery(USER_PROGRAM_DETAILS, {
		variables: { _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'], sub_org_name: sub_org_name }
	})
	const {data: aiChatHistory} = useSubscription(AI_CHAT_HISTORY, {
		variables: { _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'] }
	})
	const {data: streakData} = useQuery(STREAK_DATA, {
		variables: {
			_eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
			sub_org: sub_org_name
		}
	})

	useEffect(() => {
		const history = []
		if (aiChatHistory) {
			aiChatHistory.ai_chat.map((item) => {
				if (item.ai_message) {
					history.push({'output': item.message})
				} else {
					history.push({'input': item.message})
				}
			})
			setHistory(history.reverse())
		}
	}, [aiChatHistory])

	useEffect(() => {
		if (streakData && streakData.streaks.length > 0) {
			console.log('Streak Data: ', streakData)
			let formattedData = ''
			if (streakData.streaks[0].last_streak === streakData.streaks[0].current_streak) {
				formattedData = 'Streak on going very well! \\'
			} else {
				formattedData = 'Streak broken \\'
			}
			if (streakData.streaks[0].updated_at === new Date().toISOString().split('T')[0]) {
				formattedData += 'Student was active today \\'
			} else {
				formattedData += 'Student was not active today \\'
			}
			if (streakData.streaks[0].updated_at < new Date().toISOString().split('T')[0]) {
				formattedData += 'Student has been absent for a while'
			}
			// show the count of streak too
			formattedData += `Last Streak: ${streakData.streaks[0].last_streak} \\ Current Streak: ${streakData.streaks[0].current_streak}`
			setStreakFormattedData(formattedData)

			console.log('Streak Data: ', formattedData)
		}
	}, [streakData])

	const getThreadMessages = (messageId) => {
		let result = (chatMessageArray ? chatMessageArray?.find(({ id }) => id === messageId) : [])
		return typeof result === 'object' && result?.chatMessages?.length > 0
			? result
			: 0 
	};

	let thread = 0;
	if (formattedThreadData && formattedThreadData.length > 0) {
		try {
			if (activeId) {
				thread = getThreadMessages(formattedThreadData.find(({ id }) => id === activeId).id);	
			}
		} catch (error) {
			console.log('Error: ', error)
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

	if (!activeId)
		return (
			<div className="chat-body w-100 vh-100 overflow-hidden">
				{/* ask the user to select a chat to message */}
				<div className="d-flex flex-column justify-content-center align-items-center h-100">
					<h1 className="text-center" style={{ fontSize: '24px', color: '#333', fontWeight: 'bold' }}>
						Welcome to the Chat!
					</h1>
					<p className="text-center" style={{ fontSize: '16px', color: '#666', marginTop: '16px' }}>
						Please select a chat to start messaging.
					</p>
				</div>
			</div>
		);

	return (
		<div
			className={`chat-body w-100 vh-100 overflow-hidden ${
				hideChatBox ? 'chat-body-visible' : ''
			}`}
		>
			<ChatHeader hideChatBox={hideChatBox} setHideChatBox={setHideChatBox} usersList={usersList} groupChatList={groupChatList} activeThread={formattedThreadData?.find(({ id }) => id === activeId)} setActiveThread={setActiveThread} />
			{!hideChatView ? 
			<>
				<SimpleBar style={{ height: isMobile ? 'calc(100vh - 130px)' : 'calc(100vh - 150px)' }}>
					<div className="px-4 py-4 messages-container">
						{thread === 0
							? null
							: thread.chatMessages.map((item, index) => {
								return <Message chatScript={item} key={index} usersList={usersList} groupChatList={groupChatList} activeId={thread.id} />;
							})}
					</div>
					<div ref={messagesEndRef} />
				</SimpleBar> 
			<ChatFooter history={history} programDetails={userProgramDetails} streakData={streakFormattedData} aiChatName={aiChatName} />
			</> : (
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
export default ChatBox;
