// import node module libraries
import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import CourseCover from '../../../../../assets/images/background/course-cover-img.jpg';
import { SubOrgContext } from "../../../../../context/Context";
import PropTypes from "prop-types";
import { Fragment, useContext } from "react";
import {
    Card,
    Image,
    ProgressBar
} from "react-bootstrap";
import { useMediaQuery } from 'react-responsive';
import { Link } from "react-router-dom";

const OPENEDX_URLS = gql`
    query getOrgId($_eq: String = "") {
        organisation(where: {domain: {_eq: $_eq}}) {
            openedx_endpoint
        }
    }
`

const GET_PROGRESS = gql`
    query getCourseProgress($org_url: String = "", $username: String = "") {
        courseProgress(org_url: $org_url, username: $username) {
            course_progress
            program_progress
            err_msg
        }
    }
`;

const StudentCourseCard = ({
    setIsLoading,
    item,
    extraclass,
}) => {

    const ConfigContext = useContext(SubOrgContext)
    const org = 'localhost'?.replace(/[^a-z0-9]/gi, '').toLowerCase()

    const { user } = useAuth0();
    const sub_org_plans = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"]

    var ORG = org;
    if (sub_org_plans['localhost'] == 'Free') {
        ORG = window.location.origin === 'http://localhost:3000' ? 'localhost' : 'blended'
    }

    const { data: orgData } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin }
    })

    const { data: courseProgressData } = useQuery(GET_PROGRESS, {
        variables: {
            org_url: window.location.origin,
            username: user?.["https://hasura.io/jwt/claims"]["openedx_username"]
        }
    });

    const CourseAndroid = () => {

        if (window.Android && typeof window.Android.openNativeDashboard == 'function') {
            try {
                window.Android.openNativeDashboard(
                    item.openedx_id
                );
            }
            catch (e) {
                console.error(e);
            }
        }
        if (window.webkit && typeof window.webkit.messageHandlers.openNativeDashboard.postMessage === 'function') {
            try {
                window.webkit.messageHandlers.openNativeDashboard.postMessage({ openedx_id: item.openedx_id });
            } catch (e) {
                console.error(e);
            }
        }
    }

    const isMobile = useMediaQuery({ maxWidth: 767 })

    const GridView = () => {
        return (
            <Card
                className={`card-hover shadow-md h-100 ${extraclass}`}
                as={Link}
                to={isMobile && item ?
                    '#'
                    :
                    item ?
                        `https://${orgData?.organisation[0]?.["openedx_endpoint"]}/auth/login/auth0-plugin/?auth_entry=login&next=${encodeURIComponent(`https://apps.${orgData?.organisation[0]?.["openedx_endpoint"]}/learning/course/${item?.openedx_id}/home`)}`
                        :
                        `/programs/single/overview/${item.id}`
                }
            >
                <div className="m-lg-3 m-2">
                    <Image
                        src={item.course_image || CourseCover}
                        alt=""
                        className="card-img-top rounded"
                        style={{
                            width: '100%',
                            height: isMobile ? '5rem' : '10rem',
                            objectFit: 'cover',
                            overflow: 'hidden'
                        }}
                        onClick={() => {
                            if (isMobile && item) {
                                CourseAndroid();
                            } else if (item) {
                                setIsLoading(true);
                            }
                        }}
                        onError={(e) => {
                            e.target.src = CourseCover; // Set default image if there is an error
                        }}
                    />
                </div>
                {/* <div className="d-flex position-absolute end-0 pe-md-3 pt-md-3 pe-1 pt-1">
					<ActionMenu extraclass='text-gray'/>
				</div> */}

                {/* Card body  */}
                <Card.Body
                    className={`px-3 px-lg-4 py-2 py-lg-3 pt-lg-0`}
                    onClick={() => {
                        if (isMobile && item) {
                            CourseAndroid();
                        } else if (item) {
                            setIsLoading(true);
                        }
                    }}
                >
                    <h3
                        className={`fw-semibold text-inherit text-truncate-line-2 fs-lg-3`}
                        style={{
                            height: !isMobile ? "3.2em" : "2.8em",
                            fontSize: isMobile && '1em'
                        }}
                    >
                        {item.name}
                    </h3>
                    <div className={`align-self-end`}>
                        <div className={`mb-lg-2 text-gray-500 d-flex`}>
                            {!isMobile && item.category && <div style={{ fontSize: (isMobile && '.7em') }}>
                                {item.category}
                                <span className='mx-2'>|</span>
                            </div>}
                            {item.duration && item.duration !== 0 ? <div style={{ fontSize: (isMobile && '.7em') }}>
                                {item.duration}
                            </div>
                                :
                                ''
                            }
                        </div>
                        <div className={`pt-1 pt-md-0 d-flex align-items-center`}>
                            <ProgressBar
                                variant="info"
                                now={courseProgressData?.courseProgress?.course_progress?.[item.openedx_id] * 100 || 0}
                                style={{ height: '.75em', width: '100%' }}
                            />
                            <p
                                className={`ms-2 mb-0 fs-lg-6 text-dark fw-bold`}
                                style={{ fontSize: '.7em' }}
                            >
                                {Math.round(courseProgressData?.courseProgress?.course_progress?.[item.openedx_id] * 100) || 0}%
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
StudentCourseCard.defaultProps = {
    free: false,
    viewby: "grid",
    showprogressbar: false,
    extraclass: "",
};

// Typechecking With PropTypes
StudentCourseCard.propTypes = {
    item: PropTypes.object.isRequired,
    free: PropTypes.bool,
    viewby: PropTypes.string,
    showprogressbar: PropTypes.bool,
    extraclass: PropTypes.string,
};

export default StudentCourseCard;
