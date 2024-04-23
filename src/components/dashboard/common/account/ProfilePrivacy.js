// import node module libraries
import React, { useState } from 'react';
import { Card, Row, Col, Form, ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

// import custom components
import { FormSelect } from 'components/elements/form-select/FormSelect';

const ProfilePrivacy = () => {

	// Privacy levels select control values
	const privacylevels = [
		{ value: 'public', label: 'Public' },
		{ value: 'private', label: 'Private' }
	];

	// State hook initialization for courses alerts
	const [ShowProfileState, setShowProfileState] = useState(true);
	const [ShowCoursesState, setShowCoursesState] = useState(false);
	const [ProfilePublicState, setProfilePublicState] = useState(true);
	const [CurrentlyLearningState, setCurrentlyLearningState] = useState(true);
	const [CompletedCoursesState, setCompletedCoursesState] = useState(true);
	const [YourInterestsState, setYourInterestsState] = useState(true);

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
						<h3 className="mb-0">Profile Privacy Settings</h3>
						<p className="mb-0">
							Making your profile public allow other users to see what you have
							been learning on Blend-ed.
						</p>
					</div>
				</Card.Header>
				<Card.Body>
					<Row className="d-lg-flex justify-content-between">
						<Col lg={9} md={7} sm={12} className="mb-3 mb-lg-0">
							<h4 className="mb-0">Privacy levels</h4>
							<p className="mb-0">Show your profile public and private.</p>
						</Col>
						<Col lg={3} md={5} sm={12}>
							<FormSelect options={privacylevels} />
						</Col>
					</Row>
					<hr className="my-5" />
					<div>
						<h4 className="mb-0">Profile settings</h4>
						<p className="mb-5">
							These controls give you the ability to customize what areas of
							your profile others are able to see.
						</p>
						{/* <!-- List group --> */}
						<ListGroup variant="flush">
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Show your profile on search engines</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											className=" form-switch"
											checked={ShowProfileState}
											onChange={() =>
												setShowProfileState(
													(ShowProfileState) => !ShowProfileState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Show courses you're taking on your profile page</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											label=""
											className=" form-switch"
											checked={ShowCoursesState}
											onChange={() =>
												setShowCoursesState(
													(ShowCoursesState) => !ShowCoursesState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Show your profile on public</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											label=""
											className=" form-switch"
											checked={ProfilePublicState}
											onChange={() =>
												setProfilePublicState(
													(ProfilePublicState) => !ProfilePublicState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Currently learning</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											label=""
											className=" form-switch"
											checked={CurrentlyLearningState}
											onChange={() =>
												setCurrentlyLearningState(
													(CurrentlyLearningState) => !CurrentlyLearningState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Completed courses</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											label=""
											className=" form-switch"
											checked={CompletedCoursesState}
											onChange={() =>
												setCompletedCoursesState(
													(CompletedCoursesState) => !CompletedCoursesState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
							<ListGroup.Item className="d-flex align-items-center justify-content-between px-0 py-2">
								<div>Your Interests</div>
								<div>
									<Form>
										<Form.Check
											name="radios"
											type="checkbox"
											label=""
											className=" form-switch"
											checked={YourInterestsState}
											onChange={() =>
												setYourInterestsState(
													(YourInterestsState) => !YourInterestsState
												)
											}
										/>
									</Form>
								</div>
							</ListGroup.Item>
						</ListGroup>
					</div>
				</Card.Body>
			</Card>
			</Col>
			</Row>
			<Row  className=' justify-content-center'>
				{/* <Col lg={12} md={12} sm={12}>
					<ProfileCover dashboardData={dashboardData} />
				</Col> */}
				<Col className='pb-4' xl={8} lg={10} md={12}>
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

export default ProfilePrivacy;
