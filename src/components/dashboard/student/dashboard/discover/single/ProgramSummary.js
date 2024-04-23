// import node module libraries
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// import bootstrap icons

const ProgramSummary = (props) => {

	const { data } = props

	return (
		<Card className='h-100'>
			<Card.Header className="card-header">
				<div className="d-flex justify-content-between align-items-center">
					<div>
						<h4 className="mb-0 navbar-heading">What can be achieved</h4>
					</div>
				</div>
			</Card.Header>
			<Card.Body>
				<div dangerouslySetInnerHTML={{ __html: data }} />
			</Card.Body>
		</Card>
	);
};

export default ProgramSummary;
