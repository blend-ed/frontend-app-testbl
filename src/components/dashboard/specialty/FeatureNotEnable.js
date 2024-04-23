import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Image } from 'react-bootstrap';

// import media files
import ErrorImage from '../../../assets/images/error/404-error-img.svg';

const FeatureNotEnable = () => {
    return (
        <Fragment>
            <Row className="align-items-center justify-content-center g-0 py-lg-22 py-10 px-10">
                <Col
                    lg={6}
                    md={8}
                    className="text-center text-lg-start"
                >
                    <h1 className="display-1 mb-3">Feature not enabled yet</h1>
                    <p className="mb-5 lead">
                        This feature is not enabled yet. Please contact your administrator.
                    </p>
                    <Link to={location.pathname.includes('/i/') ? '/i/dashboard' : location.pathname.includes('/m/') ? '/m/dashboard' : '/dashboard'} className="btn btn-primary me-2">
                        Back to Safety
                    </Link>
                </Col>
                <Col
                    lg={6}
                    md={8}
                    className="mt-8 mt-lg-0"
                >
                    <Image src={ErrorImage} alt="" className="w-100" />
                </Col>
            </Row>
        </Fragment>
    );
}

export default FeatureNotEnable;