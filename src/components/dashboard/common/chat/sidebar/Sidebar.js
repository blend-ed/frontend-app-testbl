// import node module libraries
import { Col, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// import sub custom components
import { useMediaQuery } from 'react-responsive';
import ContactList from './ContactList';
import RecentChatList from './RecentChatList';

const Sidebar = (props) => {
    const { hideChatBox, setHideChatBox, usersList, formattedThreadData, activeThread, chatMessageArray, groupChatList, setActiveThread } = props;

    return (
        <div className="bg-white border-end border-top vh-100">
            {/*  chat list */}
            <div className="chat-window">
                <div className="chat-sticky-header sticky-top bg-white">
                    <div className="px-lg-4 px-3 pt-3 pb-4">
                        {/*  heading */}
                        <div className="d-flex justify-content-between align-items-center">
                            <div className='d-flex align-items-center'>
                                <Link to='/dashboard' className='fe fe-chevron-left fs-3 fw-bold me-2 text-muted d-lg-none' />
                                <h3 className="mb-0 fw-bold">Chat</h3>
                            </div>
                        </div>
                        {/*  search */}
                        <div className="mt-4">
                            <Form.Control
                                type="search"
                                className="form-control form-control-sm"
                                placeholder="Search people, group and messages"
                                aria-label="Search people, group and messages"
                                aria-describedby="search"
                            />
                        </div>
                    </div>
                    {/*  nav tabs*/}
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Tab.Container defaultActiveKey="recent">
                                <Nav className="nav-line-bottom" as="ul">
                                    <Nav.Item as="li">
                                        <Nav.Link eventKey="recent" className="py-2" role="button">
                                            Recent
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li">
                                        <Nav.Link eventKey="contact" className="py-2" role="button">
                                            Contact
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="recent" className="pb-0">
                                        <RecentChatList
                                            hideChatBox={hideChatBox}
                                            setHideChatBox={setHideChatBox}
                                            usersList={usersList}
                                            groupChatList={groupChatList}
                                            formattedThreadData={formattedThreadData}
                                            activeThread={activeThread}
                                            chatMessageArray={chatMessageArray}
                                            setActiveThread={setActiveThread}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="contact" className="pb-0">
                                        <ContactList usersList={usersList} formattedThreadData={formattedThreadData} setActiveThread={setActiveThread} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};
export default Sidebar;
