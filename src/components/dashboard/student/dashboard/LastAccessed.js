import {
    Card,
    Col,
    Image,
    Placeholder,
    ProgressBar,
    Row,
    Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import CourseCover from "../../../../assets/images/background/course-cover-img.jpg";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { SubOrgContext } from "../../../../context/Context";
import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const GET_LASTACCESSED_BLOCK = gql`
    query lastAccessed(
        $org_url: String = ""
        $user_id: String = ""
        $sub_org: String = ""
        $username: String!
    ) {
        resumeCourse(
            org_url: $org_url
            user_id: $user_id
            sub_org: $sub_org
            username: $username
        ) {
            block_id
            block_name
            block_path
            course_id
            course_name
            last_accessed_date
            progress
            block_type
            course_image
            err_msg
        }
    }
`;

const OPENEDX_URLS = gql`
    query getOrgId($_eq: String = "") {
        organisation(where: { domain: { _eq: $_eq } }) {
            openedx_endpoint
        }
    }
`;

export const LastAccessed = ({ setIsLoading }) => {
    const { user: student } = useAuth0();

    const ConfigContext = useContext(SubOrgContext);
    const sub_org_name = 'localhost';

    const [lastAccessBlockLink, setLastAccessBlockLink] = useState("");

    const isMobile = useMediaQuery({maxWidth: 820})

    const {
        loading: lastAccessedLoading,
        error: lastAccessedError,
        data: lastAccessedBlock,
    } = useQuery(GET_LASTACCESSED_BLOCK, {
        variables: {
            org_url: window.location.origin,
            sub_org: sub_org_name,
            user_id:
                student?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
            username:
                student?.["https://hasura.io/jwt/claims"]["openedx_username"],
        },
    });

    const { data: orgData } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin },
    });

    useEffect(() => {
        if (lastAccessedBlock) {
            const block_id = lastAccessedBlock.resumeCourse.block_id;
            const course_id = lastAccessedBlock.resumeCourse.course_id;
            setLastAccessBlockLink(
                `https://${
                    orgData?.organisation[0]?.["openedx_endpoint"]
                }/auth/login/auth0-plugin/?auth_entry=login&next=${encodeURIComponent(
                    `https://${orgData?.organisation[0]?.["openedx_endpoint"]}/courses/${course_id}/jump_to/${block_id}`
                )}`
            );
        }
    }, [lastAccessedBlock, lastAccessBlockLink]);

    function formatDate(dateString) {
        const currentDate = new Date();
        const inputDate = new Date(dateString);

        // Remove time components for comparison
        currentDate.setHours(0, 0, 0, 0);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate.getTime() === currentDate.getTime()) {
            return "Today";
        } else if (
            inputDate.getTime() ===
            currentDate.getTime() - 24 * 60 * 60 * 1000
        ) {
            return "Yesterday";
        } else {
            return inputDate.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        }
    }

    const CourseIdAndroid = () => {
        console.log(
            "testing courseId: ",
            lastAccessedBlock.resumeCourse.course_id
        );
        if (window.Android && typeof window.Android.setCourseId == "function") {
            try {
                window.Android.setCourseId(
                    lastAccessedBlock.resumeCourse.course_id
                );
            } catch (e) {
                console.error(e);
            }
        }
        if (
            window.webkit &&
            typeof window.webkit.messageHandlers.setCourseId.postMessage ===
                "function"
        ) {
            try {
                window.webkit.messageHandlers.setCourseId.postMessage({
                    course_id: lastAccessedBlock.resumeCourse.course_id,
                    block_id: lastAccessedBlock.resumeCourse.block_id,
                });
            } catch (e) {
                window.webkit.messageHandlers.setCourseId.postMessage(
                    "Error: " + e
                );
            }
        }
    };

    if (!isMobile) {
        return (
            <Row>
                <Col xl={12}>
                    <Card className={`mb-4 ${lastAccessedError && "d-none"}`}>
                        <Row className="g-2">
                            <Col
                                lg={5}
                                className="d-flex align-items-center py-3"
                            >
                                {!lastAccessedLoading ? (
                                    <Image
                                        src={
                                            lastAccessedBlock?.resumeCourse
                                                .course_image
                                                ? lastAccessedBlock
                                                      ?.resumeCourse
                                                      .course_image
                                                : CourseCover
                                        }
                                        fluid
                                        className="rounded ms-3"
                                        style={{
                                            height: "11rem",
                                            width: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center",
                                        }}
                                        onError={(e) => {
                                            e.target.src = CourseCover; // Set default image if there is an error
                                        }}
                                    />
                                ) : (
                                    <Placeholder
                                        as="span"
                                        animation="glow"
                                        className="h-100 w-100"
                                    >
                                        <Placeholder
                                            xs={6}
                                            className={"rounded ms-3"}
                                            style={{
                                                height: "11rem",
                                                width: "100%",
                                            }}
                                        />
                                    </Placeholder>
                                )}
                            </Col>
                            <Col>
                                <Card.Body className="d-flex flex-column h-100">
                                    <div className="pe-4 me-4 w-100">
                                        <h4 className="mb-2 text-muted">
                                            {lastAccessedBlock?.resumeCourse
                                                .course_name ? (
                                                lastAccessedBlock?.resumeCourse
                                                    .course_name
                                            ) : (
                                                <Placeholder
                                                    as="span"
                                                    animation="glow"
                                                >
                                                    <Placeholder
                                                        xs={4}
                                                        className={"rounded"}
                                                    />
                                                </Placeholder>
                                            )}
                                        </h4>
                                        <h2
                                            className="fw-bold text-truncate-line-2"
                                            style={{ height: "4rem" }}
                                        >
                                            {lastAccessedBlock?.resumeCourse
                                                .block_name ? (
                                                lastAccessedBlock?.resumeCourse
                                                    .block_name
                                            ) : (
                                                <Placeholder
                                                    as="span"
                                                    animation="glow"
                                                >
                                                    <Placeholder
                                                        xs={6}
                                                        className={"rounded"}
                                                    />
                                                </Placeholder>
                                            )}
                                        </h2>
                                    </div>
                                    <div className="d-flex justify-content-between mt-auto">
                                        <p className="align-self-center mb-0">
                                            {lastAccessedBlock?.resumeCourse
                                                .block_type ? (
                                                lastAccessedBlock?.resumeCourse
                                                    .block_type
                                            ) : (
                                                <Placeholder
                                                    as="span"
                                                    animation="glow"
                                                >
                                                    <Placeholder
                                                        xs={3}
                                                        className={"rounded"}
                                                    />
                                                </Placeholder>
                                            )}
                                        </p>
                                        <div className="d-flex align-items-center">
                                            <div className="me-4">
                                                <p className="mb-n1 fs-6 fw-medium">
                                                    Last active
                                                </p>
                                                <p className="mb-0 fs-6">
                                                    {lastAccessedBlock
                                                        ?.resumeCourse
                                                        .last_accessed_date ? (
                                                        formatDate(
                                                            lastAccessedBlock
                                                                ?.resumeCourse
                                                                .last_accessed_date
                                                        )
                                                    ) : (
                                                        <Placeholder
                                                            as="span"
                                                            animation="glow"
                                                        >
                                                            <Placeholder
                                                                xs={12}
                                                                className={
                                                                    "rounded"
                                                                }
                                                            />
                                                        </Placeholder>
                                                    )}
                                                </p>
                                            </div>
                                            <Link
                                                to={lastAccessBlockLink}
                                                onClick={() => {
                                                    setIsLoading(true);
                                                }}
                                                className={`btn btn-primary rounded-4 ${
                                                    (!lastAccessBlockLink ||
                                                        lastAccessedLoading) &&
                                                    "disabled"
                                                }`}
                                            >
                                                Resume
                                            </Link>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        );
    } else {
        return (
            <>
                {lastAccessedLoading || lastAccessedError ? null : (
                    <>
                        <h4 className={`mb-3`}>Resume Course</h4>
                        <Card className={`mb-4`} onClick={CourseIdAndroid}>
                            <Card.Body className="p-2">
                                <Row className="g-0">
                                    <Col xs={3}>
                                        <Image
                                            src={
                                                lastAccessedBlock?.resumeCourse
                                                    .course_image
                                            }
                                            className="rounded"
                                            height={"64em"}
                                            width={"64em"}
                                            style={{
                                                objectFit: "cover",
                                                objectPosition: "center",
                                            }}
                                            onError={(e) => {
                                                e.target.src = CourseCover; // Set default image if there is an error
                                            }}
                                        />
                                    </Col>
                                    {/* Card body  */}
                                    <Col className="ps-3 pe-2 d-flex flex-column">
                                        <h5 className=" fw-bold mb-0 text-truncate-line">
                                            {
                                                lastAccessedBlock?.resumeCourse
                                                    .course_name
                                            }
                                        </h5>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <ProgressBar
                                                variant="info"
                                                now={
                                                    lastAccessedBlock
                                                        ?.resumeCourse
                                                        .progress * 100 || 0
                                                }
                                                className="me-1"
                                                style={{
                                                    height: ".4em",
                                                    width: "100%",
                                                }}
                                            />
                                            <p
                                                className="ps-1 text-info mb-0"
                                                style={{ fontSize: ".8em" }}
                                            >
                                                {Math.round(
                                                    lastAccessedBlock
                                                        ?.resumeCourse
                                                        .progress * 100
                                                ) || 0}
                                                %
                                            </p>
                                        </div>
                                        <p
                                            className="mb-0 text-truncate-line mt-auto text-gray-500 d-flex justify-content-between"
                                            style={{ fontSize: ".8em" }}
                                        >
                                            <span className="fw-bold">
                                                Last active{" "}
                                            </span>
                                            {formatDate(
                                                lastAccessedBlock?.resumeCourse
                                                    .last_accessed_date
                                            )}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </>
        );
    }
};
