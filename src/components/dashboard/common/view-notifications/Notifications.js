// import node module libraries
import { useContext, useEffect } from 'react';
import {
    Button,
    Card,
    Col,
    ListGroup,
    Row,
    Spinner
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

// import custom components

// import data files
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import GKTooltip from '../../../../components/elements/tooltips/GKTooltip';
import { SubOrgContext } from '../../../../context/Context';

const GET_USER_NOTIFICATIONS = gql`
query userNotifications($user_id: uuid = "", $sub_org: String = "", $org_url: String = "", $user_role: org_user_role_enum = student) {
  user_notifications(where: {user_id: {_eq: $user_id}, user_notifications_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}, user_notifications_details: {visibility: {_eq: $user_role}}}, order_by: {user_notifications_details: {timestamp: desc}}) {
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

const Notifications = () => {

    const { user } = useAuth0();
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

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

    const readNotifications = userNotifications?.user_notifications.filter(item => item.read_status);
    const unreadNotifications = userNotifications?.user_notifications.filter(item => !item.read_status);
    const unreadNotificationsIds = unreadNotifications?.map(item => item.id);

    const [markNotificationAsRead, { data: notificationReadStatus }] = useMutation(MARK_NOTIFICATION_AS_READ)

    const [markAllNotificationsAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ,
        {
            variables: {
                notificationIds: unreadNotificationsIds
            },
            onCompleted: () => {
                refetchUserNotifications();
            }
        })

    useEffect(() => {
        const handleNewMessage = (payload) => {
            console.log('new notification received(vns)', payload);
            refetchUserNotifications();
        };

        messageEventEmitter.on('message', handleNewMessage);

        // Cleanup function to be run when the component is unmounted
        return () => {
            messageEventEmitter.off('message', handleNewMessage);
        };
    }, [refetchUserNotifications]);


    console.log("unreadNotifications", unreadNotificationsIds);

    return (
        <Row className='my-n2 my-lg-0'>
            <Col lg={{ offset: 2, span: 8 }} md={12} sm={12} xs={12}>
                <Row className='g-4 mx-n3'>
                    <Col lg={12} md={12} sm={12}>
                        <div className="mb-2 d-flex align-items-center justify-content-between">
                            <h4 className="mb-0 me-2">
                                New
                                <span className='text-primary'> {unreadNotifications?.length > 0 && unreadNotifications.length}</span>
                            </h4>
                            <div className='d-flex'>

                                <Button variant='light' className="d-flex align-items-center justify-content-center px-2" onClick={() => refetchUserNotifications()}>
                                    {loading ? (
                                        <Spinner animation="border" variant='primary' />
                                    ) : (
                                        <i className="fe fe-refresh-cw fw-bold text-primary" />
                                    )}
                                </Button>

                                {unreadNotifications?.length > 0 &&
                                    <Button variant='light' size='sm' className="d-flex align-items-center justify-content-center px-1 px-lg-2 fs-6 ms-2 text-primary" onClick={() => markAllNotificationsAsRead()}>
                                        Mark all as read
                                    </Button>
                                }
                            </div>


                        </div>
                        <Card className="rounded-3">
                            {unreadNotifications?.length > 0 ? <ListGroup>
                                {unreadNotifications.map((item, index) => {
                                    return (
                                        <ListGroup.Item className={`py-4`} key={index}>
                                            <Row className="align-items-center">
                                                <Col>
                                                    <div className="d-flex align-items-center">
                                                        <div className="mx-lg-3">
                                                            <Link to="#">
                                                                <p className="mb-0 text-body">
                                                                    <span className="fw-bold mb-0 h5">
                                                                        {item.user_notifications_details.title}
                                                                    </span>
                                                                </p>
                                                                <div className='text-muted mb-1'>
                                                                    {item.user_notifications_details.body}
                                                                </div>
                                                            </Link>
                                                            <span className="fs-6 text-muted">
                                                                <span>
                                                                    {
                                                                        new Date(item.user_notifications_details.timestamp).toLocaleString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: 'numeric',
                                                                            minute: 'numeric',
                                                                            hour12: true
                                                                        })
                                                                    }
                                                                </span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col className="col-auto text-center me-2">
                                                    <GKTooltip tooltipText="Mark as Read" >
                                                        <Link to="#" onClick={() => markNotificationAsRead({
                                                            variables: {
                                                                user_notification_id: item.id
                                                            },
                                                            refetchQueries: [{
                                                                query: GET_USER_NOTIFICATIONS,
                                                                variables: {
                                                                    user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                                                                    sub_org: sub_org_name,
                                                                    org_url: window.location.origin,
                                                                    user_role: notificationForRole
                                                                }
                                                            }]
                                                        })}>
                                                            <span className='fe fe-check-circle fs-4 text-primary' />
                                                        </Link>
                                                    </GKTooltip>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                                :
                                <div className='text-center py-lg-5 py-3 border rounded'>
                                    <h4 className='text-muted mb-0'>No new notifications</h4>
                                </div>
                            }
                        </Card>
                    </Col>
                    {readNotifications?.length > 0 &&
                        <Col lg={12} md={12} sm={12}>
                            <div className="mb-2 d-md-flex align-items-center justify-content-between">
                                <h4 className="mb-0 me-2">Early</h4>
                            </div>
                            <Card className="rounded-3">
                                <ListGroup>
                                    {readNotifications.map((item, index) => {
                                        return (
                                            <ListGroup.Item className={`py-3`} key={index}>
                                                <Row className="align-items-center">
                                                    <Col>
                                                        <div className="d-flex align-items-center">
                                                            <div className="mx-lg-3">
                                                                <Link to="#">
                                                                    <p className="mb-0 text-body">
                                                                        <span className="fw-bold mb-0 h5" dangerouslySetInnerHTML={{ __html: item.user_notifications_details.title }} />
                                                                    </p>
                                                                    <div className='text-muted mb-1' dangerouslySetInnerHTML={{ __html: item.user_notifications_details.body }} />
                                                                </Link>
                                                                <span className="fs-6 text-muted">
                                                                    <span>
                                                                        {
                                                                            new Date(item.user_notifications_details.timestamp).toLocaleString('en-IN', {
                                                                                day: 'numeric',
                                                                                month: 'short',
                                                                                year: 'numeric',
                                                                                hour: 'numeric',
                                                                                minute: 'numeric',
                                                                                hour12: true
                                                                            })
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        );
                                    })}
                                </ListGroup>
                            </Card>
                        </Col>
                    }
                </Row>
            </Col>
        </Row>
    );
};

export default Notifications;
