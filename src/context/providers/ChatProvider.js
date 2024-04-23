// import node module libraries
import React, { useReducer, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// import context file
import { ChatContext } from '../../context/Context';

// import data files
import {UsersList} from '../../data/dashboard/chat/UsersData';
import {MessagesData} from '../../data/dashboard/chat/MessagesData';
import {ChatThreadsData} from '../../data/dashboard/chat/ChatThreadsData';
import {ChatGroupsData} from '../../data/dashboard/chat/ChatGroupsData';

// import reducer file
import { ChatReducer } from '../../reducers/ChatReducer';

const ChatProvider = ({ children }) => {
	const [activeThread, setActiveThread] = useState(ChatThreadsData[0]);
	const { user } = useAuth0()

	const [ChatState, ChatDispatch] = useReducer(ChatReducer, {
		messages: MessagesData,
		threads: ChatThreadsData,
		users: UsersList,
		groups: ChatGroupsData,
		loggedInUserId: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
		activeThread,
		setActiveThread
	});

	return (
		<ChatContext.Provider value={{ ChatState, ChatDispatch }}>
			{children}
		</ChatContext.Provider>
	);
};

export default ChatProvider;
