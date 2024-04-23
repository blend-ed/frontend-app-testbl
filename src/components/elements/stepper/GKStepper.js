// import node module libraries
import { Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const GKStepper = (props) => {
    const { currentStep, steps } = props;

    return (
            <Row>
                <Col lg={12} md={12} sm={12} className='stepper'>
                    {/* Generating header for stepper */}
                    <div className="stepper-header justify-content-center">
                        {steps.map((step) => {
                            return (
                                <Fragment key={step.id}>
                                    <div
                                        className={`step ${step.id === currentStep ? 'active' : ''
                                            }`}
                                    >
                                        <Button bsPrefix="step-trigger">
                                            <span className="stepper-circle mx-2">{step.id}</span>
                                            <span className="stepper-label me-2">
                                                {step.title}
                                            </span>
                                        </Button>
                                    </div>
                                    {steps.length > step.id ? (
                                        <div className="stepper-line"></div>
                                    ) : (
                                        ''
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>

                    {/* Showing content for active step */}

                    <div className="stepper-content mt-4">
                        <div className="stepper-pane fade active">
                            {steps[currentStep-1].content}
                        </div>
                    </div>
                </Col>
            </Row>
    );
};

export default GKStepper;
