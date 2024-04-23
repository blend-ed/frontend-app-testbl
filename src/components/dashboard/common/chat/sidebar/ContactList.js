// import node module libraries
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ListGroup } from 'react-bootstrap';
import SimpleBar from 'simplebar-react';

// import custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';

// import context file
import { useAuth0 } from '@auth0/auth0-react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { SubOrgContext } from '../../../../../context/Context';

import AvatarImage from '../../../../../assets/images/avatar/avatar.png';

const CREATE_CHATROOM = gql`
	mutation createChatroom($sub_org_id: uuid = "") {
		insert_chatroom_one(object: {sub_org_id: $sub_org_id}) {
			id
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

const GET_SUB_ORG_ID = gql`
	query getSubOrgId($_eq: String = "") {
		sub_org(where: {name: {_eq: $_eq}}) {
			id
		}
	}
`;

const GET_MENTOR_STUDENT_CONTACTS = gql`
    query mentorStudents($_eq: String = "", $mentor_id: uuid = "", $domain: String = "") {
        mentors(where: {mentors_sub_org: {name: {_eq: $_eq}}, mentor_id: {_eq: $mentor_id}}) {
            mentors_students {
                id
                organisations {
                    user {
                        user_details(where: {organisation: {domain: { _eq: $domain }}}) {
                            name
                            profile_image
                        }
                    }
                }
                updated_at
            }
        }
    }	
`;

const GET_INSTRUCTOR_CONTACTS = gql`
    query getInstructor($_eq: String = "", $domain: String = "") {
        organisation_user(where: {sub_org: {name: {_eq: $_eq}}, role: {_eq: instructor}}) {
            user_id
            user {
                updated_at
                user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                    name
                    profile_image
                }
            }
        }
    } 
`;

const GET_MENTOR_CONTACTS = gql`
    query getMentors($_eq: String = "", $domain: String = "") {
        mentors(where: {mentors_sub_org: {name: {_eq: $_eq}}}) {
            mentors_instructors {
                id
                updated_at
                user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                name
                profile_image
                }
            }
        }
    }  
