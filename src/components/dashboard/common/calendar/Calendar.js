// import node module libraries
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

// import full calendar and it's plugins
import { gql, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { SubOrgContext } from '../../../../context/Context';
import { useMediaQuery } from 'react-responsive';
import AddEditEvent from './AddEditEvent';
import CalendarSidebar from './CalendarSidebar';



const GET_SUB_ORG_ID = gql`
    query getSubOrgId($sub_org: String = "", $org_url: String = "") {
        sub_org(where: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}) {
            id
        }
    }
`;


const GET_EVENTS_SUBORG_ALL = gql`
query eventsInSubOrg($sub_org: String = "", $domain: String = "") {
    calendar_events(where: {visibility: {_eq: "all"},userByuserId: {organisations: {sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $domain}}}}}, sub_org_events: {name: {_eq: $sub_org}}}) {
      id
      start_date
      title
      created_by
      userByuserId {
        user_details(where: {organisation: {domain: {_eq: $domain}}}) {
            username
        }
        email
      }
      description
      end_date
      event_type
      location
      url
    }
  }  
`

const GET_EVENTS_SUBORG = gql`
    query eventsInSubOrg($sub_org: String = "", $domain: String = "") {
        calendar_events(where: {userByuserId: {organisations: {sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $domain}}}}}, sub_org_events: {name: {_eq: $sub_org}}}) {
            id
            start_date
            title
            created_by
            userByuserId {
                email
                user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                    username
                }
            }
            description
            end_date
            event_type
            location
            url
        }
    }  
`

const GET_CUSTOM_EVENTS_STUDENTS = gql`
    query getCustomEventsOfStudents($student_id: uuid = "", $sub_org_id: uuid = "", $domain: String = "") {
        user_calendar_events(where: {student_id: {_eq: $student_id}, sub_org_id: {_eq: $sub_org_id}}) {
            calendar_event {
                id
                start_date
                title
                created_by
                userByuserId {
                    user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                        username
                    }
                    email
                }
                description
                end_date
                event_type
                location
                url
            }
        }
    }
`

// todo get events based on program enrollments only

const Calendar = () => {

    const { user } = useAuth0()
    const userId = user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]

    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    console.log('CurrentDashboard', CurrentDashboard);

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [showEventOffcanvas, setShowEventOffcanvas] = useState(false);
    const [isEditEvent, setIsEditEvent] = useState(false);
    const [calendarApi, setCalendarApi] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState();
    const [refetchCalendar, setRefetchCalendar] = useState(false);

    const { data: sub_org_id } = useQuery(GET_SUB_ORG_ID, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
        },
    });

    const { data: orgEvents } = useQuery(CurrentDashboard === "Student"?GET_EVENTS_SUBORG_ALL:GET_EVENTS_SUBORG, {
        variables: {
            sub_org: sub_org_name,
            domain: window.location.origin
        }
    })
    const { data: customEventsOfStudents } = useQuery(GET_CUSTOM_EVENTS_STUDENTS, {
        variables: {
            student_id: userId,
            sub_org_id: sub_org_id?.sub_org[0]?.id,
            domain: window.location.origin
        }
    })

    const [custEvents, setCustEvents] = useState([])

    useEffect(() => {
        if (orgEvents && orgEvents.calendar_events) {
            setCustEvents(orgEvents.calendar_events.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start_date,
                end: event.end_date,
                allDay: false,
                url: event.url,
                extendedProps: {
                    category: event.event_type,
                    location: event.location,
                    description: event.description,
                },
            })));
        }

        if(customEventsOfStudents && customEventsOfStudents.user_calendar_events){
            setCustEvents(prev => [
                ...prev,
                ...customEventsOfStudents.user_calendar_events.map(event => ({
                    id: event.calendar_event.id,
                    title: event.calendar_event.title,
                    start: event.calendar_event.start_date,
                    end: event.calendar_event.end_date,
                    allDay: false,
                    url: event.calendar_event.url,
                    extendedProps: {
                        category: event.calendar_event.event_type,
                        location: event.calendar_event.location,
                        description: event.calendar_event.description,
                    }
                }))
            ])
        }

    }, [orgEvents, calendarApi,customEventsOfStudents]);

    // Methods / Functions
    const handleCloseEventOffcanvas = () => setShowEventOffcanvas(false);

    // Calendar Refs
    const calendarRef = useRef(null);

    // useEffect hook to check calendarApi Update
    useEffect(() => {
        if (calendarApi === null) {
            setCalendarApi(calendarRef?.current?.getApi());
        }
    }, [calendarApi]);

    // Blank Event Object
    const blankEvent = {
        title: '',
        start: new Date(),
        end: new Date(new Date().getTime() + 30 * 60000),
        allDay: false,
        url: '',
        extendedProps: {
            category: '',
            location: '',
            description: ''
        }
    };

    // Calendar Options or Properties
    const calendarOptions = {
        ref: calendarRef,
        events: custEvents,
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        initialView: 'dayGridMonth',
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
            dayGridMonth: {
                buttonText: 'Month',
            },
            timeGridDay: {
                buttonText: 'Day'
            },
        },
        buttonText: {
            today: 'Today',
        },
        headerToolbar: {
            right: 'dayGridMonth,timeGridDay prev,next today'
        },
        droppable: false,
        editable: true,
        eventResizableFromStart: true,
        dayMaxEvents: 5,
        navLinks: true,
        eventClick(info) {
            info.jsEvent.preventDefault();
            setIsEditEvent(true);
            setShowEventOffcanvas(true);
            setSelectedEvent(info.event);
        },
        dateClick(info) {
            const ev = blankEvent;
            var date = new Date(info.date);
            date.setDate(date.getDate() + 1);
            ev.start = info.date;
            ev.end = new Date(info.date.getTime() + 30 * 60000);
            setSelectedEvent(ev);
            setIsEditEvent(false);
            setShowEventOffcanvas(true);
        },
        eventClassNames({ event: calendarEvent }) {
            return [`text-white bg-${calendarEvent.extendedProps.category}`];
        }
    };

    useEffect(() => {
        console.log('selectedEvent',selectedEvent);
        console.log('orgEvents',orgEvents);
    }, [selectedEvent]);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <Fragment>
            <Row className={'g-lg-4 g-3 ' + (isMobile && 'm-n3')}>
                {!isMobile && <Col lg={9}>
                    <Card>
                        <FullCalendar {...calendarOptions} />
                    </Card>
                </Col>}
                <Col lg={3}>
                    <div>
                        {(CurrentDashboard === 'Super Admin' || CurrentDashboard === 'Instructor') &&
                            <Button
                                onClick={() => {
                                    const ev = blankEvent;
                                    var date = new Date(new Date());
                                    date.setDate(date.getDate() + 1);
                                    ev.start = new Date();
                                    ev.end = new Date(new Date().getTime() + 30 * 60000);
                                    setSelectedEvent(ev);
                                    setIsEditEvent(false);
                                    setShowEventOffcanvas(true);
                                }}
                                className='w-100 mb-4'
                            >
                                Create new Events
                            </Button>
                        }

                        <AddEditEvent
                            show={showEventOffcanvas}
                            setShowEventOffcanvas={setShowEventOffcanvas}
                            onHide={handleCloseEventOffcanvas}
                            calendarApi={calendarApi}
                            isEditEvent={isEditEvent}
                            selectedEvent={selectedEvent}
                            setRefetchCalendar={setRefetchCalendar}
                            refetchCalendar={refetchCalendar}
                        />
                    </div>
                    <CalendarSidebar refetchCalendar={refetchCalendar} />
                </Col>
            </Row>
        </Fragment>
    );
};

export default Calendar;
