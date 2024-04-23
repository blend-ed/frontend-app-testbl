// import node module libraries
import React from 'react';
import { Card, Row, Col, } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DeleteProfile = () => {

	return (
		<div>
			<Row  className=' justify-content-center'>
				{/* <Col lg={12} md={12} sm={12}>
					<ProfileCover dashboardData={dashboardData} />
				</Col> */}
				<Col className='py-4' xl={8} lg={10} md={12}>
					<Card className="border-0">
						<Card.Header>
							<div className="mb-3 mb-lg-0">
								<h3 className="mb-0">Delete your account</h3>
								<p className="mb-0">Delete or Close your account permanently.</p>
							</div>
						</Card.Header>
						<Card.Body>
							<span className="text-danger h4">Warning</span>
							<p>
								If you close your account, you will be unsubscribed from all your 0
								courses, and will lose access forever.
							</p>
							<Link to="/dashboard" className="btn btn-outline-danger btn-sm">
								Close My Account
							</Link>
						</Card.Body>
					</Card>
				</Col>
			</Row>	
		</div>
	);
};

export default DeleteProfile;
