// import node module libraries
import React, { useContext, useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

// import custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../../context/Context';

import AvatarImage from '../../../../../assets/images/avatar/avatar.png';

const GET_MENTOR_ID = gql`
query getMentorId($_eq: String, $user_id: uuid) {
    mentors(where: {mentors_sub_org: {name: {_eq: $_eq}}, mentors_students: {id: {_eq: $user_id}}}) {
      mentor_id
    }
  }
`;

const RecentChatList = (props) => {

    const { id: activeId } = useParams()
    const { user } = useAuth0()
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const navigate = useNavigate()

    const {
        formattedThreadData,
        usersList,
        chatMessageArray,
        groupChatList,
        setActiveThread
    } = props;

    const { data: mentorId } = useQuery(GET_MENTOR_ID, {
        variables: {
            user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            _eq: sub_org_name
        }
    });

    const [mentors, setMentors] = useState([]);
    useEffect(() => {
        if (mentorId) {
            const mentors = mentorId?.mentors.map((mentor) => mentor.mentor_id)
            setMentors(mentors)
        }
    }, [mentorId])

    const getLastMessage = (thread) => {
        let result = chatMessageArray?.find(({ id }) => id === thread.id);
        return typeof result === 'object' && result.chatMessages.length > 0
            ? result.chatMessages[result.chatMessages.length - 1].message
            : "Let's start chating";
    };

    const getLastMessageTime = (thread) => {
        let result = chatMessageArray?.find(({ id }) => id === thread.messagesId);
        if (typeof result === 'object' && result.chatMessages.length > 0) {
            const curDate = new Date();
            const msgDate = new Date(
                result.chatMessages[result.chatMessages.length - 1].date
            );
            return msgDate.getDate() === curDate.getDate() &&
                msgDate.getMonth() === curDate.getMonth() &&
                msgDate.getFullYear() === curDate.getFullYear()
                ? result.chatMessages[result.chatMessages.length - 1].time
                : result.chatMessages[result.chatMessages.length - 1].date;
        } else {
            return '';
        }
    };


    return (
        <SimpleBar style={{ maxHeight: '75vh' }}>
            <ListGroup bsPrefix="list-unstyled" as="ul" className="contacts-list">
                {formattedThreadData?.map((item, index) => {
                    let details =
                        item.type === 'user'
                            ? usersList?.find(({ id }) => id === item.userId)
                            : groupChatList?.find(({ id }) => id === item.groupId);

                    if (details !== null) {
                        return (
                            <ListGroup.Item
                                as="li"
                                onClick={() => {
                                    setActiveThread(item.id);
                                    navigate(location.pathname.includes('/i/') ? `/i/chat/${item.id}` : location.pathname.includes('/m/') ? `/m/chat/${item.id}` : `/chat/${item.id}`)
                                }}
                                key={index}
                                role="button"
                                className={`py-3 px-4 chat-item contacts-item ${activeId === item.id && 'bg-light'}`}
                            >
                                {item.type === 'user' ? (
                                    <div className="d-flex">
                                        <Avatar
                                            size="md"
                                            className="rounded-circle"
                                            type={details?.image !== 'false' ? 'image' : 'initial'}
                                            src={details?.image || AvatarImage}
                                            status={details?.status.toLowerCase()}
                                            alt={details?.name}
                                            name={details?.name}
                                        />
                                        <div className="ms-2">
                                            <div className="d-flex align-items-center">
                                                <h5 className="mb-0 fw-bold text-truncate-line"> {details?.name}</h5>
                                                {mentors.includes(item.userId) && (
                                                    <span className="badge bg-info ms-2 py-1">Mentor</span>
                                                )}
                                            </div>
                                            <p
                                                className="mb-0 text-muted text-truncate"
                                                style={{ maxWidth: '145px' }}
                                                dangerouslySetInnerHTML={{ __html: getLastMessage(item) }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="d-flex">
                                            <Avatar
                                                size="md"
                                                className="rounded-circle"
                                                type={details?.groupMembers[0]?.image !== 'false' ? 'image' : 'initial'}
                                                src={details?.groupMembers[0]?.image || AvatarImage}
                                                status={details?.groupMembers[0]?.status.toLowerCase()}
                                                alt={details?.groupMembers[0]?.name}
                                                name={details?.groupMembers[0]?.name}
                                            />
                                            <div className="position-absolute mt-3 ms-n2">
                                                <Avatar
                                                    size="sm"
                                                    className="rounded-circle"
                                                    type={details?.groupMembers[1]?.image ? 'image' : 'initial'}
                                                    src={details?.groupMembers[1]?.image || AvatarImage}
                                                    alt={details?.groupMembers[1]?.name}
                                                    status={details?.groupMembers[1]?.status.toLowerCase()}
                                                    name={details?.groupMembers[1]?.name}
                                                />
                                            </div>
                                            <div className=" ms-2">
                                                <h5 className="mb-0 fw-bold"> {details?.name}</h5>
                                                <p
                                                    className="mb-0 text-muted text-truncate"
                                                    style={{ maxWidth: '145px' }}
                                                    dangerouslySetInnerHTML={{ __html: getLastMessage(item) }} />
                                            </div>
                                        </div>
                                        <div>
                                            <small className="text-muted">
                                                {getLastMessageTime(item)}
                                            </small>
                                        </div>
                                    </div>
                                )}
                            </ListGroup.Item>
                        );
                    }
                    return false;
                })}
            </ListGroup>
        </SimpleBar>
    );
};
export default RecentChatList;
