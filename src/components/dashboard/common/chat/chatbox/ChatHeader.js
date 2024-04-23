// import node module libraries
import { Fragment, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';

// import hook file
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useQuery } from '@apollo/client';
import { SubOrgContext } from '../../../../../context/Context';
import GKTooltip from '../../../../../components/elements/tooltips/GKTooltip';

import AvatarImage from '../../../../../assets/images/avatar/avatar.png';

const GET_MENTOR_ID = gql`
query getMentorId($_eq: String, $user_id: uuid) {
    mentors(where: {mentors_sub_org: {name: {_eq: $_eq}}, mentors_students: {id: {_eq: $user_id}}}) {
      mentor_id
    }
  }
`;

const ChatHeader = (props) => {

    const { hideChatBox, setHideChatBox, activeThread, usersList, groupChatList, setActiveThread } = props;

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [mentors, setMentors] = useState([]);

    const { user: loggedInUser } = useAuth0()

    const loggedInUserId = loggedInUser['https://hasura.io/jwt/claims']['x-hasura-user-id']

    const getUserDetailsById = (userId) => {
        return usersList?.find(({ id }) => id === userId);
    };

    const getGroupChatDetailsById = (chatId) => {
        return groupChatList?.find(({ id }) => id === chatId);
    };

    let ActiveChatInfo =
        activeThread?.type === 'user'
            ? getUserDetailsById(activeThread.userId)
            : activeThread?.type === 'group' ? getGroupChatDetailsById(activeThread.groupId)
                : null;

    const { data: mentorId } = useQuery(GET_MENTOR_ID, {
        variables: {
            user_id: loggedInUserId,
            _eq: sub_org_name
        }
    });

    useEffect(() => {
        if (mentorId) {
            const mentors = mentorId?.mentors.map((mentor) => mentor.mentor_id)
            setMentors(mentors)
        }
    }, [mentorId])

    if (!activeThread) {
        // show that the chatroom is being loaded
        return (
            <div className="bg-white border-top border-bottom px-lg-4 px-3 py-lg-3 py-2 sticky-top">
                <div className="d-flex justify-content-between align-items-center mb-lg-0">
                    <div className="d-flex align-items-center mt-1">
                        <Avatar
                            size="md"
                            className="rounded-circle"
                            type="initial"
                            alt="Loading..."
                            name="Loading..."
                        />
                        <div className="ms-2 mt-n1">
                            <h4 className="mb-0 text-truncate-line">Loading...</h4>
                            <span className="text-truncate-line">Creating the chatroom</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-top border-bottom px-lg-4 px-3 py-lg-3 py-2 sticky-top">
            <div className="d-flex justify-content-between align-items-center mb-lg-0">
                <div className="d-flex align-items-center mt-1">
                    <Link
                        to="#"
                        className="me-2 d-lg-none d-block text-muted"
                        onClick={() => setActiveThread(null)}
                    >
                        <i className="fe fe-chevron-left fw-bold fs-3"></i>
                    </Link>
                    {activeThread?.type === 'user' ? (
                        <Avatar
                            size="md"
                            className="rounded-circle"
                            type={ActiveChatInfo?.image !== 'false' ? 'image' : 'initial'}
                            src={ActiveChatInfo?.image || AvatarImage}
                            status={ActiveChatInfo?.status.toLowerCase()}
                            alt={ActiveChatInfo?.name}
                            name={ActiveChatInfo?.name}
                        />
                    ) : (
                        <Fragment>
                            {/* 
                            Group Avatar Option 1
                            */}

                            <Avatar
                                size="md"
                                className="rounded-circle"
                                type="initial"
                                alt={ActiveChatInfo?.name}
                                name={ActiveChatInfo?.name?.split(' ').slice(0, 3).join('+')}
                            />
                        </Fragment>
                    )}
                    <div className="ms-2 mt-n1">
                        <h4 className="mb-0 text-truncate-line">
                            {ActiveChatInfo?.name}
                            {(mentors.includes(activeThread?.userId) && ActiveChatInfo?.mobile) && <GKTooltip tooltipText={ActiveChatInfo?.mobile}>
                                <span className="text-muted fe fe-info ms-1 fs-6" />
                            </GKTooltip>}
                        </h4>
                        <span
                            className="text-truncate-line"
                            style={{ maxWidth: hideChatBox ? '150px' : 'unset' }}
                        >
                            {activeThread?.type === 'user' ? (
                                ActiveChatInfo?.status
                            ) : (
                                <Fragment>
                                    {ActiveChatInfo?.groupMembers
                                        ?.filter((user) => user.id !== loggedInUserId)
                                        .map((user) => user.name)
                                        .join(', ') + ', '}
                                    You
                                </Fragment>
                            )}
                        </span>
                    </div>
                </div>
                <div className="d-flex">
                    {/* show a tag whether this chat is of mentors or not */}
                    {mentors.includes(activeThread?.userId) && (
                        <span className="badge bg-info ms-2">Mentor</span>
                    )}
                </div>
            </div>
        </div>
    );
};
export default ChatHeader;
