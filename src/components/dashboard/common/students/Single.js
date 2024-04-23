import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import WeeklyEngageChart from "components/dashboard/student/dashboard/WeeklyEngageChart";
import AttendanceTable from "components/dashboard/student/learn/programs/single/attendance/AttendanceTable";
import SummaryChart from "components/dashboard/student/progress/SummaryChart";
import WatchTimeChart from "components/dashboard/student/progress/WatchTimeChart";
import { SubOrgContext } from "context/Context";
import useSendNotification from "hooks/useSendNotification";
import { useContext, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import Flatpickr from 'react-flatpickr';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useParams } from "react-router-dom";
import Select from 'react-select';
import { toast } from "react-toastify";
import Avatar from 'assets/images/avatar/avatar.png';

const GET_STUDENT = gql`
    query getUserData($id: uuid, $sub_org: String, $domain: String) {
        organisation_user(where: {role: {_eq: student}, user_id: {_eq: $id}, sub_org: {name: {_eq: $sub_org}}}) {
            user {
                email
                mobile
                user_details(where: {organisation: {domain: {_eq: $domain}}}) {
                    name
                    username
                    profile_image
                }
            }
        }
    }
`;

const GET_PROGRAMS = gql`
    query getPrograms($org_url: String = "", $sub_org_name: String = "", $user_id: uuid = "") {
        program_enrollment(where: {program: {sub_org:{name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $org_url}}}}, user_id: {_eq: $user_id}}) {
            program_id
            program {
                title
            }
        }
    }
`

const ADD_LOGS = gql`
mutation addLogs($contacted_by: uuid, $contacted_user: uuid, $direction: String, $logs: String, $sub_org_id: uuid, $type: String, $time: date = "") {
    insert_logs_one(object: {contacted_by: $contacted_by, contacted_user: $contacted_user, direction: $direction, logs: $logs, sub_org_id: $sub_org_id, type: $type, timestamp: $time}) {
      id
    }
  }  
`;

const GET_SUB_ORG_NAME = gql`
    query getSubOrgName($_eq: String) {
        sub_org(where: {name: {_eq: $_eq}}) {
            id
        }
    }
`;

const GET_MENTOR_LOGS = gql`
query getMentorLogs($sub_org_name: String = "", $student: uuid = "", $_eq: uuid = "") {
    logs(where: {sub_org: {name: {_eq: $sub_org_name}}, contacted_user: {_eq: $student}, contacted_by: {_eq: $_eq}}, order_by: {timestamp: desc}) {
      direction
      logs
      type
      timestamp
    }
  }  
`;

