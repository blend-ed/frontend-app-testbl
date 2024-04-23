// import node module libraries
import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

// import context file
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { SubOrgContext } from '../../../../../context/Context';

const SEND_MESSAGE = gql`
	mutation MyMutation($chatroom_id: uuid, $message: String, $sender: uuid) {
		insert_messages_one(object: {chatroom_id: $chatroom_id, message: $message, sender: $sender}) {
			message
		}
	}
`;

const SEND_AI_MESSAGE = gql`
mutation sendAIMessage($message: String = "", $user_id: uuid = "", $ai_message: Boolean = false, $sub_org_id: uuid = "") {
	insert_ai_chat_one(object: {message: $message, user_id: $user_id, ai_message: $ai_message, sub_org_id: $sub_org_id}) {
	  id
	}
  }  
`;

const AI_CHATBOT = gql`
mutation aiMessage($attendance: String = "", $history: jsonb = "", $user_details: String = "", $user_message: String = "", $program_details: String = "") {
	aiChatbot(attendance: $attendance, history: $history, user_details: $user_details, user_message: $user_message, program_details: $program_details) {
	  bot_message
	  err_msg
	}
  }
`;

const UPDATE_TIME = gql`
mutation updateTime($id: uuid, $updated_at: timestamptz = "") {
	update_user(where: {id: {_eq: $id}}, _set: {updated_at: $updated_at}) {
	  affected_rows
	}
  }
`;

const GET_SUB_ORG_ID = gql`
query getSubOrgId($_eq: String = "") {
  sub_org(where: {name: {_eq: $_eq}}) {
    id
  }
}
`;

const SendMessage = ({ drawer, chatBoxId, history, programDetails, aiChatName, streakFormattedData }) => {
    const { id: activeId } = useParams();

    const id = chatBoxId ? chatBoxId : activeId;
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const { user } = useAuth0();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const [sendAIMessageMutation] = useMutation(SEND_AI_MESSAGE);
    const [aiChatbotMutation] = useMutation(AI_CHATBOT);
    const [updateTimeMutation] = useMutation(UPDATE_TIME);
    const { data: subOrgIdData } = useQuery(GET_SUB_ORG_ID, {
        variables: {
            _eq: sub_org_name
        },
        onError: (error) => { console.log(error) }
    });

    // Define the regular expressions for detecting unauthorized broker links and contact details
    const unauthorizedBrokerLinkRegex = /\b(?:https?:\/\/)?[^\s]+\.(com|net|org|io|co|xyz|me)\b/i
    const contactDetailsRegex = /\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

    let programDetailsString = '';
    if (programDetails && programDetails.program_enrollment) {
        programDetails.program_enrollment.forEach((programEnrollment, index) => {
            programDetailsString += `Program ${index + 1}:\n`;
            programDetailsString += `Title: ${programEnrollment.program.title}\n`;
            programDetailsString += `Category: ${programEnrollment.program.category}\n`;
            programDetailsString += `Brief: ${programEnrollment.program.program_brief}\n`;
            programDetailsString += `Start Date: ${programEnrollment.program.start_date}\n`;
            programDetailsString += `Publish: ${programEnrollment.program.publish ? 'Yes' : 'No'}\n\n`;
        });
    }

    const handleInputChange = (e) => {
        const inputValue = e.target.value;

        // Check for unauthorized broker links as the user types
        if (unauthorizedBrokerLinkRegex.test(inputValue)) {
            // Implement your action here, e.g., providing feedback to the user.
            console.log('Unauthorized broker link detected:', inputValue);
        }

        // Check for contact details as the user types
        if (contactDetailsRegex.test(inputValue)) {
            // Implement your action here, e.g., providing feedback to the user.
            console.log('Contact details detected:', inputValue);
        }

        setMessage(inputValue);
    };

    const handleSubmit = () => {
        let newMessage = {
            userId: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            message: `${message.replace(/(?:\r\n|\r|\n)/g, '<br>')}`,
        };
        if (id !== 'ai') {
            sendMessageMutation({
                variables: {
                    chatroom_id: id,
                    message: newMessage.message,
                    sender: newMessage.userId,
                },
                onCompleted: () => {
                    setMessage('');
                    updateTimeMutation({
                        variables: {
                            id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
                            updated_at: new Date().toISOString()
                        }
                    });
                }
            });
        } else {
            setMessage('')
            sendAIMessageMutation({
                variables: {
                    message: newMessage.message,
                    user_id: newMessage.userId,
                    sub_org_id: subOrgIdData?.sub_org[0].id
                },
                onCompleted: () => {
                    console.log('Message sent to AI Chatbot. Waiting for response...')
                    setIsLoading(true)
                    aiChatbotMutation({
                        variables: {
                            attendance: `${streakFormattedData}`,
                            history: history,
                            user_details: `${user?.['name']}`,
                            user_message: newMessage.message,
                            program_details: programDetailsString
                        },
                        onCompleted: (data) => {
                            console.log('AI Chatbot response received:', data.aiChatbot.bot_message)
                            setIsLoading(false)
                            sendAIMessageMutation({
                                variables: {
                                    message: data.aiChatbot.bot_message,
                                    user_id: newMessage.userId,
                                    sub_org_id: subOrgIdData?.sub_org[0].id,
                                    ai_message: true
                                },
                            });
                        }
                    });
                }
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!message.trim()) return;
            handleSubmit();
        }
    };

    return (
        <div className={`bg-white ${!drawer && 'p-2'} rounded-3 shadow-sm`}>
            {(isLoading && id === 'ai') ? <p className='mb-0 py-3 text-muted mx-3'>
                {aiChatName} is typing...
            </p>
                :
                <div className='d-flex align-items-center py-1'>
                    <Form.Control
                        as="textarea"
                        placeholder="Type a New Message"
                        id="Excerpt"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="form-control border-0 form-control-simple no-resize"
                        style={{ height: '.8em' }}
                    />
                    <div>
                        <Button
                            variant="none"
                            bsPrefix="btn"
                            className="fs-3 text-primary btn-focus-none border-0"
                            onClick={handleSubmit}
                            disabled={!message.trim() || (id === 'ai' && isLoading)}
                        >
                            <i className="fe fe-send"></i>
                        </Button>
                    </div>
                </div>}
        </div>
    );
};
export default SendMessage;