`;

const getOnlineStatus = (updated_at) => {
    const currentTime = new Date();
    const lastUpdatedTime = new Date(updated_at);

    const timeDifference = currentTime.getTime() - lastUpdatedTime.getTime();
    const onlineThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

    return timeDifference <= onlineThreshold ? 'online' : 'offline';
};

const ContactList = ({ usersList, formattedThreadData }) => {
    const { user: loggedInUser } = useAuth0()
    const [usersChatrooms, setUsersChatrooms] = useState({});
    const [activeThread, setActiveThread] = useState(null);
    const [contacts, setContacts] = useState([]);

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const navigate = useNavigate();

    const [createChatRoom] = useMutation(CREATE_CHATROOM);
    const [addMembership] = useMutation(ADD_MEMBERSHIP);
    const { data: subOrgIdData } = useQuery(GET_SUB_ORG_ID, {
        variables: {
            _eq: sub_org_name
        },
        onError: (error) => { console.log(error) }
    });
    const { data: mentorStudentsData } = useQuery(GET_MENTOR_STUDENT_CONTACTS, {
        variables: {
            _eq: sub_org_name,
            mentor_id: loggedInUser['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            domain: window.location.origin
        },
        skip: !location.pathname.includes('/m/')
    });
    const { data: instructorData } = useQuery(GET_INSTRUCTOR_CONTACTS, {
        variables: {
            _eq: sub_org_name,
            domain: window.location.origin
        },
    });
    const { data: mentorData } = useQuery(GET_MENTOR_CONTACTS, {
        variables: {
            _eq: sub_org_name,
            domain: window.location.origin
        },
        onError: (error) => { console.log(error) }
    });

    useEffect(() => {
        const contacts = [];
        if (location.pathname.includes('/m/')) {
            if (mentorStudentsData && instructorData) {
                mentorStudentsData?.mentors?.forEach((student) => {
                    student.mentors_students !== null && contacts.push({
                        id: student.mentors_students.id,
                        name: student.mentors_students.organisations[0].user.user_details[0].name,
                        image: student.mentors_students.organisations[0].user.user_details[0].profile_image,
                        status: getOnlineStatus(student.mentors_students.updated_at)
                    });
                });
                instructorData?.organisation_user?.forEach((instructor) => {
                    contacts.push({
                        id: instructor.user_id,
                        name: instructor.user.user_details[0].name,
                        image: instructor.user.user_details[0].profile_image,
                        status: getOnlineStatus(instructor.user.updated_at)
                    });
                });
                setContacts(contacts);
            }
        } else if (location.pathname.includes('/i/')) {
            if (instructorData && mentorData) {
                instructorData?.organisation_user?.forEach((instructor) => {
                    contacts.push({
                        id: instructor.user_id,
                        name: instructor.user.user_details[0].name,
                        image: instructor.user.user_details[0].profile_image,
                        status: getOnlineStatus(instructor.user.updated_at)
                    });
                });
                mentorData?.mentors?.forEach((mentor) => {
                    contacts.push({
                        id: mentor.mentors_instructors.id,
                        name: mentor.mentors_instructors.user_details[0].name,
                        image: mentor.mentors_instructors.user_details[0].profile_image,
                        status: getOnlineStatus(mentor.mentors_instructors.updated_at)
                    });
                });
                setContacts(contacts);
            }
        } else {
            if (instructorData && mentorData) {
                instructorData?.organisation_user?.forEach((instructor) => {
                    contacts.push({
                        id: instructor.user_id,
                        name: instructor.user.user_details[0].name,
                        image: instructor.user.user_details[0].profile_image,
                        status: getOnlineStatus(instructor.user.updated_at)
                    });
                });
                mentorData?.mentors?.forEach((mentor) => {
                    contacts.push({
                        id: mentor.mentors_instructors.id,
                        name: mentor.mentors_instructors.user_details[0].name,
                        image: mentor.mentors_instructors.user_details[0].profile_image,
                        status: getOnlineStatus(mentor.mentors_instructors.updated_at)
                    });
                });
                setContacts(contacts);
            }
        }
    }, [mentorStudentsData, instructorData, mentorData]);

    useEffect(() => {
        if (formattedThreadData) {
            let chatrooms = formattedThreadData.map((thread) => {
                if (thread.type === 'user') {
                    // return as user id as key and chatroom id as value
                    return { [thread.userId]: thread.id };
                }
                return null;
            });
            chatrooms = chatrooms.filter((chatroom) => chatroom !== null);
            setUsersChatrooms(Object.assign({}, ...chatrooms));
        }
    }, [formattedThreadData]);

    useEffect(() => {
        if (activeThread) {
            navigate(`/${location.pathname.includes('/i/') ? 'i/' : location.pathname.includes('/m/') ? 'm/' : ''}chat/${activeThread}`);
        }
    }, [activeThread]);

    let data = (contacts ? Object.values(
        contacts?.filter((user, index, self) =>
            user.id !== loggedInUser['https://hasura.io/jwt/claims']['x-hasura-user-id'] &&
            index === self.findIndex((u) => (
                u.id === user.id
            ))
        )
            .sort((a, b) =>
                a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
            )
            .reduce((rearrange, element) => {
                let alphabet = element.name[0];
                if (!rearrange[alphabet])
                    rearrange[alphabet] = { alphabet, record: [element] };
                else rearrange[alphabet].record.push(element);
                return rearrange;
            }, {})
    ) : ([]))

    const handleClick = async (id) => {
        if (usersChatrooms[id]) {
            setActiveThread(usersChatrooms[id]);
            navigate(`/${location.pathname.includes('/i/') ? 'i/' : location.pathname.includes('/m/') ? 'm/' : ''}chat/${id}`);
        } else {
            const chatroomResponse = await createChatRoom({
                variables: {
                    sub_org_id: subOrgIdData?.sub_org[0].id,
                },
            });
            const chatroomId = chatroomResponse.data.insert_chatroom_one.id;

            await addMembership({
                variables: {
                    chatroom_id: chatroomId,
                    member_id: loggedInUser['https://hasura.io/jwt/claims']['x-hasura-user-id'],
                },
            });

            await addMembership({
                variables: {
                    chatroom_id: chatroomId,
                    member_id: id,
                },
            })

            navigate(`/${location.pathname.includes('/i/') ? 'i/' : location.pathname.includes('/m/') ? 'm/' : ''}chat/${chatroomId}`);
        }
    }

    return (
        <SimpleBar style={{ maxHeight: '75vh' }}>
            <ListGroup bsPrefix="list-unstyled" as="ul" className="contacts-list">
                {data.map((item, index) => {
                    return (
                        <ListGroup.Item as="li" bsPrefix=" " key={index}>
                            <div className="bg-light py-1 px-4 border-bottom fw-semi-bold">
                                {item.alphabet}
                            </div>
                            {item.record.map((subItem, subIndex) => {
                                return (
                                    <Link
                                        as={Button}
                                        className="text-link contacts-link"
                                        key={subIndex}
                                        onClick={() => {
                                            handleClick(subItem.id);
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center py-3 px-4 border-bottom">
                                            <div className="d-flex position-relative">
                                                <Avatar
                                                    size="md"
                                                    className="rounded-circle"
                                                    type={subItem.image !== 'false' ? 'image' : 'initial'}
                                                    src={subItem.image || AvatarImage}
                                                    status={subItem.status.toLowerCase()}
                                                    alt={subItem.name}
                                                    name={subItem.name}
                                                />
                                                <div className=" ms-2">
                                                    <h5 className="mb-0">{subItem.name}</h5>
                                                    <p className="mb-0 text-muted text-truncate">
                                                        {subItem.status}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </SimpleBar>
    );
};
export default ContactList;
