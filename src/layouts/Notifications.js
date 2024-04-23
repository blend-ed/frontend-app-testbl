// import node module libraries
import { Button, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import data files
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../context/Context';
import { useContext, useEffect } from 'react';

const GET_USER_NOTIFICATIONS = gql`
query studentNotifications($user_id: uuid = "", $sub_org: String = "", $org_url: String = "", $user_role: org_user_role_enum = student) {
  user_notifications(where: {user_id: {_eq: $user_id}, user_notifications_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}, read_status: {_eq: false}, user_notifications_details: {title: {_nin: ["Attendance Report", "Logs Task"]}, visibility: {_eq: $user_role}}}, order_by: {user_notifications_details: {timestamp: desc}}, limit: 5) {
    id
    notification_id
    read_status
    user_notifications_details {
      title
      body
      timestamp
    }
  }
}
`

const MARK_NOTIFICATION_AS_READ = gql`
    mutation markNotificationAsRead($user_notification_id: uuid = "") {
        update_user_notifications_by_pk(pk_columns: {id: $user_notification_id}, _set: {read_status: true}) {
            id
            read_status
        }
    }
`

const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
mutation markAllNotificationsAsRead($notificationIds: [uuid!]!) {
  update_user_notifications(where: {id: {_in: $notificationIds}}, _set: {read_status: true}) {
    affected_rows
  }
}
`

const Notifications = ({ CurrentDashboard }) => {

    const { user } = useAuth0();
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const CurrentPath = CurrentDashboard === 'Super Admin' ? '/a' :
        CurrentDashboard === 'Instructor' ? '/i' :
            CurrentDashboard === 'Mentor' ? '/m' :
                ''

    var notificationForRole;
    if (window.location.pathname.includes('/m/')) {
        notificationForRole = 'mentor';
    } else if (window.location.pathname.includes('/i/')) {
        notificationForRole = 'instructor';
    } else {
        notificationForRole = 'student';
    }

    console.log("notificationForRole", notificationForRole);

    const { loading, error, data: userNotifications, refetch: refetchUserNotifications } = useQuery(GET_USER_NOTIFICATIONS, {
        variables: {
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            sub_org: sub_org_name,
            org_url: window.location.origin,
            user_role: notificationForRole
        }
    })

    const userNotificationIds = userNotifications?.user_notifications.map(item => item.id);

    console.log('userNotificationIds', userNotificationIds);

    const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ)

    const [markAllNotificationsAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ,
        {
            variables: {
                notificationIds: userNotificationIds
            },
            onCompleted: () => {
                refetchUserNotifications();
            }
        })

    const NotificationsBar = () => {
        return (
            <SimpleBar style={{ maxHeight: '300px' }}>
                <ListGroup variant="flush">
                    {userNotifications && userNotifications.user_notifications.slice(0, 5).map(function (item, index) {
                        return (
                            <ListGroup.Item
                                key={index}
                            >
                                <Row>
                                    <Col>
                                        <Link className="text-body" to="/notifications">
                                            <div className="d-flex">
                                                <div className="ms-3">
                                                    <h5 className="fw-bold mb-1">{item.user_notifications_details.title}</h5>
                                                    <p className="mb-0">{item.user_notifications_details.body}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col className="col-auto text-center me-2">
                                        <Link to="#" onClick={() => markNotificationAsRead({
                                            variables: {
                                                user_notification_id: item.id
                                            },
                                            onCompleted: () => refetchUserNotifications()
                                        })}>
                                            <span className='fe fe-check-circle' />
                                        </Link>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </SimpleBar>
        );
    };

    return (
        <Dropdown className=''>
            <Dropdown.Toggle
                as={Button}
                variant='white'
                size='sm'
                bsPrefix=" "
                className={`fs-4 rounded-circle py-1 px-2 shadow-sm card-hover ${userNotifications?.user_notifications.length > 0 && 'indicator indicator-primary'} `}
                id="dropdownNotification"
            >
                <span className="fe fe-bell"></span>
            </Dropdown.Toggle>
            <Dropdown.Menu
                show={false}
                className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-end mt-3 py-0"
                aria-labelledby="dropdownNotification"
                align="end"
            >
                <div className="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                    <span className="h5 mb-0">Notifications</span>
                    <div>
                        <Link to="#" onClick={() => refetchUserNotifications()}>
                            <i className="fe fe-refresh-cw"></i>
                        </Link>
                        {userNotifications?.user_notifications.length > 0 &&
                            <Button variant='white' size='sm' className='text-primary fs-6' onClick={() => {
                                markAllNotificationsAsRead();
                            }} >
                                Mark all as read
                            </Button>
                        }
                    </div>
                </div>
                {userNotifications?.user_notifications.length > 0 ?
                    <NotificationsBar /> :
                    <div className="px-3 py-5">
                        <p className="mb-0 text-center text-muted">No new notifications</p>
                    </div>
                }
                <div className="border-top px-3 py-2 text-center">
                    <Link
                        to={CurrentPath + "/notifications"}
                        className="text-link fs-6"
                    >
                        See all notifications
                        <span className="fe fe-arrow-right ms-2" />
                    </Link>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Notifications;