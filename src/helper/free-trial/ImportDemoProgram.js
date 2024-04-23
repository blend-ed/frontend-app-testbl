import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import ProgramCardPlaceholder from '../../assets/images/background/program-cover-img.png';
import { SubOrgContext } from '../../context/Context';
import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Image, Row, Spinner } from "react-bootstrap";
import { toast } from 'react-toastify';

const IMPORT_DEMO_PROGRAM = gql`
    mutation MyMutation($org_url: String = "", $sub_org_name: String = "", $user_id: uuid = "") {
        importDemoCourse(org_url: $org_url, sub_org_name: $sub_org_name, user_id: $user_id) {
            body
            err_msg
            status
        }
    }
`;

export const ImportDemoProgram = (props) => {

    const { user } = useAuth0();
    const { subOrgState: { subOrg } } = useContext(SubOrgContext);

    const { setCurrentStep, setDemoProgramImported } = props;

    const [importDemoProgram, { loading }] = useMutation(IMPORT_DEMO_PROGRAM, {
        variables: {
            org_url: window.location.origin,
            sub_org_name: subOrg,
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]
        },
        onCompleted: (data) => {
            if (data.importDemoCourse.err_msg) {
                toast.error(data.importDemoCourse.err_msg);
            } else {
                toast.success(data.importDemoCourse.body);
                setDemoProgramImported(true);
                setCurrentStep(3);
            }
        }
    });

    const loadingCommands = [
        'Creating Demo Course',
        'Creating Demo Program',
        'Delivering to your Organisation'
    ];

    const [currentCommand, setCurrentCommand] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCommand((currentCommand + 1) % loadingCommands.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [currentCommand]);

    if (loading) return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '60vh' }}>
            <div className='text-center'>
                {/* 3 different loading commands changing by time */}
                <h2 className='text-primary mb-4'>{loadingCommands[currentCommand]}...</h2>
                <Spinner animation='border' className='fw-normal ms-2' />
            </div>
        </div>
    )

    return (
        <div className='px-4'>
            <Row className='justify-content-center'>
                <Col lg={5} md={6} sm={6} xs={12}>
                    <Card className='card-hover shadow-sm card-bordered bg-white'>
                        <div className='m-3'>
                            <Image
                                src={ProgramCardPlaceholder}
                                alt="Program Card Image"
                                className="card-img-top rounded"
                                style={{
                                    width: '100%',
                                    height: '10rem',
                                    objectFit: 'cover',
                                    overflow: 'hidden'
                                }}
                            />
                        </div>

                        {/* Card body  */}
                        <Card.Body className='px-3 px-lg-4 py-2 py-lg-3 pt-lg-0'>
                            <div className='d-flex justify-content-between align-items-start mb-2'>
                                <h3 className={`mb-0 fw-semibold text-inherit text-truncate-line-2 fs-4 fs-lg-3 text-dark`} style={{ height: "3.2em" }}>
                                    Demo Program for {subOrg}
                                </h3>
                            </div>
                            <div>
                                <div className='mb-2 d-flex'>
                                    <div className='text-dark'>
                                        Demo
                                        <span className='mx-2'>|</span>
                                    </div>
                                    <div className='text-dark'>
                                        10 Days
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className={`mb-0 text-dark`}>
                                        Course
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer className="px-3">
                            <Button variant='primary' className="w-100" onClick={importDemoProgram}>
                                Import Demo Program
                            </Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <div className='mt-6 mb-3 text-end'>
                <Button variant='outline-primary' className='px-6 me-3' onClick={() => setCurrentStep(1)}>
                    <i className='fa-solid fa-arrow-left me-2' />
                    Back
                </Button>
                <Button className='px-6' onClick={() => setCurrentStep(3)}>
                    Skip
                    <i className='fa-solid fa-arrow-right ms-2' />
                </Button>
            </div>
        </div>
    )
}