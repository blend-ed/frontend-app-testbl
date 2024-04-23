// import node module libraries
import { Fragment, useEffect, useState } from 'react';
import {
    Button,
    Col,
    Dropdown,
    Image,
    Nav,
    Placeholder,
    Row
} from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

// import simple bar scrolling used for notification item scrolling
import 'simplebar/dist/simplebar.min.css';

import { gql, useQuery } from '@apollo/client';
import useUserDetails from '../../../hooks/useUserDetails';
import Notifications from '../../../layouts/Notifications';
import { AdminDashboardMenu } from '../../../routes/dashboard/AdminDashboard';
import { InstructorDashboardMenu } from '../../../routes/dashboard/InstructorDashboard';
import { MentorDashboardMenu } from '../../../routes/dashboard/MentorDashboard';
import { StudentDashboardMenu } from '../../../routes/dashboard/StudentDashboard';
import { ProfileDropdown } from '../ProfileDropdown';

const GET_SUPPORT = gql`
query supportDetails($_eq: String = "") {
    organisation(where: {domain: {_eq: $_eq}}) {
      support_mail
      support_phone
    }
  }
`;

const NavbarTop = ({ showChatDrawer }) => {

    const { userDetails } = useUserDetails();

    const location = useLocation();
    
    const [support, setSupport] = useState({
        support_mail: '',
        support_phone: ''
    })

    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    const DashboardMenu = CurrentDashboard === 'Super Admin' ? AdminDashboardMenu
        : CurrentDashboard === 'Instructor' ? InstructorDashboardMenu
            : CurrentDashboard === 'Mentor' ? MentorDashboardMenu
                : StudentDashboardMenu

    const { data: supportData } = useQuery(GET_SUPPORT, {
        variables: {
            _eq: window.location.origin
        },
        onError: (error) => {
            console.log(error)
        }
    })

    useEffect(() => {
        if (supportData && supportData.organisation) {
            setSupport({
                support_mail: supportData.organisation[0].support_mail,
                support_phone: supportData.organisation[0].support_phone
            })
        }
    }, [supportData])

    const dashboardData = {
        avatar: userDetails?.profile_image,
        name: userDetails?.name,
    };

    return (
        <Fragment>
            <div className='w-100'>
                <Row className="align-items-center">
                    <Col xl={12} lg={12} md={12} sm={12}>
                        <div className="navbar-default d-flex justify-content-between pe-4 rounded-none shadow-sm py-2">
                            <div className="d-flex align-items-center">
                                <h4 className='mb-0 text-gray-500 ms-4'>
                                    {DashboardMenu.find(item => location.pathname.includes(item.link))?.title}
                                </h4>
                            </div>
                            <div className='d-flex align-items-center'>
                                {CurrentDashboard === 'Super Admin' && <div className='me-4'>
                                    <Dropdown className='ms-2' as={Nav.Item}>
                                        <Dropdown.Toggle as={Nav.Link} className='dropdown-toggle-arrow-hide'>
                                            <Button variant='light' size='sm' className='d-flex align-items-center'>
                                                <span className='me-2 fe fe-help-circle' />
                                                Help & Support
                                            </Button>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href='https://www.youtube.com/playlist?list=PLG_Grn4iWuY1WJkQX-P8-u4ztssEzSGnV' target='_blank'>
                                                <span className='fe fe-video me-2' />
                                                Tutorials
                                            </Dropdown.Item>
                                            <Dropdown.Item href='https://colab.blend-ed.com/auth/oauth2_basic?origin=/new-topic?category=ticket' target='_blank'>
                                                <span className='fe fe-life-buoy me-2' />
                                                Raise a Ticket
                                            </Dropdown.Item>
                                            <Dropdown.Item href='https://colab.blend-ed.com/auth/oauth2_basic?origin=/new-topic?category=feature-request' target='_blank'>
                                                <span className='fe fe-message-square me-2' />
                                                Request a Feature
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>}
                                {(CurrentDashboard === 'Student' && support && support.support_mail?.length > 1) && <div className='me-4'>
                                    <Dropdown className='ms-2' as={Nav.Item}>
                                        <Dropdown.Toggle as={Nav.Link} className='dropdown-toggle-arrow-hide'>
                                            <Button variant='light' size='sm' className='d-flex align-items-center'>
                                                <span className='me-2 fe fe-help-circle' />
                                                Help
                                            </Button>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className='my-2'>
                                            <Dropdown.Header className='fw-semi-bold text-primary'>
                                                Technical Support
                                            </Dropdown.Header>
                                            <Dropdown.ItemText className='text-nowrap d-flex align-items-center'>
                                                <span className='fe fe-phone me-2' />
                                                {support.support_phone}
                                            </Dropdown.ItemText>
                                            <Dropdown.ItemText className='text-nowrap d-flex align-items-center'>
                                                <span className='fe fe-mail me-2' />
                                                <a href='mailto: example@blend-ed.com' className='text-primary'>
                                                    {support.support_mail}
                                                </a>
                                            </Dropdown.ItemText>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>}
                                {CurrentDashboard !== 'Super Admin' && <div className='d-flex align-items-center me-3'>
                                    <Notifications CurrentDashboard={CurrentDashboard} />
                                </div>}
                                <div className="me-2 d-flex justify-content-end align-items-center">
                                    {/*  mt-n5  */}
                                    <ProfileDropdown>
                                        {dashboardData.avatar ?
                                            <Image
                                                src={dashboardData.avatar}
                                                className="my-1 avatar rounded-circle border border-4 border-gray"
                                                alt=""
                                            />
                                            :
                                            <Placeholder animation="glow">
                                                <Placeholder xs={4} className='my-1 avatar rounded-circle border border-4 border-gray bg-gray' />
                                            </Placeholder>
                                        }
                                        <h4 className="ms-2 mb-0 fw-normal">
                                            {CurrentDashboard !== 'Student' && <div className={'fs-6 mb-n1 text-primary'}>
                                                {CurrentDashboard}
                                            </div>}
                                            {dashboardData.name ?
                                                dashboardData.name
                                                :
                                                <Placeholder animation="glow">
                                                    <Placeholder xs={4} className='rounded bg-gray' style={{ width: 100 }} />
                                                </Placeholder>
                                            }
                                        </h4>
                                    </ProfileDropdown>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
};

export default NavbarTop;
