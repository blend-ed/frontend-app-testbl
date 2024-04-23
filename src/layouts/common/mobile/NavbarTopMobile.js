// import node module libraries
import {
    NavLink,
    Navbar
} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

// import simple bar scrolling used for notification item scrolling
import 'simplebar/dist/simplebar.min.css';

import { AdminDashboardMenu } from '../../../routes/dashboard/AdminDashboard';
import { InstructorDashboardMenu } from '../../../routes/dashboard/InstructorDashboard';
import { MentorDashboardMenu } from '../../../routes/dashboard/MentorDashboard';
import { StudentDashboardMenu } from '../../../routes/dashboard/StudentDashboard';
import { gql, useQuery } from '@apollo/client';
import { NavbarBottomMenuData } from './NavbarBottomMobile';
import { Streaks } from '../../../components/dashboard/student/dashboard/Streaks';
import { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../context/Context';
import useFeatures from '../../../hooks/useFeatures';

const PROGRAM_NAME = gql`
    query getProgramName($id: uuid = "") {
        program_by_pk(id: $id) {
            title
        }
    }
`;

const GET_STUDENT_NOTIFICATIONS = gql`
	query studentNotifications($user_id: uuid = "", $sub_org: String = "", $org_url: String = "") {
		user_notifications(where: {user_id: {_eq: $user_id}, user_notifications_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}, read_status: {_eq: false}, user_notifications_details: {title: {_nin: ["Attendance Report", "Logs Task"]}}}, order_by: {user_notifications_details: {timestamp: desc}}, limit: 5) {
			id
		}
	}	  
`

const NavbarTopMobile = () => {

    const { id } = useParams();
    const { features } = useFeatures();

    const { user } = useAuth0();

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const { loading, data } = useQuery(PROGRAM_NAME, {
        variables: { id: id }
    });


    const [showStreaks, setShowStreaks] = useState(false);
    const [streakCount, setStreakCount] = useState(0);

    const { data: studentNotifications, refetch: refetchUserNotifications } = useQuery(GET_STUDENT_NOTIFICATIONS, {
        variables: {
            user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name,
            org_url: window.location.origin
        }
    });

    const [hasNewNotifications, setHasNewNotifications] = useState(studentNotifications?.user_notifications.length > 0);


    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    const DashboardMenu = CurrentDashboard === 'Super Admin' ? AdminDashboardMenu
        : CurrentDashboard === 'Instructor' ? InstructorDashboardMenu
            : CurrentDashboard === 'Mentor' ? MentorDashboardMenu
                : StudentDashboardMenu

    const CurrentPathname = window.location.pathname.includes('/program') ? 'Program'
        : window.location.pathname.includes('/discover/single') ? 'Discover Single'
            : window.location.pathname.includes('/payment-invoice') ? 'Payment Invoice'
                : DashboardMenu.find(item => window.location.pathname.includes(item.link))?.title


    useEffect(() => {
        const handleNewMessage = (payload) => {
            console.log('new notification received(ntm)', payload);
            refetchUserNotifications();
            setHasNewNotifications(true);
        };

        messageEventEmitter.on('message', handleNewMessage);

        // Cleanup function to be run when the component is unmounted
        return () => {
            messageEventEmitter.off('message', handleNewMessage);
        };
    }, [refetchUserNotifications]);

    return (
        <Navbar className="shadow-sm py-1 pe-2" sticky='top' bg='white'>
            {CurrentPathname === 'Program' || CurrentPathname === 'Discover Single' || CurrentPathname === 'Payment Invoice' ?
                <Link
                    to={CurrentPathname === 'Program' ? '/learn#programs' :
                        CurrentPathname === 'Discover Single' ? '/discover' :
                            CurrentPathname === 'Payment Invoice' ? '/payment' :
                                '/'
                    }
                    className='text-dark fs-4 fw-medium text-truncate-line py-2'
                >
                    <i className="fe fe-chevron-left fs-4 me-1" />
                    {NavbarBottomMenuData.find(item => window.location.pathname.includes(item.path))?.name &&
                        <span className={`${NavbarBottomMenuData.find(item => window.location.pathname.includes(item.path))?.icon} pe-3 me-3 border-end border-dark`} />
                    }
                    {loading ? <span>Loading...</span> : data?.program_by_pk.title}
                </Link>
                :
                <div className='d-flex align-items-center justify-content-between w-100'>
                    <div className='mb-0 text-dark fs-4 fw-medium'>
                        {NavbarBottomMenuData.find(item => window.location.pathname.includes(item.path))?.name &&
                            <span className={`${NavbarBottomMenuData.find(item => window.location.pathname.includes(item.path))?.icon} me-2`} />
                        }
                        {CurrentPathname}
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='p-2 me-2 fs-4 text-dark' onClick={() => setShowStreaks(!showStreaks)} style={{ cursor: 'pointer' }}>
                            <span className='fa-solid fa-fire-flame-curved text-warning fs-3 me-1 mt-1' />
                            {streakCount}
                            <Streaks show={showStreaks} setShow={setShowStreaks} setCount={setStreakCount} />
                        </div>
                        <div className={`ps-2 me-3 d-flex align-items-center ${hasNewNotifications && 'indicator indicator-xs indicator-primary'}`}>
                            <Link to='/notifications' className={`fe fe-bell fw-bold fs-3 text-dark`} onClick={() => {refetchUserNotifications();setHasNewNotifications(studentNotifications?.user_notifications.length > 0); console.log(studentNotifications?.user_notifications.length > 0)}} />
                        </div>
                        {features?.includes('chat') && <Link to='/chat' className='fe fe-message-circle fw-bold fs-3 text-dark p-2' />}
                    </div>
                </div>
            }
        </Navbar>
    );
};

export default NavbarTopMobile;
