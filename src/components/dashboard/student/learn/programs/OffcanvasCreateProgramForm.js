// import node module libraries
import { Col, Row, Form, InputGroup, Button } from 'react-bootstrap';

// import custom components
import { FlatPickr } from '../../../../../components/elements/flat-pickr/FlatPickr';
import { FormSelect } from '../../../../../components/elements/form-select/FormSelect';
import { DropFiles } from '../../../../../components/elements/dropfiles/DropFiles';

// import bootstrap icons
import { Image } from 'react-bootstrap-icons';
import Org from 'Org';

const OffcanvasCreateProgramForm = ({ onClick }) => {
	const privacyOptions = [
		{ value: 'Public to you team', label: 'Public to you team' },
		{
			value: 'Private to program members',
			label: 'Private to program members'
		},
		{ value: 'Private to you', label: 'Private to you' }
	];

	const teamMembers = [
		{ value: 'Eleanor Pena', label: 'Eleanor Pena' },
		{ value: 'Courtney Henry', label: 'Courtney Henry' },
		{ value: 'Assign to Owner', label: 'Assign to Owner' }
	];

	const programBudget = [
		{ value: 'Based on Program Amount', label: 'Based on Program Amount' },
		{ value: 'Based on Program Hours', label: 'Based on Program Hours' }
	];

	const priorityOptions = [
		{ value: 'High', label: 'High' },
		{ value: 'Medium', label: 'Medium' },
		{ value: 'Low', label: 'Low' }
	];

	return (
		<Form>
			<Row>
				{/* Program's Name */}
				<Col xs={12} className="mb-3">
					<Form.Group controlId="formProgramTitle">
						<Form.Label>
							Name <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter program title"
							required
						/>
					</Form.Group>
				</Col>

				{/* Description */}
				<Col xs={12} className="mb-3">
					<Form.Group controlId="formProgramBrief">
						<Form.Label>Description</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							placeholder="Enter brief about program..."
						/>
					</Form.Group>
				</Col>

				{/* Start Date */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Label>
						Start Date <span className="text-danger">*</span>
					</Form.Label>
					<InputGroup>
						<Form.Control as={FlatPickr} value={''} />
						<InputGroup.Text className="text-muted">
							<i className="fe fe-calendar"></i>
						</InputGroup.Text>
					</InputGroup>
				</Col>

				{/* End Date */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Label>
						End Date <span className="text-danger">*</span>
					</Form.Label>
					<InputGroup>
						<Form.Control as={FlatPickr} value={''} />
						<InputGroup.Text className="text-muted">
							<i className="fe fe-calendar"></i>
						</InputGroup.Text>
					</InputGroup>
				</Col>

				{/* Select Privacy */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Group controlId="formPrivacyOptions">
						<Form.Label>Privacy</Form.Label>
						<Form.Control
							as={FormSelect}
							placeholder="Select Privacy"
							options={privacyOptions}
						/>
					</Form.Group>
				</Col>

				{/* Team Members */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Group controlId="formTeamMembers">
						<Form.Label>Team Members</Form.Label>
						<Form.Control
							as={FormSelect}
							placeholder="Assign to owner"
							options={teamMembers}
						/>
					</Form.Group>
				</Col>

				{/* Program Budget */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Group controlId="formBudget">
						<Form.Label>Budget</Form.Label>
						<Form.Control
							as={FormSelect}
							placeholder="Program Budget"
							options={programBudget}
						/>
					</Form.Group>
				</Col>

				{/* Set Priority */}
				<Col md={6} xs={12} className="mb-3">
					<Form.Group controlId="formPriority">
						<Form.Label>Priority</Form.Label>
						<Form.Control
							as={FormSelect}
							placeholder="Set Priority"
							options={priorityOptions}
						/>
					</Form.Group>
				</Col>

				{/* Program logo */}
				<Col md={3} xs={12} className="mb-4">
					<div>
						<h5 className="mb-3">Program Logo </h5>
						<div className="icon-shape icon-xxl border rounded position-relative">
							<span className="position-absolute">
								<Image size={25} className="text-muted" />
							</span>
							<Form.Control
								type="file"
								className="form-control border-0 opacity-0"
							/>
						</div>
					</div>
				</Col>

				{/* Program Cover Image */}
				<Col xs={12} className="mb-4">
					<h5 className="mb-3">Cover Image </h5>
					<div className="dropzone mt-4 p-4 border-dashed text-center">
						<DropFiles />
					</div>
				</Col>

				{/* Buttons */}
				<Col xs={12}>
					<Button variant={(Org === 'xandy' ? `${Org}-primary` :`primary`)} type="submit">
						Submit
					</Button>
					<Button onClick={onClick} variant={`outline-` + (Org === 'xandy' ? `${Org}-primary` :`primary`)} className="ms-2">
						Close
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default OffcanvasCreateProgramForm;
