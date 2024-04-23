import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ListGroup, Form, Button } from 'react-bootstrap';

// import custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';

// import context file
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../../context/Context';

const GET_SUB_ORG_ID = gql`
query getSubOrgId($_eq: String = "") {
  sub_org(where: {name: {_eq: $_eq}}) {
    id
  }
}
`;

const CURRENT_USER_CHATROOM_ID = gql`
query currentUserChatroomId($member_id: uuid) {
  chatroom_membership(where: {member_id: {_eq: $member_id}, chatroom_details: {chatroom_members_list_aggregate: {count: {predicate: {_eq: 2}, distinct: true}}}}) {
    chatroom_id
  }
}
`;

const GET_CHATROOM_ID = gql`
query getChatroomId($_eq: uuid, $_in: [uuid!]) {
  chatroom_membership(where: {chatroom_details: {chatroom_members_list: {member_id: {_eq: $_eq}, chatroom_id: {_in: $_in}}}}, distinct_on: chatroom_id) {
    chatroom_id
  }
}
`;

const CREATE_CHATROOM = gql`
mutation createChatroom($sub_org_id: uuid = "") {
  insert_chatroom_one(object: {sub_org_id: $sub_org_id}) {
    id
  }
}
`;

const SEND_MESSAGE = gql`
mutation sendMessage($sender: uuid, $message: String, $chatroom_id: uuid) {
  insert_messages_one(object: {chatroom_id: $chatroom_id, message: $message, sender: $sender}) {
    message
  }
}
`;

const ADD_MEMBERSHIP = gql`
mutation addMembership($chatroom_id: uuid, $member_id: uuid) {
  insert_chatroom_membership(objects: {chatroom_id: $chatroom_id, member_id: $member_id}) {
    affected_rows
  }
}
`;

const NewChatModal = (props) => {

  const { user } = useAuth0();
  const ConfigContext = useContext(SubOrgContext)
	const sub_org_name = 'localhost'

  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [messageText, setMessageText] = useState(''); // State for message text

  const { data: subOrgIdData } = useQuery(GET_SUB_ORG_ID, {
    variables: {
      _eq: sub_org_name
    },
    onError: (error) => { console.log(error) }  
  });
  const [sendMessage, { data: sendMessageData }] = useMutation(SEND_MESSAGE);
  const [createChatRoom, { data: createChatroomData }] = useMutation(CREATE_CHATROOM);
  const [getChatroomId, { data: chatroomIdData }] = useLazyQuery(GET_CHATROOM_ID);
  const [addMembership, { data: addMembershipData }] = useMutation(ADD_MEMBERSHIP);
  const { data: currentUserChatroomIdData } = useQuery(CURRENT_USER_CHATROOM_ID, {
    variables: {
      member_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
    },
    onError: (error) => { console.log(error) }
  });

  const handleSendMessage = async () => {
    if (!selectedUser) {
      // Ensure a user is selected
      alert('Please select a user before sending a message.');
      return;
    }

    if (!messageText) {
      // Ensure a message is typed
      alert('Please enter a message before sending.');
      return;
    }

    console.log(selectedUser);

    try {
      const currentUserChatroomId = currentUserChatroomIdData?.chatroom_membership.map((item) => {
        return item.chatroom_id;
      });
      console.log(currentUserChatroomId)

      let chatroomId = await getChatroomId({
        variables: {
          _eq: selectedUser,
          _in: currentUserChatroomId
        },
        onError: (error) => { console.log(error) }
      })
      if (chatroomId?.data?.chatroom_membership?.length > 0) {
        // check if chatroom exist with both user in it
        chatroomId = chatroomId.data.chatroom_membership[0].chatroom_id;
      } else  {
        const chatroomResponse = await createChatRoom({
          variables: {
            sub_org_id: subOrgIdData?.sub_org[0].id,
          },
        });
        chatroomId = chatroomResponse.data.insert_chatroom_one.id;
        // Add membership for the current user and selected user
        await addMembership({
          variables: {
            chatroom_id: chatroomId,
            member_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
          },
        });

        await addMembership({
          variables: {
            chatroom_id: chatroomId,
            member_id: selectedUser,
          },
        });
      }

      // Send the message to the created chatroom
      await sendMessage({
        variables: {
          sender: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
          message: messageText,
          chatroom_id: chatroomId,
        },
      });

      // Reset the selected user and message text
      setSelectedUser(null);
      setMessageText('');

      // Close the modal or perform any other desired action
      props.onHide();

      location.pathname.includes('/i/') ? window.location.replace(`/i/chat/${chatroomId}`) :location.pathname.includes('/m/') ? window.location.replace(`/m/chat/${chatroomId}`) : window.location.replace(`/chat/${chatroomId}`);
    
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Chat
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-0">
        <ListGroup bsPrefix="list-unstyled" as="ul" className="contacts-list mb-0">
          {props.users?.map((item, index) => {
            return (
              <ListGroup.Item
                as="li"
                bsPrefix=" "
                key={index}
                className={`py-3 px-4 chat-item contacts-item`}
                onClick={() => {
					setSelectedUser(item.id)
				}}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="#" className="text-link contacts-link">
                    <div className="d-flex">
                      <Avatar
                        size="md"
                        className="rounded-circle"
                        type={item.image !== 'false' ? 'image' : 'initial'}
                        src={item.image}
                        status={item.status.toLowerCase()}
                        alt={item.name}
                        name={item.name}
                      />
                      <div className="ms-2">
                        <h5 className="mb-0">
							{item.name}
						</h5>
                      </div>
					  {selectedUser === item.id && (
						<div className="ml-auto">
							<span className="fs-6 ms-1 text-primary fa-regular fa-circle-check" />
						</div>
					  )}
                    </div>
                  </Link>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        {/* Text field for message */}
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        {/* Send button */}
        <Button variant="primary" onClick={handleSendMessage}>Send</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewChatModal;
