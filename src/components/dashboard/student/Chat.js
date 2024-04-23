// import node module libraries
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { Col, Row } from 'react-bootstrap';

// import sub custom components
import { SubOrgContext } from '../../../context/Context';
import { Loading } from '../../../helper/Loading';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import ChatBox from '../common/chat/chatbox/ChatBox';
import Sidebar from '../common/chat/sidebar/Sidebar';

const AI_CHAT_NAME = gql`
    query getAIChatName($domain: String = "") {
         organisation(where: {domain: {_eq: $domain}}) {
            ai_chat
        }
    }
`;


const GET_USERS = gql`
    subscription GetUsers($_eq: String, $domain: String = "") {
        user(where: {organisations: {sub_org: {name: {_eq: $_eq}}}}) {
            id
            created_at
            updated_at
            mobile
            user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                name
                profile_image
            }
        }
    } 
`;

const GET_MESSAGES_USER = gql`
subscription GetMessages($_eq: uuid, $sub_org: String = "") {
    chatroom(where: {chatroom_members_list: {member_id: {_eq: $_eq}}, sub_org: {name: {_eq: $sub_org}}}) {
      chatroom_messages_list(order_by: {timestamp: asc}) {
        id
        chatroom_id
        message
        sender
        timestamp
      }
    }
  }  
`;

const CHAT_THREAD_USER = gql`
subscription GetLatestMessageUser($_eq: uuid, $sub_org: String = "") {
    messages(where: {messages_chatroom: {chatroom_members_list: {member_id: {_eq: $_eq}}, sub_org: {name: {_eq: $sub_org}}}}, distinct_on: chatroom_id, order_by: {chatroom_id: asc, timestamp: desc}) {
      chatroom_id
      id
      messages_chatroom {
        chatroom_members_list(where: {member_id: {_neq: $_eq}}) {
          member_id
        }
      }
      timestamp
    }
  }  
`;

const GET_INSTRUCTOR_IDS = gql`
    query getInstructorIds($_eq: String) {
        organisation_user(where: {_and: {role: {_eq: instructor}, sub_org: {name: {_eq: $_eq}}}}) {
           user_id
        }
    }  
`;

const AI_CHAT = gql`
subscription AIMessageThread($_eq: uuid = "", $sub_org: String = "") {
    ai_chat(where: {user_id: {_eq: $_eq}, sub_org: {name: {_eq: $sub_org}}, hidden: {_eq: false}}, order_by: {timestamp: asc}) {
      id
      message
      timestamp
      ai_message
      user_id
    }
  }  
`;

const AI_CHAT_THREAD = gql`
subscription AIMessageThread($_eq: uuid = "", $sub_org: String = "") {
    ai_chat(order_by: {timestamp: desc}, limit: 1, where: {user_id: {_eq: $_eq}, sub_org: {name: {_eq: $sub_org}}, hidden: {_eq: false}}) {
      id
      message
      timestamp
      ai_message
      user_id
    }
  }  
`;

const GET_MENTOR_IDS = gql`
    query getMentor($student_id: uuid = "", $sub_org_name: String = "") {
        mentors(where: {mentors_sub_org: {name: {_eq: $sub_org_name}}, mentors_students: {id: {_eq: $student_id}}}) {
            mentor_id
        }
    }
`;

const CHATROOM_MEMBER_COUNT = gql`
    subscription chatroomMemberCount($_eq: String, $user_id: uuid) {
        chatroom(where: {sub_org: {name: {_eq: $_eq}}, chatroom_members_list: {member_id: {_eq: $user_id}}}) {
            id
            group_name
            chatroom_members_list_aggregate {
                aggregate {
                    count(columns: member_id)
                }
                nodes {
                    member_id
                    chatroom_member {
                        user_details(where: {user: {organisations: {sub_org: {name: {_eq: $_eq}}}}}, distinct_on: openedx_id) {
                            name
                            profile_image
                        }
                        updated_at
                    }
                }
            }
        }
    }     
`;

