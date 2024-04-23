import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { SubOrgContext } from '../../../../context/Context';
import useSendNotification from '../../../../hooks/useSendNotification';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Flatpickr from "react-flatpickr";
import Select from 'react-select';
import { NotificationHistory } from './NotificationHistory';

const GET_ALL_MENTORS_IDS = gql`
    query getAllMentorIds($sub_org_name: String = "", $domain: String = "") {
        user(where: {organisations: {role: {_eq: mentor}, sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}}) {
            id
        }
    }
`;

const GET_ALL_INSTRUCTORS_IDS = gql`
    query getAllMentorIds($sub_org_name: String = "", $domain: String = "") {
        user(where: {organisations: {role: {_eq: instructor}, sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $domain}}}}}) {
            id
        }
    }
`;

const GET_STUDENT_LIST = gql`
    query subOrgStudentsList($sub_org: String = "", $org_url: String = "") {
        organisation_user(where: {role: {_eq: student}, sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}}) {
            user_id
            user {
                email
                user_details(where: {organisation: {domain: {_eq: $org_url}}}) {
                    name
                    username
                }
            }
        }
    }
`;

const GET_PROGRAMS_LIST = gql`
    query subOrgProgramsList($sub_org: String = "", $org_url: String = "") {
        program(where: {sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}}) {
            id
            title
        }
    }
`

const GET_NOTIFICATIONS = gql`
query notificationsLog($sub_org: String = "", $org_url: String = "") {
    notifications(where: {notifications_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}}, order_by: {timestamp: desc}) {
        id
        title
        body
        notifications_sender {
            email
        }
        timestamp
        scheduled_time
    }
}
`;

const DELETE_NOTIFICATION = gql`
    mutation deleteNotification($notification_id: uuid = "") {
        delete_notifications_by_pk(id: $notification_id) {
            id
        }
    }
`

const GET_MENTOR_ASSIGNED_STUDENTS = gql`
    query mentorsAssignedStudentsList($mentor_id: uuid = "", $sub_org: String = "", $org_url: String = "") {
        mentors(where: {mentor_id: {_eq: $mentor_id}, mentors_sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}}) {
            mentors_students {
                organisations(where: {sub_org: {name: {_eq: $sub_org}, organisation: {domain: {_eq: $org_url}}}, role: {_eq: student}}) {
                    user_id
                    user {
                        email
                        user_details(where: {organisation: {domain: {_eq: $org_url}}}) {
                            name
                            username
                        }
                    }
                }
            }
        }
    }
`

