// import node module libraries
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

// import custom components
import { Avatar } from '../../../../../components/elements/bootstrap/Avatar';

import { useAuth0 } from '@auth0/auth0-react';
import { gql, useMutation, useQuery } from '@apollo/client';

const DELETE_MESSAGE = gql`
mutation deleteMessage($_eq: uuid = "") {
	delete_messages(where: {id: {_eq: $_eq}}) {
	  affected_rows
	}
  }
`;

const UPDATE_FLAG = gql`
mutation updateFlag($id: uuid = "", $flag: String = "") {
	update_ai_chat_by_pk(pk_columns: {id: $id}, _set: {flag: $flag}) {
	  flag
	}
  }
`;

const AI_MESSAGES = gql`
query aiMessages($_eq: uuid = "") {
	ai_chat(where: {user_id: {_eq: $_eq}}) {
	  id
	  flag
	}
  }
`;

const Message = (props) => {
    const { chatScript, usersList, drawer, activeId } = props;
    const [aiMessages, setAiMessages] = useState({})

    const { user: loggedInUser } = useAuth0()

    const loggedInUserId = loggedInUser['https://hasura.io/jwt/claims']['x-hasura-user-id']
    const [deleteMessage] = useMutation(DELETE_MESSAGE)
    const [updateFlag] = useMutation(UPDATE_FLAG)
    const { data: aiChat, refetch } = useQuery(AI_MESSAGES, {
        variables: {
            _eq: loggedInUserId
        },
        skip: activeId !== 'ai'
    })

    const getUserDetailsById = (userId) => {
        return usersList?.find(({ id }) => id === userId);
    };

    const user = getUserDetailsById(chatScript.userId);

    const handleDelete = (id) => {
        deleteMessage({
            variables: {
                _eq: activeId
            }
        })
    }

    const handleFlag = (id, flag) => {
        updateFlag({
            variables: {
                id,
                flag
            }
        })
        refetch()
    };

    useEffect(() => {
        if (aiChat) {
            const messages = {}
            aiChat.ai_chat.map((item) => {
                messages[item.id] = item.flag
            })
            setAiMessages(messages)
        }
    }, [aiChat])

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            to=""
            ref={ref}
            className="text-link"
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </Link>
    ));

    const ActionMenu = ({ position, id }) => {
        return (
            <Dropdown drop={position}>
                <Dropdown.Toggle as={CustomToggle}>
                    <i className="fe fe-more-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="start">
                    <Dropdown.Item eventKey="1" className="px-3"
                        onClick={() => {
                            handleDelete(id)
                        }
                        }>
                        <i className="fe fe-trash dropdown-item-icon"></i> Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const FlagMenu = ({ position, id }) => {
        return (
            <Dropdown drop={position}>
                <Dropdown.Toggle as={CustomToggle}>
                    <i className="fe fe-more-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="start">
                    <Dropdown.Item eventKey="1" className="px-3"
                        onClick={() => {
                            handleFlag(id, 'good')
                        }
                        }>
                        Good <i className={`fa${aiMessages[id] === 'good' ? 's' : 'r'} fa-thumbs-up dropdown-item-icon ms-2`}></i>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2" className="px-3"
                        onClick={() => {
                            handleFlag(id, 'bad')
                        }
                        }>
                        Bad <i className={`fa${aiMessages[id] === 'bad' ? 's' : 'r'} fa-thumbs-down dropdown-item-icon ms-2`}></i>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Fragment>
            {chatScript.userId === loggedInUserId ? (
                <div className="d-flex justify-content-end mb-4">
                    <div className={`d-flex ${!drawer && 'mw-lg-40'}`}>
                        <div className=" me-3 text-end">
                            {!drawer && <small>
                                {' '}
                                {chatScript.date} {chatScript.time}{' '}
                            </small>}
                            <div className="d-flex justify-content-end">
                                {(chatScript.userId === loggedInUserId && activeId !== 'ai') && <div className={`ms-2 ${!drawer && 'mt-2'}`}>
                                    <ActionMenu position="start" id={chatScript.id} />
                                </div>}
                                <div className={`card ${!drawer && 'mt-2'} rounded-top-md-end-0 bg-primary text-white`}>
                                    <div className={`card-body text-start ${drawer ? 'px-3 py-2' : 'p-3'}`}>
                                        <p
                                            className="mb-0"
                                            dangerouslySetInnerHTML={{
                                                __html: chatScript.message
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Avatar
                            size={drawer ? "sm" : "md"}
                            className={`rounded-circle chat-avatar-${drawer ? 'sm' : 'md'}`}
                            type={user?.image !== 'false' ? 'image' : 'initial'}
                            src={user?.image}
                            alt={user?.name}
                            name={user?.name}
                        />
                    </div>
                </div>
            ) : (
                <div className={`d-flex ${!drawer && 'w-lg-40'} mb-4`}>
                    <Avatar
                        size={drawer ? "sm" : "md"}
                        className={`rounded-circle chat-avatar-${drawer ? 'sm' : 'md'}`}
                        type={user?.image !== 'false' ? 'image' : 'initial'}
                        src={user?.image}
                        alt={user?.name}
                        name={user?.name}
                    />
                    <div className=" ms-3">
                        {!drawer && <div>
                            <small className='text-truncate-line'>
                                {user?.name}
                            </small>
                            <small>
                                {chatScript.date} {chatScript.time}{' '}
                            </small>
                        </div>
                        }
                        <div className="d-flex">
                            <div className={`card ${!drawer ? 'mt-2' : 'bg-light-primary'} rounded-top-md-left-0`}>
                                <div className={`card-body ${drawer ? 'px-3 py-2' : 'p-3'}`}>
                                    <p
                                        className="mb-0 text-dark"
                                        dangerouslySetInnerHTML={{
                                            __html: chatScript.message
                                        }}
                                    />
                                </div>
                            </div>
                            {chatScript.userId === 'ai' && <div className={`ms-2 ${!drawer && 'mt-2'}`}>
                                <FlagMenu position="end" id={chatScript.id} />
                            </div>}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
};
export default Message;
