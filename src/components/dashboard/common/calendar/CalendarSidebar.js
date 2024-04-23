import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { SubOrgContext } from "../../../../context/Context";
import { useContext, useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const GET_CALENDAR_EVENTS = gql`
    query getCalendarEvents($sub_org_name: String = "", $domain: String = "") {
        calendar_events(where: {userByuserId: {organisations: {sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}}, sub_org_events: {name: {_eq: $sub_org_name}}}) {
            start_date
            end_date
            title
            url
            location
            description
        }
    }
`;

const CalendarSidebar = (props) => {

    const { user } = useAuth0();
    const ConfigContext = useContext(SubOrgContext);
    const sub_org_name = 'localhost'

    const { refetchCalendar, setRefetchCalendar } = props

    const { loading, error, data, refetch } = useQuery(GET_CALENDAR_EVENTS, {
        variables: {
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            sub_org_name: sub_org_name,
            domain: window.location.origin
        }
    });

    useEffect(() => {
        refetch();
    }, [refetchCalendar])

    const todayEvents = data?.calendar_events?.filter(item => {
        const eventDate = new Date(item.start_date);
        const today = new Date();
        return eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    });

    const otherEvents = data?.calendar_events?.filter(item => {
        const eventDate = new Date(item.start_date);
        const today = new Date();
        return (eventDate > today) && (eventDate.getDate() !== today.getDate() || eventDate.getMonth() !== today.getMonth() || eventDate.getFullYear() !== today.getFullYear());
    });

    return (
        <div>

            <Card className="overflow-hidden mb-lg-4 mb-3 mt-n1 mt-lg-0">
                <Card.Header>
                    <Card.Title as={'h3'} className="mb-0">{new Date().toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-3">
                    {todayEvents?.length === 0 ? <div className="text-center my-3">No events today</div> :
                        todayEvents?.map((item, index) => {
                            const eventDate = new Date(item.start_date);
                            const endDate = new Date(item.end_date);
                            const today = new Date();
                            const isToday = eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
                            const isOver = endDate < today;
                            const duration = (new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60 / 60 > 1 ? `${(new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60 / 60} hour` : `${(new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60} min`
                            const linkParams = item.url && {
                                as: Link,
                                to: item.url,
                                target: "_blank"
                            }

                            return (
                                <div key={index} className="my-3">
                                    <Card className="mb-0 position-relative overflow-hidden" {...linkParams}>
                                        <div className="bg-primary position-absolute top-0 left-0 bottom-0" style={{ width: '.4rem' }} />
                                        <Card.Body className="d-flex align-items-start pb-3 pt-2">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="fs-6">
                                                    {!isToday && <div>{eventDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</div>}
                                                    {new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="fs-6">
                                                    {duration}
                                                </div>
                                            </div>
                                            <div className="ms-4">
                                                <div className="fw-semi-bold fs-4 text-truncate-line-2">{item.title}</div>
                                                <div className="text-muted">{item.location}</div>
                                                {isOver && <div className="text-danger fs-6 mt-2">Meeting is over</div>}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })
                    }
                </Card.Body>
            </Card>
            <Card className="overflow-hidden">
                <Card.Header>
                    <Card.Title as={'h4'} className="mb-0">
                        Upcoming Events
                    </Card.Title>
                </Card.Header>
                <Card.Body className="py-0 px-3">
                    {otherEvents?.length === 0 ? <div className="text-center my-3">No upcoming events</div> :
                        otherEvents?.slice(0, 5).map((item, index) => {
                            const eventDate = new Date(item.start_date);
                            const today = new Date();
                            const isToday = eventDate.getDate() === today.getDate() && eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
                            const duration = (new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60 / 60 > 1 ? `${(new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60 / 60} hour` : `${(new Date(item.end_date) - new Date(item.start_date)) / 1000 / 60} min`
                            const linkParams = item.url && {
                                as: Link,
                                to: item.url,
                                target: "_blank"
                            }

                            return (
                                <div key={index} className="my-3">
                                    <Card className="mb-0 position-relative overflow-hidden" {...linkParams}>
                                        <div className="bg-primary position-absolute top-0 left-0 bottom-0" style={{ width: '.4rem' }} />
                                        <Card.Body className="d-flex align-items-start pb-3 pt-2">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="fs-6">
                                                    {!isToday && <div>{eventDate.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })}</div>}
                                                    {new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className="fs-6">
                                                    {duration}
                                                </div>
                                            </div>
                                            <div className="ms-4">
                                                <div className="fw-semi-bold fs-4 text-truncate-line-2">{item.title}</div>
                                                <div className="text-muted">{item.location}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        })
                    }
                    {otherEvents?.length > 5 && <Button as={Link} to={`/i/calendar`} variant="outline-primary" size="sm" className="w-100 mb-3">View all</Button>}
                </Card.Body>
            </Card>

        </div>
    );
}

export default CalendarSidebar;