const Chat = () => {

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [hideChatBox, setHideChatBox] = useState(false);

    const [activeThread, setActiveThread] = useState();
    const [usersList, setUsersList] = useState();
    const [groupChatList, setGroupChatList] = useState();
    const [chatMessageArray, setChatMessageArray] = useState();
    const [formattedThreadData, setFormattedThreadData] = useState();
    const [chatroomMemberCount, setChatroomMemberCount] = useState({});
    const [groupChatroomMembers, setGroupChatroomMembers] = useState({});
    const [chatroomMembers, setChatroomMembers] = useState({});
    const [chatroomNames, setChatroomNames] = useState({});
    const [allChatrooms, setAllChatrooms] = useState([]);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const { user } = useAuth0();

    const { id: activeId } = useParams();

    const { data: aiChatName } = useQuery(AI_CHAT_NAME, {
        variables: {
            domain: window.location.origin
        }
    });

    const { data: aiData } = useSubscription(AI_CHAT, {
        variables: {
            _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const { data: aiDataThread } = useSubscription(AI_CHAT_THREAD, {
        variables: {
            _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name
        }
    });

    const { data: usersData, loading } = useSubscription(GET_USERS, {
        variables: {
            _eq: sub_org_name,
            domain: window.location.origin
        }
    });
    const { data: instructorData } = useQuery(GET_INSTRUCTOR_IDS, {
        variables: {
            _eq: sub_org_name
        }
    });
    const { data: messageData, loading: messageLoading } = useSubscription(GET_MESSAGES_USER, {
        variables: {
            _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name
        }
    });

    const { data: threadDataUser, loading: threadLoadingUser } = useSubscription(CHAT_THREAD_USER, {
        variables: {
            _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name
        }
    });

    const { data: mentorData } = useQuery(GET_MENTOR_IDS, {
        variables: { sub_org_name: sub_org_name, student_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'] }
    });

    const { data: chatroomMemberCountData } = useSubscription(CHATROOM_MEMBER_COUNT, {
        variables: {
            _eq: sub_org_name,
            user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id']
        },
        onError: (error) => {
            console.log(error);
        }
    });

    useEffect(() => {
        if (chatroomMemberCountData) {
            const chatroomMemberCount = {};
            const groupChatroomMembers = {};
            const chatroomMembers = {};
            const chatroomNames = {};
            const allChatrooms = [];
            chatroomMemberCountData.chatroom.forEach((chatroom) => {
                allChatrooms.push(chatroom.id);
                chatroomMemberCount[chatroom.id] = chatroom.chatroom_members_list_aggregate.aggregate.count;
                chatroomNames[chatroom.id] = chatroom.group_name;
                if (chatroom.group_name !== null) {
                    groupChatroomMembers[chatroom.id] = chatroom.chatroom_members_list_aggregate.nodes.map((node) => {
                        return {
                            id: node.member_id,
                            name: node.chatroom_member.user_details?.[0].name,
                            image: node.chatroom_member.user_details?.[0].profile_image,
                            status: getOnlineStatus(node.chatroom_member.updated_at)
                        }
                    })
                } else {
                    chatroomMembers[chatroom.id] = chatroom.chatroom_members_list_aggregate.nodes.map((node) => {
                        return {
                            id: node.member_id,
                            name: node.chatroom_member.user_details?.[0].name,
                            image: node.chatroom_member.user_details?.[0].profile_image,
                            status: getOnlineStatus(node.chatroom_member.updated_at)
                        }
                    })
                }
            });
            setChatroomMemberCount(chatroomMemberCount);
            setGroupChatroomMembers(groupChatroomMembers);
            setChatroomMembers(chatroomMembers);
            setChatroomNames(chatroomNames);
            setAllChatrooms(allChatrooms);
        }
    }, [chatroomMemberCountData]);

    const compareTimestamps = (a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      };

    useEffect(() => {
        if (mentorData) {
            const mentorIds = mentorData.mentors.map((mentor) => mentor.mentor_id);
        }
    }, [mentorData]);

    const getOnlineStatus = (updated_at) => {
        const currentTime = new Date();
        const lastUpdatedTime = new Date(updated_at);

        const timeDifference = currentTime.getTime() - lastUpdatedTime.getTime();
        const onlineThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

        return timeDifference <= onlineThreshold ? 'online' : 'offline';
    }

    useEffect(() => {
        if (usersData && instructorData) {
            setUsersList(
                usersData.user.map((user) => ({
                    id: user.id,
                    name: user.user_details?.[0].name,
                    image: user.user_details?.[0].profile_image,
                    locations: sub_org_name,
                    joined: user.created_at,
                    status: getOnlineStatus(user.updated_at),
                    mobile: user.mobile
                }))
            );
            setUsersList((usersList) => [
                ...usersList,
                {
                    id: 'ai',
                    name: aiChatName?.organisation[0]?.ai_chat || 'AI',
                    image: 'https://www.w3schools.com/howto/img_avatar.png',
                    locations: sub_org_name,
                    joined: '2021-01-01T00:00:00.000000',
                    status: 'online'
                }
            ]);
        }

        if (groupChatroomMembers) {
            setGroupChatList(
                Object.keys(groupChatroomMembers).map((chatroom) => ({
                    id: chatroom,
                    name: chatroomNames[chatroom],
                    groupMembers: groupChatroomMembers[chatroom]
                }))
            );
        }

        if (messageData && aiData) {
            const userChatMessages = messageData.chatroom.map((item) => item.chatroom_messages_list).flat() || [];
            const aiChatMessages = aiData?.ai_chat.map((item) => item).flat() || [];

            // Concatenate user and ai chat messages
            const allMessages = [...userChatMessages, ...aiChatMessages];

            // Create an object to hold chat messages for each chatroom_id
            const chatMessages = {};

            // Group messages by chatroom_id
            allMessages.forEach((message) => {
                const createdAt = new Date(message.timestamp);
                const date = createdAt.toDateString();
                const time = createdAt.toLocaleTimeString();
                let formattedMessage = {};
                if (message.__typename === 'ai_chat') {
                    formattedMessage = {
                        userId: message?.ai_message ? 'ai' : message.user_id,
                        message: message?.message,
                        date,
                        time,
                        id: message?.id
                    };
                } else {
                    formattedMessage = {
                        userId: message?.sender,
                        message: message?.message,
                        date,
                        time,
                        id: message?.id
                    };
                }

                let chatroom_id = '';
                if (message.__typename === 'ai_chat') {
                    chatroom_id = 'ai';
                } else {
                    chatroom_id = message.chatroom_id;
                }

                if (!chatMessages[chatroom_id]) {
                    // Initialize an array for the chatroom_id if it doesn't exist
                    chatMessages[chatroom_id] = {
                        id: chatroom_id,
                        chatMessages: [formattedMessage],
                    };
                } else {
                    // Add the formatted message to the existing chatroom_id
                    chatMessages[chatroom_id].chatMessages.push(formattedMessage);
                }
            });

            // Convert the chatMessages object to an array of objects
            setChatMessageArray(Object.values(chatMessages));
        }

        const combinedThreadData = [...(threadDataUser?.messages.sort(compareTimestamps) || [])];
        if (combinedThreadData) {
            setFormattedThreadData(
                combinedThreadData
                    .filter((message) => message.id)
                    .map((message) => {
                        if (groupChatList.find((group) => group.id === message.chatroom_id)) {
                            return {
                                id: message.chatroom_id,
                                groupId: message.chatroom_id,
                                messagesId: message.id,
                                type: "group",
                                read: true,
                            };
                        } else {
                            return {
                                id: message.chatroom_id,
                                userId: message.messages_chatroom?.chatroom_members_list?.[0]?.member_id,
                                messagesId: message.id,
                                type: "user",
                                read: true,
                            };
                        }
                    })
            );
            if (aiDataThread && aiDataThread.ai_chat.length > 0) {
                setFormattedThreadData((formattedThreadData) => [
                    {
                        id: 'ai',
                        userId: 'ai',
                        messagesId: aiDataThread.ai_chat[0].id,
                        type: 'user',
                        read: true,
                    },
                    ...formattedThreadData
                ]);
            } else if (aiDataThread) {
                setFormattedThreadData((formattedThreadData) => [
                    {
                        id: 'ai',
                        userId: 'ai',
                        messagesId: 1,
                        type: 'user',
                        read: true,
                    },
                    ...formattedThreadData
                ]);
            }
        }

        if (allChatrooms.length > 0 && chatroomMembers && formattedThreadData) {
            allChatrooms.map((chatroom) => {
                if (!formattedThreadData.find((thread) => thread.id === chatroom))
                    setFormattedThreadData((formattedThreadData) => [
                        ...formattedThreadData,
                        {
                            id: chatroom,
                            userId: chatroomMembers[chatroom]?.filter((member) => member.id !== user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'])[0]?.id,
                            messagesId: 1,
                            type: 'user',
                            read: true,
                        }
                    ]);
            });
        }
        // formattedThreadData && setActiveThread(formattedThreadData[0])
    }, [usersData, messageData, threadDataUser, instructorData, aiData, aiDataThread, groupChatroomMembers, chatroomMembers, allChatrooms, chatroomMemberCount, chatroomNames]);

    useEffect(() => {
        if (activeId) {
            setActiveThread(activeId);
        }
    }, [activeId]);

    if (loading ||  messageLoading || threadLoadingUser) {
        return <Loading />;
    }

    if (!loading && !messageLoading && !threadLoadingUser) {

        return (
            <Row className="g-0 m-n4">
                {((!activeThread && isMobile) || !isMobile) && <Col xl={3} lg={12} md={12} xs={12}>
                    <Sidebar hideChatBox={hideChatBox} setHideChatBox={setHideChatBox} chatMessageArray={chatMessageArray} usersList={usersList} groupChatList={groupChatList} formattedThreadData={formattedThreadData} activeThread={activeThread} setActiveThread={setActiveThread} />
                </Col>}
                {activeThread || !isMobile ?
                    <Col xl={9} lg={12} md={12} xs={12}>
                        <ChatBox hideChatBox={hideChatBox} formattedThreadData={formattedThreadData} chatMessageArray={chatMessageArray} usersList={usersList} groupChatList={groupChatList} setHideChatBox={setHideChatBox} aiChatName={aiChatName?.organisation[0]?.ai_chat} activeThread={activeThread} setActiveThread={setActiveThread} />
                    </Col>
                    :
                    (isMobile && !activeThread) ?
                    ''
                    :
                    <Col xl={9} lg={12} md={12} xs={12}>
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <h3 className="text-center">No chat selected</h3>
                        </div>
                    </Col>
                }
            </Row>
        );
    }
};

export default Chat;
