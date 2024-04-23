// import node module libraries
import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Col, Row, ListGroup, Card } from 'react-bootstrap';

import DashboardDiscover from 'routes/dashboard/DashboardDiscover';

const CommonHeaderTabs = () => {
	const location = useLocation();

	return (
		<Fragment>
			<Row className='mt-md-n3 d-none d-md-block '>
				<Col xs={12} className="mb-4">
					<ListGroup as="ul" bsPrefix="nav nav-lb-tab">
						{DashboardDiscover.filter(function (dataSource) {
							return dataSource.title === 'Tabs';
						})
						.map((menuItem, index) => {
							return (
								<Fragment key={index}>
									{menuItem.children.map(
										(subMenuItem, subMenuItemIndex) => {
											return (
												<ListGroup.Item
													key={subMenuItemIndex}
													as="li"
													bsPrefix="nav-item"
													className={`${
														subMenuItemIndex === 0 ? 'ms-0 me-3' : ''
													} mx-3`}
												>
													<Link
														to={subMenuItem.link}
														className={`nav-link mb-sm-3 mb-md-0 ${
															location.pathname === subMenuItem.link
																? 'active'
																: ''
														}`}
													>
														{subMenuItem.name}
													</Link>
												</ListGroup.Item>
											);
										}
									)}
								</Fragment>
							);
						})}
					</ListGroup>
				</Col>
			</Row>
		</Fragment>
	);
};

export default CommonHeaderTabs;