const SendNotifications = () => {

    const { user } = useAuth0();

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const { sendNotification } = useSendNotification();

    const haveMentorRole = user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][sub_org_name]?.includes('mentor');
    const haveInstructorRole = user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][sub_org_name]?.includes('instructor');
    const haveAdminRole =user?.["https://hasura.io/jwt/claims"]["sub_org_roles"][sub_org_name]?.includes('super_admin')
    const inMentorRoute = window.location.pathname.includes('/m/');
    const inInstructorRoute = window.location.pathname.includes('/i/');
    const inAdminRoute = window.location.pathname.includes('/a/');

    const isMentor = haveMentorRole && inMentorRoute;
    const isInstructor = haveInstructorRole && inInstructorRoute;
    const isAdmin = haveAdminRole && inAdminRoute;

    const [validated, setValidated] = useState(false);
    const [target, setTarget] = useState('');
    const [targetOption, setTargetOption] = useState(
        isInstructor ? 'Select a program' :
            isMentor ? 'Specific Students(s)' :
                isAdmin ? 'All Students' :
                    '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState('');

    // Add a new state variable for scheduling
    const [scheduleNotification, setScheduleNotification] = useState(false);

    // Add a new state variable for the scheduled time
    const [scheduledTime, setScheduledTime] = useState(null);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const { data: studentListData } = useQuery(GET_STUDENT_LIST, {
        variables: {
            sub_org: sub_org_name,
            org_url: window.location.origin
        },
        
    });

    const { data: programsListData } = useQuery(GET_PROGRAMS_LIST, {
        variables: {
            sub_org: sub_org_name,
            org_url: window.location.origin
        }
    });


    const { data: mentorAssignedStudentsData } = useQuery(GET_MENTOR_ASSIGNED_STUDENTS, {
        variables: {
            mentor_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org: sub_org_name,
            org_url: window.location.origin
        },
        
    });

    const { data: mentorIdsData } = useQuery(GET_ALL_MENTORS_IDS, {
        variables: {
            sub_org_name: sub_org_name,
            domain: window.location.origin
        },
        
    });

    const { data: instructorIdsData } = useQuery(GET_ALL_INSTRUCTORS_IDS, {
        variables: {
            sub_org_name: sub_org_name,
            domain: window.location.origin
        },
        
    });


    let studentList = isMentor ? mentorAssignedStudentsData?.mentors.flatMap(m => m.mentors_students ? m.mentors_students.organisations : []) : studentListData?.organisation_user;

    const { loading: notificationsLoading, error: notificationsError, data: notificationsData, refetch: notificationLogsRefetch } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name
        },
        
    });

    const [deleteNotification] = useMutation(DELETE_NOTIFICATION, {
        
        onCompleted: () => notificationLogsRefetch()
    });

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleBodyChange = (event) => {
        setBody(event.target.value);
    };

    const handleTargetOptionChange = (event) => {
        setTargetOption(event.value);
    };

    const handleUsersChange = (selectedOptions) => {
        // setSelectedUsers(Array.from(event.target.selectedOptions, option => option.value));
        setSelectedUsers(selectedOptions.map(option => option.value));
    };

    const handleProgramChange = (selectedOptions) => {
        // setSelectedProgram(event.target.value);
        setSelectedProgram(selectedOptions.value);
    };

    useEffect(() => {
        setTarget(targetOption === 'Specific Students(s)' ? selectedUsers : selectedProgram);
    }, [targetOption, selectedUsers, selectedProgram]);

    // Add a function to handle changes to the schedule notification option
    const handleScheduleNotificationChange = (event) => {
        setScheduleNotification(event.target.checked);
    };

    const handleSubmit = async (event) => {
        setValidated(true);
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false && target) {
            event.stopPropagation();
        }
        setValidated(true);

        if (form.checkValidity() === true) {
            const title = form.elements.formBasicEmail.value;
            const body = form.elements.formBasicPassword.value;
            let target = [];
            var visibility = 'student';

            if (targetOption === 'All Students') {
                target = ['All Users']
                visibility ='student';
            } else if (targetOption === 'All Mentors') {
                target = mentorIdsData?.user.map(user => 'user:' + user.id);
                visibility = 'mentor';
            } else if (targetOption === 'All Instructors') {
                target = instructorIdsData?.user.map(user => 'user:' + user.id);
                visibility = 'instructor';
            } else if (targetOption === 'Specific Students(s)') {
                target = selectedUsers.map(userId => 'user:' + userId);
                visibility = 'student';
            } else if (targetOption === 'Select a program') {
                // Prefix program UUIDs with 'program:'
                target = ['program:' + selectedProgram];
                visibility = 'student';
            }

            const data = {
                title: title,
                body: body,
                target: target,
                user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'], // Replace with the actual sender ID
                sub_org: sub_org_name,
                domain_scope: window.location.origin,
                scheduled_time: scheduleNotification ? new Date(scheduledTime).toISOString() : null,
                visibility: visibility
            };

            console.log(data)

            await sendNotification({
                variables: data,
                onCompleted: () => {
                    notificationLogsRefetch();
                    setTitle('');
                    setBody('');
                    setTarget('');
                    setTargetOption('');
                    setSelectedUsers([]);
                    setSelectedProgram('');
                    setScheduleNotification(false);
                    setScheduledTime(null);
                    setValidated(false);
                }
            });
        }
    };

    let options = [];

    if (isInstructor) {
        options.push({ value: 'Select a program', label: 'Select a program' });
    }

    if (isAdmin || isMentor) {
        options.push(
            { value: 'Specific Students(s)', label: 'Specific Students(s)' }
        );
        if (isAdmin) {
            options.push(
                { value: 'All Students', label: 'All Students' },
                { value: 'All Mentors', label: 'All Mentors' },
                { value: 'All Instructors', label: 'All Instructors' }
            );
        }
    }

    if (isMentor && studentList?.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <h4 className="text-center mb-0 text-primary">
                        You have not been assigned to any students yet.
                    </h4>
                </Card.Body>
            </Card>
        )
    }

    return (
        <div>
            <Card className="mb-4">
                <Card.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Notification Title</Form.Label>
                                    <Col>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Title"
                                            required
                                            value={title}
                                            onChange={handleTitleChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please enter title.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Notification Body</Form.Label>
                                    <Col>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter Body"
                                            required
                                            value={body}
                                            onChange={handleBodyChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please enter body.
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Label>Notification Target</Form.Label>
                                    <Select
                                        className='mb-4'
                                        options={options}
                                        defaultValue={isAdmin ? options.find(option => option.value === 'All Students') : options[0]}
                                        onChange={handleTargetOptionChange}
                                        isDisabled={isInstructor || isMentor}
                                    />
                                    {targetOption === 'Specific Students(s)' && (
                                        <Select
                                            options={studentList?.map(user => ({ value: user.user_id, label: user.user.email }))}
                                            onChange={handleUsersChange}
                                            isMulti
                                            className='mb-3'
                                        />
                                    )}
                                    {isInstructor && (
                                        <Select
                                            options={programsListData?.program.map(program => ({ value: program.id, label: program.title }))}
                                            onChange={handleProgramChange}
                                            className='mb-3'
                                        />
                                    )}
                                </Form.Group>

                                <Form.Group className="my-3" controlId="formScheduleNotification">
                                    <Form.Check
                                        type="checkbox"
                                        label="Schedule with specific date & time"
                                        checked={scheduleNotification}
                                        onChange={handleScheduleNotificationChange}
                                    />
                                </Form.Group>

                                {/* Conditionally render the scheduling options based on the state of the schedule notification option */}
                                {scheduleNotification && (
                                    <Form.Group className="mb-3" controlId="formScheduledTime">
                                        <Row>
                                            <Col lg={'auto'} className="d-flex align-items-center">
                                                <Form.Label className='mb-0'>Scheduled Time</Form.Label>
                                            </Col>
                                            <Col lg={'auto'}>
                                                <Flatpickr
                                                    placeholder="Select Date & Time"
                                                    className="form-control"
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d     |     h:i K',
                                                        defaultDate: new Date(),
                                                    }}
                                                    onChange={date => setScheduledTime(date[0].toISOString())}
                                                    defaultValue={new Date()}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please select a time.
                                                </Form.Control.Feedback>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                )}
                                <div className='mt-4'>
                                    <Button variant="primary" type="submit" disabled={!title || !body}>
                                        Send Notification
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                    </Form>
                </Card.Body>
            </Card>
            <NotificationHistory
                notificationLogsRefetch={notificationLogsRefetch}
                notificationsLoading={notificationsLoading}
                notificationsError={notificationsError}
                notificationsData={notificationsData}
                deleteNotification={deleteNotification}
            />
        </div>
    );
};

export default SendNotifications;
