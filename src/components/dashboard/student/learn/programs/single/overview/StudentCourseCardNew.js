// import node module libraries
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	Image,
	Card,
	Row,
	Col,
	ProgressBar,
	Badge,
} from 'react-bootstrap';

// import utility file
import CourseCover from 'assets/images/background/course-cover-img.jpg';
import { gql, useQuery } from '@apollo/client';

const StudentCourseCardNew = ({ setIsLoading, item, progress, extraclass, discover }) => {

	const OPENEDX_URLS = gql`
	query getOrgId($_eq: String = "") {
		organisation(where: {domain: {_eq: $_eq}}) {
		  openedx_endpoint
		}
	  }
	`;
	
	const { data: orgData, loading: orgLoading } = useQuery(OPENEDX_URLS, {
		variables:{_eq:window.location.origin}
	})

	const CourseAndroid = () => {
		console.log('testing coursecard')
		if(window.Android && typeof window.Android.openNativeDashboard == 'function'){
			try{
				window.Android.openNativeDashboard(
					item.openedx_id
				);
			}
			catch(e) {
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

	/** Used in Course Index, Course Category, Course Filter Page, Student Dashboard etc...  */
	const GridView = () => {
		return (
			<>
				<Card 
					className={`d-none d-lg-flex card-hover shadow-md ${extraclass}`} 
					as={Link}
					onClick={()=>{!discover && setIsLoading(true)}}
					to={!discover ? `https://${orgData?.organisation[0]?.["openedx_endpoint"]}/auth/login/auth0-plugin/?auth_entry=login&next=${encodeURIComponent(`https://apps.${orgData?.organisation[0]?.["openedx_endpoint"]}/learning/course/${item.openedx_id}/home`)}` : '#'}
				>
					<Row className='g-0 h-100'>
						<Col className="col-md-5"
							onClick={() => {
								setIsLoading(true);
							}}
						>
							<Image src={item.course_image || CourseCover} className="img-left-rounded"
								style={{
									width: '100%',
									height: '100%', /* Ensure the image fills the entire container */
									objectFit: 'cover'
								}}
								onError={(e) => {
									e.target.src = CourseCover; // Set default image if there is an error
								}}
							/>
						</Col>
						<Col>
							{/* Card body  */}
							<Card.Body className='row h-100'>
								<h3 className="title fw-medium text-inherit text-truncate-line-2">
									{item.name}
								</h3>
								<Col className='align-self-end'>
									{!discover && <div className='d-flex align-items-center'>
										<ProgressBar
											variant="info"
											now={progress*100 || 0}
											className="col-10"
											style={{ height: '1em' }}
										/>
										<p className='ms-md-2 text-info fs-6 mb-0'>{progress*100 || 0}%</p>
									</div>}
								</Col>
							</Card.Body>
						</Col>
					</Row>
				</Card>
				
				{/* Mobile Responsive */}
				<Card className={`d-lg-none card-hover shadow-md ${extraclass}`} onClick={() => {!discover && CourseAndroid()}}>
					<Row className='g-0'>
						<Image
							src={item.course_image || CourseCover}
							alt=""
							className="card-img-top rounded-top-md"
							style={{
								width: '100%',
								height: '6rem',
								objectFit: 'cover',
								overflow: 'hidden'
							}}
							onError={(e) => {
								e.target.src = CourseCover; // Set default image if there is an error
							}}
						/>
						<Col>
							{/* Card body  */}
							<Card.Body className='my-n2 mx-n2'>
								<h3 className="fw-medium text-center title text-inherit text-truncate-line-2">
									{item.name}
								</h3>
								{!discover && <div className='d-flex align-items-center mb-n2'>
									<ProgressBar
										variant="info"
										now={progress}
										className="col-12"
										style={{ height: '1em' }}
									/>
								</div>}
							</Card.Body>
						</Col>
					</Row>
				</Card>
			</>
		);
	};

	return (
		<Fragment>
			<GridView />
		</Fragment>
	);
};

// Specifies the default values for props
StudentCourseCardNew.defaultProps = {
	free: false,
	viewby: 'grid',
	showprogressbar: false,
	extraclass: ''
};

// Typechecking With PropTypes
StudentCourseCardNew.propTypes = {
	item: PropTypes.object.isRequired,
	free: PropTypes.bool,
	viewby: PropTypes.string,
	showprogressbar: PropTypes.bool,
	extraclass: PropTypes.string
};

export default StudentCourseCardNew;
