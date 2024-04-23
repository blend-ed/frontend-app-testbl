// import node module libraries
import { Row, Col, Card } from 'react-bootstrap';

// import custom components
import StatRightCenterIcon from 'components/dashboard/common/stats/StatRightCenterIcon';

const ProgramSection = () => {
	return (
		<Card>
			<Row >
				<Col lg={3} md={6} xs={12} >
					<StatRightCenterIcon
						value="3 Courses"
						iconName="book"
						iconColorVariant="primary"
					/>
				</Col>
				<Col lg={3} md={6} xs={12} className="border-start-md">
					<StatRightCenterIcon
						title="Estimated Time"
						value="6 Months"
						iconName="clock"
						iconColorvariant="outline-primary"
					/>
				</Col>
				<Col lg={3} md={6} xs={12} className="border-start-md">
					<StatRightCenterIcon
						title="Already Enrolled"
						value="15,467"
						iconName="pie-chart"
						iconColorVariant="tertiary"
					/>
				</Col>
				<Col lg={3} md={6} xs={12} className="border-start-md">
					<StatRightCenterIcon
						title="Program Fee"
						value="$450"
						iconName="dollar-sign"
						iconColorVariant="success"
					/>
				</Col>
			</Row>
		</Card>
	);
};
export default ProgramSection;
