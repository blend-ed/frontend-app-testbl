// import node module libraries
import { gql, useMutation, useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import ProgramCardPlaceholder from "../../../../../assets/images/background/program-cover-img.png";
import { SubOrgContext } from "../../../../../context/Context";
import usePrograms from '../../../../../hooks/usePrograms';
import PropTypes from "prop-types";
import React, { Fragment, useContext, useState } from "react";
import {
    Button,
    Card,
    Dropdown,
    Image,
    Modal,
    ProgressBar
} from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const UNENROLL_USER = gql`
    mutation user_unenroll($program_id: uuid = "", $username: String = "", $org_url: String) {
        userUnenroll(program_id: $program_id, username: $username, org_url: $org_url) {
            err_msg
            status
        }
    }  
`;

const GET_PROGRESS = gql`
    query getCourseProgress($org_url: String = "", $username: String = "", $program_id: uuid = "") {
        courseProgress(org_url: $org_url, program_id: $program_id, username: $username) {
            course_progress
            program_progress
            err_msg
        }
    }
`;

const StudentProgramCard = ({ item, extraclass, refetch }) => {

    const ConfigContext = useContext(SubOrgContext)
    const org = 'localhost'?.replace(/[^a-z0-9]/gi, '').toLowerCase()

    const { user } = useAuth0();
    const sub_org_plans = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"]

    const [isUnenrolling, setIsUnenrolling] = useState(false);

    var ORG = org;
    if (sub_org_plans['localhost'] == 'Free') {
        ORG = window.location.origin === 'http://localhost:3000' ? 'localhost' : 'blended'
    }

    const [show, setShow] = useState(false);

    const handleShow = () => {
        setIsUnenrolling(true);
        setShow(true);
    };

    const handleClose = () => {
        setIsUnenrolling(false);
        setShow(false);
    };

    const [unenrollUser] = useMutation(UNENROLL_USER, {
        variables: {
            program_id: item.id,
            username: user?.["https://hasura.io/jwt/claims"]["openedx_username"],
            org_url: window.location.origin,
        },
        onCompleted: () => {
            toast.success('Unenrolled Successfully');
            refetch();
        },
    });

    const { data: courseProgressData } = useQuery(GET_PROGRESS, {
        variables: {
            org_url: window.location.origin,
            program_id: item.id,
            username: user?.["https://hasura.io/jwt/claims"]["openedx_username"]
        }
    });

    const { programDetails: ProgramCourse } = usePrograms(item.id)

    const OneCourseProgram = (ProgramCourse?.program_course?.length === 1 && ProgramCourse?.program_course?.[0].course)

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Link
            to=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </Link>
    ));

    const ActionMenu = ({ extraclass }) => {
        return (
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <i className={`fe fe-more-horizontal ${extraclass} pe-2`}></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        handleShow()
                    }}>
                        <i className="fe fe-x-circle text-danger dropdown-item-icon" />
                        Unenroll
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    };

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const GridView = () => {
        return (
            <Card
                className={`card-hover shadow-md h-100 ${extraclass} ${!OneCourseProgram && 'bg-dark'}`}
                as={isUnenrolling ? undefined : Link}
                to={`/programs/single/overview/${item.id}`}
            >
                <div className="m-lg-3 m-2">
                    <Image
                        src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${item.program_card_image}`}
                        alt=""
                        className="card-img-top rounded"
                        style={{
                            width: '100%',
                            height: isMobile ? '5rem' : '10rem',
                            objectFit: 'cover',
                            overflow: 'hidden'
                        }}
                        onError={(e) => {
                            e.target.src = ProgramCardPlaceholder;
                        }}
                    />
                </div>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Unenrollment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to unenroll from this program? This action cannot be undone.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={() => handleClose()}>
                            No, Cancel
                        </Button>
                        <Button variant="danger" onClick={() => { unenrollUser(); handleClose() }}>
                            Yes, Unenroll
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Card body  */}
                <Card.Body
                    className={`px-3 px-lg-4 py-2 py-lg-3 pt-lg-0`}
                >
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                        <h3
                            className={`fw-semibold text-inherit text-truncate-line-2 fs-lg-3 ${!OneCourseProgram && 'text-white'}`}
                            style={{
                                height: !isMobile ? "3.2em" : "2.8em",
                                fontSize: isMobile && '1em'
                            }}
                        >
                            {item.title}
                        </h3>
                        {!isMobile && <ActionMenu extraclass='text-gray me-n2' />}
                    </div>
                    <div className={`align-self-end`}>
                        <div className="d-flex d-lg-block flex-row-reverse align justify-content-between">
                            <div className={`mb-lg-2 mb-1 text-gray-500 d-flex ${!OneCourseProgram && 'text-white'}`}>
                                {item.category && !isMobile && <div className={!OneCourseProgram ? 'text-white' : "text-dark"} style={{ fontSize: (isMobile && '.7em') }}>
                                    {item.category}
                                    <span className='mx-2'>|</span>
                                </div>}
                                <div className={!OneCourseProgram ? 'text-white' : "text-dark"} style={{ fontSize: (isMobile && '.7em') }}>
                                    {item.est_time_completion}
                                </div>
                            </div>
                            {!OneCourseProgram ?
                                <div className="mb-2 text-white" style={{ fontSize: (isMobile && '.7em') }}>
                                    {ProgramCourse?.program_course?.length} Courses
                                </div>
                                :
                                <div className="mb-2 text-dark" style={{ fontSize: (isMobile && '.7em') }}>
                                    Course
                                </div>
                            }
                        </div>
                        <div className={`pt-lg-1 pt-md-0 d-flex align-items-center`}>
                            <ProgressBar
                                variant="info"
                                now={courseProgressData?.courseProgress.program_progress * 100 || 0}
                                style={{ height: '.75em', width: '100%' }}
                            />
                            <p
                                className={`ms-2 mb-0 fs-lg-6 fw-bold ${!OneCourseProgram ? 'text-white' : "text-dark"}`}
                                style={{ fontSize: (isMobile && '.7em') }}
                            >
                                {Math.round(courseProgressData?.courseProgress.program_progress * 100) || 0}%
                            </p>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    return (
        <Fragment>
            <GridView />
        </Fragment>
    );
};

// Specifies the default values for props
StudentProgramCard.defaultProps = {
    free: false,
    viewby: "grid",
    showprogressbar: false,
    extraclass: "",
};

// Typechecking With PropTypes
StudentProgramCard.propTypes = {
    item: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    showprogressbar: PropTypes.bool,
    extraclass: PropTypes.string,
};

export default StudentProgramCard;
