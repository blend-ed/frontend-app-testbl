// import node module libraries
import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { mdiAccountSchoolOutline, mdiClipboardOutline, mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import ProgramCover from '../../../../../../assets/images/background/program-cover-img.jpg';
import axios from "axios";
import DiscoverProgramCardLong from "../../../../../../components/dashboard/student/dashboard/discover/single/DiscoverProgramCardLong";
import { SubOrgContext } from "../../../../../../context/Context";
import usePrograms from "../../../../../../hooks/usePrograms";
import { useContext, useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Image,
    Row,
    Spinner
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { DiscoverCourseList } from "./DiscoverCourseList";
import ProgramAbout from "./ProgramAbout";

const OPENEDX_URLS = gql`
    query getOrgId($_eq: String = "") {
        organisation(where: {domain: {_eq: $_eq}}) {
            openedx_endpoint
        }
    }
`;

const ProgramDiscover = () => {
    const ConfigContext = useContext(SubOrgContext)
    const org = 'localhost'

    const { id } = useParams();

    const { programDetails: data, programEnroll: enroll, programEnrollLoading: enrollLoading } = usePrograms(id)

    const { user, getIdTokenClaims } = useAuth0();
    const navigate = useNavigate();
    const sub_org_plans = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"]

    var ORG = org?.replace(/[^a-z0-9]/gi, '').toLowerCase()
    if (sub_org_plans['localhost'] == 'Free') {
        ORG = window.location.origin === 'http://localhost:3000' ? 'localhost' : 'blended'
    }

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCardFixed, setIsCardFixed] = useState(false);
    const [location, setLocation] = useState();

    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => {
        const handleScroll = () => {
            // Get scroll position from the window or parent container
            const scrollPosition = window.scrollY;

            // Define a threshold where the positioning changes
            const scrollThreshold = isMobile ? 400 : 90

            // Update component positioning based on scroll position
            if (scrollPosition > scrollThreshold) {
                setIsCardFixed(true);
            } else {
                setIsCardFixed(false);
            }
        };

        // Attach scroll event listener when the component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get("https://ipapi.co/json");
                setLocation(response?.data?.country);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLocation();
    }, []);

    const { user: student } = useAuth0();

    const { data: orgData } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin }
    })

    function programEnroll() {
        enroll({
            variables: {
                role: "student",
                program_id: id,
                user_id: student?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                org_url: window.location.origin,
            },
            onCompleted: () => {
                setResult("success");
            },
        });
    }

    useEffect(() => {
        if (result === "success") {
            toast.success("Successfully enrolled in program");
            if (data?.program_course?.length === 1) {
                const course_id = data?.program_course?.[0].course?.openedx_id;
                if (isMobile) {
                    if (window.Android && typeof window.Android.openNativeDashboard == 'function') {
                        try {
                            window.Android.openNativeDashboard(
                                data?.program_course?.[0].course?.openedx_id
                            );
                        }
                        catch (e) {
                            console.error(e);
                        }
                    } else if (window.webkit && typeof window.webkit.messageHandlers.openNativeDashboard.postMessage === 'function') {
                        try {
                            window.webkit.messageHandlers.openNativeDashboard.postMessage({
                                openedx_id: data?.program_course?.[0].course?.openedx_id
                            });
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    navigate(`/programs/single/overview/${id}`);
                } else {
                    const url = `https://${orgData?.organisation[0]?.["openedx_endpoint"]}/auth/login/auth0-plugin/?auth_entry=login&next=${encodeURIComponent(`https://apps.${orgData?.organisation[0]?.["openedx_endpoint"]}/learning/course/${course_id}/home`)}`;
                    window.location.href = url;
                }
            } else {
                navigate(`/programs/single/overview/${id}`);
            }
            // window.location.replace(`/programs/single/overview/${id}`);
        } else if (result === "Transaction failed!") {
            toast.error("Transaction failed!");
        }
    }, [result])

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function displayRazorpay() {
        if (Number(data?.program?.[0]?.price) -
            Number(data?.program?.[0]?.discount) === 0) {
            programEnroll();
        }
        else {
            if (location !== 'IN') {
                navigate('/discover/single/stripe/' + id);
            } else {
                const res = await loadScript(
                    "https://checkout.razorpay.com/v1/checkout.js"
                );

                if (!res) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    return;
                }

                // creating a new order
                setIsLoading(true)
                const token = await getIdTokenClaims();
                const result = await axios.post(
                    `${process.env.REACT_APP_RAZORPAY_URL}/payment/orders`,
                    {
                        program_id: id,
                        orgUrl: window.location.origin,
                    },
                    {
                        headers: {
                            accesstoken: token["__raw"],
                        },
                    }
                );

                if (!result) {
                    alert("Server error. Are you online?");
                    return;
                }
                // Getting the order details back
                const { amount, id: order_id, currency } = result.data;

                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY,
                    amount: amount.toString(),
                    currency: currency,
                    name: "Blend-ed.",
                    description: "Transaction",
                    order_id: order_id,
                    handler: async function (response) {
                        setIsLoading(true);
                        const data = {
                            orderCreationId: order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                            orgUrl: window.location.origin,
                        };
                        console.log(data);
                        const result = await axios.post(
                            `${process.env.REACT_APP_RAZORPAY_URL}/payment/success`,
                            data
                        );
                        try {
                            setResult(result.data?.msg);
                        } catch (error) {
                            setResult("Transaction failed!")
                        }
                        setIsLoading(false);
                    },
                    prefill: {
                        name: "Soumya Dey",
                        email: "SoumyaDey@example.com",
                        contact: "9999999999",
                    },
                    notes: {
                        address: "Soumya Dey Corporate Office",
                    },
                    theme: {
                        color: "#61dafb",
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setIsLoading(false)
            }
        }
    }

    if (localStorage.getItem("discover") !== '') {
        localStorage.setItem("discover", '')
    }

    const DisplayProgramDetails = () => {
        return (
            <Row>
                <Col lg={8}>
                    {data?.program?.[0].program_achieved &&
                        <ProgramAbout data={data?.program?.[0].program_achieved} type="achieved" />
                    }

                    {data?.program_course.length !== 0 &&
                        <DiscoverCourseList program_id={id} />
                    }

                    {data?.program?.[0].about_program &&
                        <ProgramAbout data={data?.program?.[0].about_program} type="about" />
                    }
                </Col>
            </Row>
        );
    }

    console.log(data?.program?.[0]?.program_achieved !== '' || data?.program?.[0]?.about_program !== '' || data?.program_course.length !== 0)

    return (
        <div>
            <Row className={isMobile && 'mb-4'}>
                <Col lg={8} xs={12}>
                    <Row className="mb-3 g-lg-4">
                        {!isMobile && <Col xs={12}>
                            {/*  Page header */}
                            <DiscoverProgramCardLong
                                item={data}
                                id={id}
                                showprogressbar
                                setResult={setResult}
                                display={displayRazorpay}
                            />
                        </Col>}
                        <Col>
                            {isMobile && <div className="mb-5">
                                <Image
                                    fluid className="rounded mb-4"
                                    src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${data?.program?.[0].program_card_image}`}
                                    onError={(e) => {
                                        e.target.src = ProgramCover; // Set default image if there is an error
                                    }}
                                />

                                <h2 className="mb-3">
                                    {data?.program?.[0].title}
                                </h2>
                                <div className="mb-3">
                                    <div className="d-flex align-items-center fs-4 mb-2">
                                        <Icon path={mdiClipboardOutline} size={1} className="me-2" />
                                        <span className="text-dark">{data?.program_course.length} courses</span>
                                    </div>
                                    <div className="d-flex align-items-center fs-4 mb-2">
                                        <Icon path={mdiAccountSchoolOutline} size={1} className="me-2" />
                                        <span className="text-dark">{data?.program?.[0].program_enrollments_aggregate.aggregate.count} students enrolled</span>
                                    </div>
                                    <div className="d-flex align-items-center fs-4 mb-2">
                                        <Icon path={mdiClockOutline} size={1} className="me-2" />
                                        <span className="text-dark">{data?.program?.[0].est_time_completion}</span>
                                    </div>
                                </div>
                                <p className={`text-primary fw-semi-bold text-truncate-line display-6`}>
                                    {data?.program?.[0].price > 0 ?
                                        <>
                                            <span>{localStorage.getItem('currency')} {Number(data?.program?.[0].price) - Number(data?.program?.[0].discount)}</span>
                                            {data?.program?.[0].discount &&
                                                <strike className='ms-2 text-muted fs-lg-4'>{localStorage.getItem('currency')} {Number(data?.program?.[0].price)}</strike>
                                            }
                                        </>
                                        :
                                        'Free'
                                    }
                                </p>
                                <div>
                                    <Button className="w-100 fs-3 py-2" size="lg" onClick={displayRazorpay} disabled={enrollLoading || isLoading || data?.program?.[0].invite_only} variant={data?.program?.[0].invite_only ? 'outline-primary' : 'primary'}>
                                        {data?.program?.[0].invite_only ? (
                                            'Invite Only'
                                        )
                                            : (enrollLoading || isLoading) ? (
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            ) : (
                                                'Enroll Now'
                                            )}
                                    </Button>
                                </div>
                            </div>}
                            {(data?.program?.[0]?.program_achieved || data?.program?.[0]?.about_program || data?.program_course.length !== 0) &&
                                (isMobile ? <DisplayProgramDetails /> :
                                    <Card className={'px-lg-5 py-3 m-lg-0 discover-lg'}>
                                        <DisplayProgramDetails />
                                    </Card>
                                )
                            }
                        </Col>
                    </Row>
                </Col>

                {!isMobile &&
                    <Col className="mb-4">
                        <div className={isCardFixed ? 'position-fixed me-7 mt-11' : 'mt-4'} style={{ top: '-3rem' }}>
                            <Card className="shadow-lg" style={{ width: '21rem' }}>
                                <Image
                                    fluid
                                    className="rounded m-3"
                                    src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${data?.program?.[0].program_card_image}`}
                                    style={{
                                        height: '12rem',
                                        objectFit: 'cover',
                                        overflow: 'hidden'
                                    }}
                                    onError={(e) => {
                                        e.target.src = ProgramCover; // Set default image if there is an error
                                    }}
                                />
                                <Card.Body className="pt-0">
                                    <h2 className="mb-3">
                                        {data?.program?.[0].title}
                                    </h2>
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center fs-4 mb-2">
                                            <Icon path={mdiClipboardOutline} size={1} className="me-2" />
                                            <span className="text-dark">{data?.program_course.length} courses</span>
                                        </div>
                                        <div className="d-flex align-items-center fs-4 mb-2">
                                            <Icon path={mdiAccountSchoolOutline} size={1} className="me-2" />
                                            <span className="text-dark">{data?.program?.[0].program_enrollments_aggregate.aggregate.count} students enrolled</span>
                                        </div>
                                        <div className="d-flex align-items-center fs-4 mb-2">
                                            <Icon path={mdiClockOutline} size={1} className="me-2" />
                                            <span className="text-dark">{data?.program?.[0].est_time_completion}</span>
                                        </div>
                                    </div>
                                    <p className={`text-primary fw-semi-bold text-truncate-line display-6`}>
                                        {data?.program?.[0].price > 0 ?
                                            <>
                                                <span>{localStorage.getItem('currency')} {Number(data?.program?.[0].price) - Number(data?.program?.[0].discount)}</span>
                                                {data?.program?.[0].discount &&
                                                    <strike className='ms-2 text-muted fs-lg-4'>{localStorage.getItem('currency')} {Number(data?.program?.[0].price)}</strike>
                                                }
                                            </>
                                            :
                                            'Free'
                                        }
                                    </p>
                                    <div>
                                        <Button className="w-100 fs-3 py-2" size="lg" onClick={displayRazorpay} disabled={enrollLoading || isLoading || data?.program?.[0].invite_only} variant={data?.program?.[0].invite_only ? 'outline-primary' : 'primary'}>
                                            {data?.program?.[0].invite_only ? (
                                                'Invite Only'
                                            )
                                                : (enrollLoading || isLoading) ? (
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    'Enroll Now'
                                                )}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col >
                }
            </Row >
            {isMobile && <div className={`${isCardFixed ? 'position-fixed' : 'd-none'} ms-n4 px-4 w-100 bg-white py-3 d-flex justify-content-between align-items-center shadow-lg`} style={{ bottom: '3.2rem' }}>
                {data?.program?.[0].price !== "0" ? (
                    <h3 className="mb-0 text-primary">
                        {localStorage.getItem('currency')}
                        {Number(data?.program?.[0].price) - Number(data?.program?.[0].discount)}
                        {data?.program?.[0].discount !== "0" ? (
                            <>
                                <strike className="ms-2 fs-5 text-muted">
                                    {localStorage.getItem('currency')} {Number(data?.program?.[0].price)}
                                </strike>
                            </>
                        ) : (
                            ""
                        )}
                    </h3>
                ) : (
                    <h3 className="mb-0 text-primary">Free</h3>
                )}
                <Button
                    onClick={() => displayRazorpay()}
                    className="fs-4"
                    variant={data?.program?.[0].invite_only ? 'outline-primary' : 'primary'}
                    disabled={enrollLoading || isLoading || data?.program?.[0].invite_only}
                >
                    {data?.program?.[0].invite_only ? (
                        'Invite Only'
                    )
                        : (enrollLoading || isLoading) ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ) : (
                            'Enroll Now'
                        )}
                </Button>
            </div>
            }
        </div >
    );
};

export default ProgramDiscover;