// import node module libraries
import { Button, Card, Col, Nav, Row, Spinner, Tab } from "react-bootstrap";

// import profile layout wrapper
import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import DummyBG from "../../../../assets/images/background/dummy-bg.jpg";
import { Loading } from "../../../../helper/Loading";
import { CommonHeader } from "./CommonHeader";
import Profile from "./Profile";
import Preferences from "./Preferences";
import Security from "./Security";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import useUserDetails from "../../../../hooks/useUserDetails";

const OPENEDX_URLS = gql`
    query getOrgId($_eq: String = "") {
        organisation(where: {domain: {_eq: $_eq}}) {
            openedx_endpoint
        }
    }
`;

const Account = () => {

    const { 
        userDetails,
        userDetailsLoading: loading,
        userDetailsRefetch: refetch
    } = useUserDetails();

    const { user } = useAuth0();

    const [isLoading, setIsLoading] = useState(false);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const { data: orgData, loading: orgLoading } = useQuery(OPENEDX_URLS, {
        variables: { _eq: window.location.origin }
    })

    useEffect(() => {
        // Simulate an API call or any asynchronous operation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 7000);

        return () => {
            clearTimeout(timer); // Clean up the timer if the component unmounts before the loading is complete
        };
    }, [isLoading]);

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="m-lg-0 m-n2">
            <Row className="justify-content-center">
                <Col lg={10} md={12}>
                    <Tab.Container defaultActiveKey='profile'>
                        <Row className="justify-content-center g-lg-4 g-3">
                            <Col lg={12}>
                                <CommonHeader
                                    name={userDetails?.name}
                                    profileImage={userDetails?.profile_image}
                                    coverImage={DummyBG}
                                    refetch={refetch}
                                    yearOfBirth={userDetails?.year_of_birth}
                                />
                            </Col>
                            <Col lg={3}>
                                <Card className="border-0 h-100">
                                    <Card.Body className="p-2 p-lg-4">
                                        <Nav defaultActiveKey="profile" className={ (isMobile && " justify-content-center")}>
                                            <Nav.Link className={isMobile ? 'fs-5 px-2' : "fs-4"} eventKey="profile">Profile</Nav.Link>
                                            <Nav.Link className={isMobile ? 'fs-5 px-2' : "fs-4"} eventKey="preferences">Preferences</Nav.Link>
                                            <Nav.Link className={isMobile ? 'fs-5 px-2' : "fs-4"} eventKey="security">Security</Nav.Link>
                                        </Nav>
                                        {!isMobile &&
                                            <Button
                                                variant="outline-danger"
                                                className="mt-4 rounded-4 w-100"
                                                as={Link}
                                                to={`https://${orgData?.organisation[0]?.["openedx_endpoint"]}/dashboard-logout`}
                                            >
                                                Logout
                                            </Button>}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="border-0">
                                    <Card.Body className="px-lg-4 px-1">
                                        <Tab.Content animation="true">
                                            <Tab.Pane eventKey="profile" className="px-4 pt-2">
                                                <Profile userDetails={userDetails} loading={loading} refetch={refetch} />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="preferences" className="px-4 pt-2">
                                                <Preferences />
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="security" className="px-4 pt-2">
                                                <Security userDetails={userDetails} loading={loading} />
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Card.Body>
                                </Card>
                                {isMobile &&
                                    <Button
                                        variant="outline-danger"
                                        className="mt-3 bg-white rounded-4 w-100"
                                        as={Link}
                                        to={'/logout'}
                                    >
                                        Logout
                                    </Button>}
                            </Col>
                        </Row>
                    </Tab.Container>
                </Col>
            </Row>
        </div>
    );
};

export default Account;
