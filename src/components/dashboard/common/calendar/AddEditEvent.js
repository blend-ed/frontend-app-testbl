// import node module libraries
import { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import ICalendarLink from "react-icalendar-link";
import { v4 as uuid } from 'uuid';

// import custom components
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import Select from 'react-select';
import { SubOrgContext } from '../../../../context/Context';
import { toast } from 'react-toastify';
import useSendNotification from '../../../../hooks/useSendNotification';


const MENTOR_STUDENTS = gql`
	query MyQuery($mentor_id: uuid = "", $sub_org: String = "", $org_url: String = "") {
		mentors(where: {mentor_id: {_eq: $mentor_id}, mentors_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}}) {
			student_id
		}
	}
`

const ADD_EVENT = gql`
mutation addEvent($description: String = "", $end_date: String = "", $event_type: String = "", $location: String = "", $start_date: String = "", $title: String = "", $user_id: uuid = "", $url: String = "", $sub_org: uuid = "", $visibility: String = "") {
  insert_calendar_events(objects: {description: $description, end_date: $end_date, event_type: $event_type, location: $location, start_date: $start_date, title: $title, created_by: $user_id, url: $url, sub_org: $sub_org, visibility: $visibility}) {
    returning {
      id
    }
  }
}
`

const UPDATE_EVENT = gql`
	mutation updateEvent($description: String = "", $end_date: String = "", $event_type: String = "", $location: String = "", $start_date: String = "", $title: String = "", $event_id: uuid = "", $url: String = "") {
		update_calendar_events(where: {id: {_eq: $event_id}}, _set: {description: $description, end_date: $end_date, event_type: $event_type, location: $location, start_date: $start_date, title: $title, url: $url}) {
			affected_rows
		}
	}
`

const DELETE_EVENT = gql`
	mutation MyMutation($id: uuid = "") {
		delete_calendar_events_by_pk(id: $id) {
			title
			id
		}
	}
`

const ADD_CUSTOM_EVENT = gql`
mutation customEven($event_id: uuid = "", $student_id: uuid = "", $sub_org_id: uuid = "") {
    insert_user_calendar_events(objects: {event_id: $event_id, student_id: $student_id, sub_org_id: $sub_org_id}) {
      affected_rows
    }
  }
`

const GET_SUB_ORG_ID = gql`
    query getSubOrgId($sub_org: String = "", $org_url: String = "") {
        sub_org(where: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}) {
            id
        }
    }
`;

const STUDENT_IDS_OF_EVENT = gql`
    query studentIdOfEvent($event_id: uuid = "") {
        calendar_events(where: {id: {_eq: $event_id}}) {
            student_calendar_events {
                student_id
            }
        }
    }
`;

const DELETE_A_CUSTOM_EVENT = gql`
  mutation deleteAnEvent($student_id: uuid = "", $event_id: uuid = "") {
        delete_user_calendar_events(where: {student_id: {_eq: $student_id}, event_id: {_eq: $event_id}}) {
            affected_rows
        }
    }
`;

const GET_STUDENTS_UNDER_INSTRUCTOR = gql`
query getStudentsUnderInstructor($instructor_id: uuid = "", $sub_org_id: uuid = "", $_eq: org_user_role_enum = student) {
  program_enrollment(where: {program: {created_by: {_eq: $instructor_id}}, userByUserId: {organisations: {role: {_eq: $_eq}, sub_org_id: {_eq: $sub_org_id}}}}, distinct_on: user_id) {
    userByUserId {
      email
      id
    }
  }
}
`

const AddEditEvent = (props) => {
    const {
        show,
        onHide,
        isEditEvent,
        selectedEvent,
        calendarApi,
        setShowEventOffcanvas,
        setRefetchCalendar,
        refetchCalendar,
        ...rest
    } = props;
    return (
        <Modal show={show} onHide={onHide} centered {...rest} size='lg'>
            <Modal.Header closeButton className="border-bottom">
                <Modal.Title>
                    {isEditEvent ? 'Edit' : 'Add New'} Event
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EventForm
                    calendarApi={calendarApi}
                    isEditEvent={isEditEvent}
                    selectedEvent={selectedEvent}
                    setShowEventOffcanvas={setShowEventOffcanvas}
                    setRefetchCalendar={setRefetchCalendar}
                    refetchCalendar={refetchCalendar}
                />
            </Modal.Body>
        </Modal>
    );
};

const EventForm = (props) => {
    const { calendarApi, isEditEvent, selectedEvent, setShowEventOffcanvas, setRefetchCalendar, refetchCalendar } = props;

    const { user } = useAuth0();
    const { sendNotification } = useSendNotification();

    const CurrentDashboard = window.location.pathname.includes('/a/') ? 'Super Admin'
        : window.location.pathname.includes('/i/') ? 'Instructor'
            : window.location.pathname.includes('/m/') ? 'Mentor'
                : 'Student'

    const viewOnlyCalendar = CurrentDashboard === 'Student' || CurrentDashboard === 'Mentor'

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    // array of students to show the events for
    const [selectedStudents, setSelectedStudents] = useState([])
    const [previousSelectedStudents, setPreviousSelectedStudents] = useState([]);

     // Initialize all required states for event fields
     const [eventId, setEventId] = useState(selectedEvent && selectedEvent.id);
     const [title, setTitle] = useState(selectedEvent && selectedEvent.title);
     const [description, setDescription] = useState(
         selectedEvent && selectedEvent.extendedProps.description
     );
     const [location, setLocation] = useState(
         selectedEvent && selectedEvent.extendedProps.location
     );
     const [startDate, setDate] = useState(
         new Date(selectedEvent && selectedEvent.start)
     );
     const [endDate, setEndDate] = useState(
         new Date(selectedEvent && selectedEvent.end)
     );
     const [startTime, setStartTime] = useState(
         new Date(selectedEvent && selectedEvent.start)
     )
     const [endTime, setEndTime] = useState(
         new Date(selectedEvent && selectedEvent.end)
     )

     const startdateTime = new Date(startDate)
     startdateTime.setHours(startTime?.getHours() || 0, startTime?.getMinutes() || 0, 0, 0)
     const [isoStartDate, setISOStartDate] = useState(startdateTime.toISOString())
 
     const endDateTime = new Date(endDate)
     endDateTime.setHours(endTime?.getHours() || 0, endTime?.getMinutes() || 0, 0, 0)
     const [isoEndDate, setISOEndDate] = useState(endDateTime.toISOString())

    const { data: sub_org_id } = useQuery(GET_SUB_ORG_ID, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
        },
    });

    const { data: studentListData } = useQuery(GET_STUDENTS_UNDER_INSTRUCTOR, {
        variables: {
            instructor_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            sub_org_id: sub_org_id?.sub_org[0].id,
            role: 'student'
        },
    });

    const { data: studentsInEvent,refetch:refetchStudentInEvents } = useQuery(STUDENT_IDS_OF_EVENT, {
        variables: {
            event_id: eventId
        },
    });

    useEffect(() => {
        console.log('students in event', studentsInEvent);
        console.log('studentListData', studentListData);

        if(studentsInEvent?.calendar_events.length > 0 && studentListData?.program_enrollment.length > 0){
            const students = studentsInEvent.calendar_events[0].student_calendar_events.map(student => student.student_id)
            const selectedStudents = students.map(student => ({ value: student, label: studentListData.program_enrollment.find(user => user.userByUserId.id === student).userByUserId.email }))
            setSelectedStudents(selectedStudents)
            setPreviousSelectedStudents(selectedStudents)
        }
    }, [studentsInEvent,studentListData])  

    useEffect(() => {
        const startdateTime = new Date(startDate)
        startdateTime.setHours(startTime?.getHours() || 0, startTime?.getMinutes() || 0, 0, 0)
        setISOStartDate(startdateTime.toISOString())
    }, [startDate, startTime])

    useEffect(() => {
        const endDateTime = new Date(endDate)
        endDateTime.setHours(endTime?.getHours() || 0, endTime?.getMinutes() || 0, 0, 0)
        setISOEndDate(endDateTime.toISOString())
    }, [endDate, endTime])

    const [category, setCategory] = useState(
        (selectedEvent && selectedEvent.extendedProps.category) || 'success'
    );
    const [url, setURL] = useState(
        selectedEvent && selectedEvent.url
    );

    const event = {
        title: title,
        description: description,
        startTime: startTime,
        endTime: endTime,
        location: location,
        url: url,
        attendees: []
    }

    const editVar = {
        user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
        sub_org: sub_org_id?.sub_org[0].id,
        title: title,
        event_type: category,
        start_date: isoStartDate,
        end_date: isoEndDate,
        location: location,
        description: description,
        url: url,
        visibility: selectedStudents.length > 0 ? 'custom' : 'all'
    }

    const updateVar = {
        event_id: eventId,
        title: title,
        event_type: category,
        start_date: isoStartDate,
        end_date: isoEndDate,
        location: location,
        description: description,
        url: url
    }

    const { data: mentorStudents } = useQuery(MENTOR_STUDENTS, {
        variables: {
            mentor_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            sub_org: sub_org_name,
            org_url: window.location.origin
        }
    })

    const [addCustomEvent] = useMutation(ADD_CUSTOM_EVENT)

    const [addEvent] = useMutation(ADD_EVENT, {
        variables: editVar,
        onCompleted:(data)=>{
            console.log('event added data',data.insert_calendar_events.returning[0].id);
            if(selectedStudents.length > 0){
                selectedStudents.forEach(student => {
                    addCustomEvent({
                        variables: {
                            event_id: data.insert_calendar_events.returning[0].id,
                            student_id: student.value,
                            sub_org_id: sub_org_id?.sub_org[0].id
                        }
                    })
                })
        }}
    },)

  
    const [updateEvent] = useMutation(UPDATE_EVENT, {
        variables: updateVar,
        onCompleted:(data)=>{
            refetchStudentInEvents()
        }
    })

    const [deleteEvent] = useMutation(DELETE_EVENT)
    const [deleteCustomEvent] = useMutation(DELETE_A_CUSTOM_EVENT)

    // Background color options
    let backgroundOptions = [
        { value: 'info', label: 'Event' },
        { value: 'warning', label: 'Reminder' },
        { value: 'primary', label: 'Follow Up' },
    ];

    let targetStudents = []

    if (CurrentDashboard === 'Super Admin') {
        backgroundOptions.push({ value: 'danger', label: 'Holiday' })
        targetStudents = ["All Users"]
    } else if (CurrentDashboard === 'Mentor') {
        targetStudents = mentorStudents?.mentors.map(mentor => mentor.student_id).filter(student => student !== null).map(student => 'user:' + student)
    }

    // Function to manage Event Modal Form submission.
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (isEditEvent) {
            // Execute below code on event editing
            const updatedEventData = {
                id: selectedEvent.id,
                title: title,
                start: isoStartDate,
                endDate: isoEndDate,
                allDay: false,
                url: url,
                extendedProps: {
                    category: category,
                    location: location,
                    description: description
                }
            };
            const propsToUpdate = ['id', 'title'];
            const extendedPropsToUpdate = ['category', 'location', 'description'];
            const existingEvent = calendarApi.getEventById(eventId);

            // Set event properties except date related
            for (let index = 0; index < propsToUpdate.length; index++) {
                const propName = propsToUpdate[index];
                existingEvent.setProp(propName, updatedEventData[propName]);
            }

            // Set date related props
            existingEvent.setDates(
                (new Date(updatedEventData.start)).toISOString(),
                (new Date(updatedEventData.endDate)).toISOString(),
                { allDay: updatedEventData.allDay }
            );

            // Set event's extendedProps
            for (let index = 0; index < extendedPropsToUpdate.length; index++) {
                const propName = extendedPropsToUpdate[index];
                existingEvent.setExtendedProp(
                    propName,
                    updatedEventData.extendedProps[propName]
                );
            }
            await updateEvent()
            toast.success('Event Updated!')
        } else {
            // Execute below code on new event entry
            calendarApi.addEvent({
                id: uuid(),
                title: title,
                start: isoStartDate,
                end: isoEndDate,
                allDay: false,
                url: url,
                extendedProps: {
                    category: category,
                    location: location,
                    description: description,
                }
            });
            console.log('CALENDAR API  ', calendarApi)
            await addEvent()
            // if the students are selected
            toast.success('Event Added!')
            sendNotification({
                variables: {
                    title: editVar.title,
                    body: editVar.description,
                    user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                    target: targetStudents,
                    sub_org: sub_org_name,
                    domain_scope: window.location.origin,
                    scheduled_time: new Date(editVar.start_date).toISOString(),
                    visibility: "student"
                }
            })

        }
        setShowEventOffcanvas(false);
        setRefetchCalendar(!refetchCalendar)
    };

    // Delete event method
    const handleDeleteEvent = () => {
        setShowEventOffcanvas(false);
        deleteEvent({
            variables: {
                id: calendarApi.getEventById(eventId).id
            }
        })
        calendarApi.getEventById(eventId).remove();
        toast.success('Event Deleted!')
    };

    // select the students who wants to see the event
    const handleStudentSelectChange = (selectedStudents) => {
        // an already existing event is being edited, student array is already there
        if(isEditEvent){
            if (selectedStudents && selectedStudents.length > previousSelectedStudents.length) {
                const newStudent = selectedStudents.find(
                    option => !previousSelectedStudents.some(prevOption => option.value === prevOption.value)
                );
                console.log('Newly selected student:', newStudent);
                addCustomEvent({
                    variables: {
                        event_id: eventId,
                        student_id: newStudent.value,
                        sub_org_id: sub_org_id?.sub_org[0].id
                    }
                });
            } else if (previousSelectedStudents.length > (selectedStudents ? selectedStudents.length : 0)) {
                const deselectedStudent = previousSelectedStudents.find(
                    prevOption => !selectedStudents.some(option => option.value === prevOption.value)
                );
                console.log('Deselected student:', deselectedStudent);
                deleteCustomEvent({
                    variables: {
                        student_id: deselectedStudent.value,
                        event_id: eventId
                    }
                });
            }
            setSelectedStudents(selectedStudents);
            setPreviousSelectedStudents(selectedStudents || []);
        
        }else{
            setSelectedStudents(selectedStudents);
        }
    };
    

    // logging things
    useEffect(()=>{
        console.log('studentListData', studentListData?.program_enrollment);
    },[studentListData])

    return (
        <Form onSubmit={handleFormSubmit}>
            {/* Event Title */}
            <Form.Group className="mb-4 d-flex align-items-center" controlId="eventTitle">
                <Form.Label className='fa-regular fa-pencil mb-0 me-3' />
                <Form.Control
                    type="text"
                    placeholder="Add title"
                    name='title'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title || ''}
                    required
                    disabled={viewOnlyCalendar}
                />
            </Form.Group>

            {/* Event Background */}
            {!viewOnlyCalendar && <Form.Group className="mb-4 d-flex align-items-center" controlId="eventBackground">
                <Form.Label className='fa-regular fa-palette mb-0 me-3' />
                <Select
                    placeholder="Select Category"
                    options={backgroundOptions}
                    name='category'
                    value={backgroundOptions.find(option => option.value === category)}
                    onChange={(selectedOption) => setCategory(selectedOption.value)}
                    required
                    isSearchable={false}
                    isDisabled={viewOnlyCalendar}
                    className='w-100'
                />
            </Form.Group>}

            {/* Event Start Date */}
            <Form.Group className="mb-4 d-flex align-items-center" controlId="eventStartDate">
                <Form.Label className='fa-regular fa-clock mb-0 me-3' />
                <div className='me-2'>
                    <Flatpickr
                        value={startDate}
                        placeholder="Select Start Date"
                        className="form-control"
                        name='start_date'
                        disabled={viewOnlyCalendar}
                        options={{
                            dateFormat: 'd-m-Y',
                            monthSelectorType: 'dropdown',
                            yearSelectorType: 'static',
                        }}
                        onChange={(date) => {
                            setDate(date[0]);
                        }}
                    />
                </div>
                <div>
                    <Flatpickr
                        value={startTime}
                        placeholder="Select Start Time"
                        className="form-control"
                        name='start_time'
                        disabled={viewOnlyCalendar}
                        options={{
                            enableTime: true,
                            noCalendar: true,
                            time_24hr: false,
                            dateFormat: 'h:i K',
                        }}
                        onChange={(time) => {
                            setStartTime(time[0]);
                        }}
                    />
                </div>
                <span className='mx-2 fa-solid fa-arrow-right' />
                <div className='me-2'>
                    <Flatpickr
                        value={endDate}
                        placeholder="Select End Date"
                        className="form-control"
                        name='end_date'
                        disabled={viewOnlyCalendar}
                        options={{
                            dateFormat: 'd-m-Y',
                            monthSelectorType: 'dropdown',
                            yearSelectorType: 'static',
                        }}
                        onChange={(date) => {
                            setEndDate(date[0]);
                        }}
                    />
                </div>
                <div>
                    <Flatpickr
                        value={endTime}
                        placeholder="Select End Time"
                        className="form-control"
                        name='end_time'
                        disabled={viewOnlyCalendar}
                        options={{
                            enableTime: true,
                            noCalendar: true,
                            time_24hr: false,
                            dateFormat: 'h:i K',
                        }}
                        onChange={(time) => {
                            setEndTime(time[0]);
                        }}
                    />
                </div>
                <div className='text-nowrap'>
                    {/* show duration in Day, hour and minute */}
                    {Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60 / 60 / 24) % 365) > 0 && <span className='ms-2'>{Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60 / 60 / 24) % 365)} d</span>}
                    {Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60 / 60) % 24) > 0 && <span className='ms-2'>{Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60 / 60) % 24)} h</span>}
                    {Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60) % 60) > 0 && <span className='ms-2'>{Math.floor(((new Date(isoEndDate) - new Date(isoStartDate)) / 1000 / 60) % 60)} m</span>}
                </div>
            </Form.Group>

            {/* Event Location */}
            <Form.Group className="mb-4 d-flex align-items-center" controlId="eventLocation">
                <Form.Label className='fa-regular fa-map-marker-alt mb-0 me-3' />
                <Form.Control
                    type="text"
                    placeholder="Add Location"
                    name='location'
                    value={location || ''}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={viewOnlyCalendar}
                />
            </Form.Group>

            {/* Event Description */}
            <Form.Group className="mb-4 d-flex align-items-center" controlId="eventDescription">
                <Form.Label className='fa-regular fa-align-left mb-0 me-3' />
                <Form.Control
                    as="textarea"
                    placeholder="Type details for this new event"
                    name='description'
                    required
                    rows={3}
                    value={description || ''}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={viewOnlyCalendar}
                />
            </Form.Group>

            {/* Event URL */}
            <Form.Group className="mb-4 d-flex align-items-center" controlId="eventURL">
                <Form.Label className='fa-regular fa-link mb-0 me-3' />
                <Form.Control
                    type="text"
                    name='url'
                    placeholder="Event URL"
                    value={url || ''}
                    onChange={(e) => setURL(e.target.value)}
                    disabled={viewOnlyCalendar}
                />
            </Form.Group>

            {/* select student ids */}
            {!viewOnlyCalendar && <Form.Group className="mb-4 d-flex align-items-center" controlId="eventBackground">
            <Form.Label className='fa-regular fa-users mb-0 me-3' />
            <Select
                    options={studentListData?.program_enrollment?.map(user => ({ value: user.userByUserId.id, label: user.userByUserId.email }))}
                    onChange={handleStudentSelectChange}
                    value={selectedStudents}
                    isMulti
                    className='w-100'
                    isSearchable={true}
                    isDisabled={viewOnlyCalendar}
                    name="students"
                    placeholder="Select Students"
                />  
             
            </Form.Group>}

            <div className="mt-3 text-center">
                {isEditEvent &&
                    <>
                        {url && <Button className={`me-2`} variant='outline-primary' href={url} target="_blank">Open URL<i className='ms-2 fe fe-external-link' /></Button>}
                        <ICalendarLink event={event}>
                            <Button className={`me-2`} variant='outline-primary'>
                                Sync to calendar
                            </Button>
                            {/* button to open link event url in new tab */}
                        </ICalendarLink>
                    </>
                }
                {!isEditEvent && <Button className={`me-2`} variant='outline-primary' onClick={() => { setShowEventOffcanvas(false) }}>
                    Cancel
                </Button>}
                {!viewOnlyCalendar &&
                    <Button type="submit" variant="primary" id="add-new-event-btn">
                        {isEditEvent ? 'Update' : 'Add'} Event
                    </Button>
                }
                {isEditEvent && !viewOnlyCalendar &&
                    <Button className="ms-2" variant="outline-danger" onClick={handleDeleteEvent}>
                        <span className='fe fe-trash me-2' />
                        Delete
                    </Button>
                }
                <Form.Control
                    type="text"
                    id="eventid"
                    name="eventid"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className='d-none'
                />
            </div>
        </Form>
    );
};

export default AddEditEvent;
