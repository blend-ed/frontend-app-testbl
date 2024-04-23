// import node module libraries
import React, { Fragment, useState } from 'react';
import { Row, Col, Breadcrumb, Offcanvas, Button } from 'react-bootstrap';

// import sub components
// import OffcanvasCreateProjectForm from '../OffcanvasCreateProjectForm';
import ResultsListTable from './progress/GradebookTable';


const ProjectList = () => {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<Fragment>
			<Row>
				<Col xs={12}>
					<ResultsListTable onNewProject={handleShow} />
				</Col>
			</Row>
		</Fragment>
	);
};

export default ProjectList;