const StudentsSingle = () => {

    const { id } = useParams();

    const { user } = useAuth0();

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const LogTypes = [
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'phone', label: 'Phone' },
        { value: 'envelope', label: 'Email' },
        { value: 'comment', label: 'SMS' },
        { value: 'calendar', label: 'Meeting' },
    ]

    const LogDirections = [
        { value: 'inbound', label: 'Inbound' },
        { value: 'outbound', label: 'Outbound' },
    ];

    const taskTypeOptions = [
        { value: 'Todo', label: 'Todo' },
        { value: 'Email', label: 'Email' },
        { value: 'Call', label: 'Call' },
    ];

    const taskTimeOptions = [
        { value: 'Today', label: 'Today' },
        { value: 'Tomorrow', label: 'Tomorrow' },
        { value: 'Next Week', label: 'Next Week' },
        { value: 'Custom', label: 'Custom Date' },
    ];

    const [programId, setProgramId] = useState(null)
    const [logs, setLogs] = useState(null);
    const [direction, setDirection] = useState(LogDirections[0].value);
    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(false);
    const [type, setType] = useState(LogTypes[0].value);
    const [isChecked, setIsChecked] = useState(false);
    const [taskTime, setTaskTime] = useState('Custom');
    const [taskType, setTaskType] = useState(taskTypeOptions[0].value);
    const [customDate, setCustomDate] = useState(new Date());

    let role = 'student'
    if (location.pathname.includes('/m/')) {
        role = 'mentor';
    } else if (location.pathname.includes('/a/')) {
        role = 'super_admin';
    } else {
        role = 'instructor';
    }

    const handleClose = () => {
        setLogs(null);
        setShow(false);
    }

    // State to manage the visibility of the modal
    const [showModal, setShowModal] = useState(false);

    // Function to handle opening the modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async () => {
        // make sure all fields are filled
        if (!logs || !direction || !time || !type) {
            toast.error('Please fill all fields');
            return;
        }
        await addLogs().then(() => {
            toast.success('Logs added successfully');
            refetchMentorLogs();
            if (isChecked) {
                let time;

                if (taskTime === 'Today') {
                    time = new Date();
                } else if (taskTime === 'Tomorrow') {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    time = tomorrow;
                } else if (taskTime === 'Next Week') {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    time = nextWeek;
                } else if (taskTime === 'Custom') {
                    time = customDate;
                } else {
                    toast.error('Please select a valid time');
                    return;
                }
                scheduleNotification({
                    variables: {
                        body: `Logs Task: [${taskType}] -> ${logs}`,
                        domain_scope: window.location.origin,
                        scheduled_time: time,
                        user_id: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
                        sub_org: sub_org_name,
                        target: [`user:${user?.['https://hasura.io/jwt/claims']['x-hasura-user-id']}`],
                        title: `Logs Task`,
                        visibility: 'mentor'
                    }
                }).then(() => {
                    toast.success('Notification scheduled successfully');
                }).catch((error) => {
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error);
        });
        setLogs(null);
        setIsChecked(false);
        setShow(false);
    }

    const { data, loading } = useQuery(GET_STUDENT, {
        variables: { 
            id: id, 
            sub_org: sub_org_name,
            domain: window.location.origin
        },
    });

    const { scheduleNotification } = useSendNotification();

    const { data: getSubOrgId } = useQuery(
        GET_SUB_ORG_NAME, {
        variables: {
            _eq: sub_org_name
        },
    }
    );

    const subOrgId = getSubOrgId?.sub_org[0]?.id;
    const student = data?.organisation_user;

    const { data: mentorLogs, refetch: refetchMentorLogs } = useQuery(GET_MENTOR_LOGS, {
        variables: {
            sub_org_name: sub_org_name,
            student: id,
            _eq: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id']
        },
        skip: role === 'super_admin' || role === 'instructor'
    });

    const { data: programsData } = useQuery(GET_PROGRAMS, {
        variables: {
            org_url: window.location.origin,
            sub_org_name: sub_org_name,
            user_id: id
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const [addLogs, { loading: addLogsLoading }] = useMutation(ADD_LOGS, {
        variables: {
            contacted_by: user?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            contacted_user: id,
            direction: direction,
            logs: logs,
            sub_org_id: subOrgId,
            type: type,
            time: time
        },
        skip: role === 'super_admin' || role === 'instructor',
    }
    );

    useEffect(() => {
        if (programsData && programsData.program_enrollment && programsData.program_enrollment.length > 0) {
            const firstProgram = programsData.program_enrollment[0];
            setProgramId(firstProgram.program_id);
        }
    }, [programsData]);

    const handleProgramChange = (selectedOption) => {
        setProgramId(selectedOption.value);
    };

    const programOptions = useMemo(() => {
        if (programsData && programsData.program_enrollment) {
            return programsData.program_enrollment.map((program) => ({
                value: program.program_id,
                label: program.program.title,
            }));
        } else {
            return [];
        }
    }, [programsData]);

    const LogButton = ({ type, icon, setShow, setType }) => (
        <Link
            as={Button}
            className="btn btn-muted logs"
            onClick={() => {
                setShow(true);
                setType(type);
            }}
        >
            <i className={`fa-${icon === 'whatsapp' ? 'brands' : 'solid'} fa-${icon} p-2 logs_button`} />
        </Link>
    );

    if (loading) return <p>Loading...</p>;

    return (
        <section>
            <div className="d-flex mb-4 justify-content-between">
                <div className="d-flex">
                    <Button className='btn-light btn-sm px-1 fs-3 fe fe-chevron-left fw-bold me-2 align-self-start'
                        onClick={() => history.back()}
                    />
                    <Image
                        src={student?.[0].user?.user_details?.[0]?.profile_image || Avatar}
                        className="rounded avatar-xxl"
                    />
                    <div className="ms-4">
                        <h1>{student?.[0].user?.user_details?.[0]?.name || student?.[0].user?.user_details?.[0]?.username}</h1>
                        <div className="mb-2">
                            {student?.[0].user?.email && <p className="mb-1"><span className="me-1 fe fe-mail" /> {student?.[0].user.email}</p>}
                            {student?.[0].user?.mobile && <p className="mb-1"><span className="me-1 fe fe-phone" /> {student?.[0].user.mobile}</p>}
                        </div>
                        {role === 'mentor' &&
                            <div className="d-flex align-items-center">
                                <span className="me-2 text-muted">Add Logs</span>
                                {LogTypes.map((log, index) => (
                                    <LogButton key={index} type={log.label} icon={log.value} setShow={setShow} setType={setType} />
                                ))}
                            </div>
                        }
                    </div>
                    {role === 'mentor' && <div>
                        {mentorLogs?.logs?.length > 0 && (
                            <Button onClick={handleOpenModal} size='sm' variant='info' className="mt-2">
                                Show logs
                                <span className="fe fe-file ms-1" />
                            </Button>
                        )}
                    </div>}
                </div>
                {programOptions.length !== 0 && <Row className="align-items-center align-self-end justify-content-end mt-auto">
                    <Col lg={'auto'}>
                        <h3 className='mb-0 text-muted'>Select a Program</h3>
                    </Col>
                    <Col lg={'auto'}>
                        <Select
                            value={programOptions.find(option => option.value === programId)}
                            onChange={handleProgramChange}
                            options={programOptions}
                        />
                    </Col>
                </Row>}
            </div>
            {programOptions.length !== 0 ? <Row>
                <Col lg={8} md={12}>
                    <WeeklyEngageChart studentId={id} mentor />
                    <Card className="mb-4">
                        <AttendanceTable mentor studentId={id} programId={programId} />
                    </Card>
                </Col>
                <Col lg={4} md={12}>
                    <SummaryChart enrolledProgramsData={programsData} selectedProgramId={programId} studentId={id} />
                    <WatchTimeChart userId={id} />
                </Col>
            </Row> :
                <Alert variant={'info'} className="">
                    <p className="mb-0 fs-4 fw-medium">No programs found for this student.</p>
                </Alert>

            }
            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="d-flex align-items-center">
                        Add Logs
                        <Select className="ms-4 fs-5 fw-normal"
                            options={LogTypes}
                            onChange={e => setType(e.value)}
                            placeholder={type}
                            value={LogTypes.find(option => option.value === type)}
                        />
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pb-2">
                    <Row>
                        <Col>
                            <Form.Group className="mb-4" controlId="direction">
                                <Form.Label>Direction</Form.Label>
                                <Select
                                    options={LogDirections}
                                    onChange={selectedOption => setDirection(selectedOption.value)}
                                    defaultValue={LogDirections[0]}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-4 d-block" controlId="time">
                                <Form.Label className="w-100">Date & Time</Form.Label>
                                <Flatpickr
                                    placeholder="Select Date & Time"
                                    className="form-control"
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'd-m-Y H:i',
                                        defaultDate: new Date(),
                                        defaultHour: new Date().getHours(),
                                        defaultMinute: new Date().getMinutes(),
                                        static: true,
                                    }}
                                    onChange={e => {
                                        setTime(e[0]);
                                    }}
                                    defaultValue={new Date()}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-4" controlId="logs">
                        <Form.Label>Logs</Form.Label>
                        <ReactQuill
                            value={logs}
                            onChange={setLogs}
                            placeholder="Enter logs"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between align-items-center">
                    <div>
                        <Form.Group controlId="taskTime">
                            <div className="d-flex align-items-center">
                                <Form.Check
                                    inline
                                    label="Create"
                                    name="task"
                                    className="mr-2"
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                        setIsChecked((isChecked) => !isChecked)
                                        setTaskTime('Today')
                                    }}
                                />
                                <Select
                                    options={taskTypeOptions}
                                    onChange={selectedOption => setTaskType(selectedOption.value)}
                                    value={taskTypeOptions.find(option => option.value === taskType)}
                                />

                                <Select
                                    options={taskTimeOptions}
                                    onChange={selectedOption => setTaskTime(selectedOption.value)}
                                    value={taskTimeOptions.find(option => option.value === taskTime)}
                                    className={"ms-2" + ((!isChecked || taskTime === 'Custom') ? ' d-none' : '')}
                                />
                                <div>
                                    <Flatpickr
                                        hidden={!isChecked || taskTime !== 'Custom'}
                                        placeholder="Select Date & Time"
                                        className="form-control ms-2"
                                        options={{
                                            enableTime: true,
                                            dateFormat: 'd-m-Y H:i',
                                            defaultDate: new Date(),
                                            closeOnSelect: true,
                                        }}
                                        onChange={e => {
                                            setCustomDate(e[0]);
                                        }}
                                    />
                                </div>
                            </div>
                        </Form.Group>
                    </div>
                    <div className="">
                        <Button variant="primary" onClick={handleSubmit}>
                            {addLogsLoading ? <><Spinner animation="grow" size="sm" variant="light" role="status" /> Loading</> : "Submit"}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className='py-2'>
                    <Modal.Title>Logs</Modal.Title>
                </Modal.Header>
                <Modal.Body className='pb-0'>
                    {mentorLogs?.logs.map((log, index) => (
                        <div
                            key={index}
                            className={`d-flex justify-content-between pb-2 ${index !== mentorLogs.logs.length - 1 ? 'border-bottom mb-4' : ''}`}
                        >
                            <div>
                                <h6 className='mb-0'>{log.type}</h6>
                                <p
                                    className='mb-0'
                                    dangerouslySetInnerHTML={{
                                        __html: log.logs
                                    }}
                                ></p>
                            </div>
                            <div>
                                <div className='fs-6'>
                                    <p className='mb-0'>{log.timestamp}</p>
                                    <p className='mb-0'>{log.direction}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer className='fs-6 text-muted py-2 justify-content-center'>
                    <span className='fw-bold'>Note:</span> These logs are only visible to the student and the mentor.
                </Modal.Footer>
            </Modal>
        </section>
    );
}

export default StudentsSingle;