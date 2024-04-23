// import node module libraries
import React from 'react';
import { Card, Image, Row, Col, Table, Spinner } from 'react-bootstrap';

import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useContext } from 'react';
import { SubOrgContext } from '../../../../context/Context';
import { useMediaQuery } from 'react-responsive';

const PaymentInvoiceDetails = React.forwardRef((props, ref) => {

    const { id } = useParams()
    const { user } = useAuth0()

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const ConfigContext = useContext(SubOrgContext);

    const sub_org_name = 'localhost'

    const org = 'localhost'?.replace(/[^a-z0-9]/gi, '').toLowerCase()

    const ENROLLMENT_QUERY = gql`
    query GetInvoiceDetails($_eq: uuid, $org_url: String, $sub_org_name: String) {
		program(where: {id: {_eq: $_eq}, sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $org_url}}}}) {
		  discount
		  title
		}
		program_course(where: {program_id: {_eq: $_eq}, program: {sub_org: {name: {_eq: $sub_org_name}, organisation: {domain: {_eq: $org_url}}}}}) {
		  course_id
		}
		transactions(where: {user_id: {_eq: "${user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]}"}, program_id: {_eq: $_eq}, status: {_eq: "Completed"}}) {
		  price
		  created_at
		}
	  }	  
    `;

    const { data, loading } = useQuery(ENROLLMENT_QUERY, {
        variables: { _eq: id, org_url: window.location.origin, sub_org_name: sub_org_name }
    });

    const plan = user?.["https://hasura.io/jwt/claims"]["sub_org_plans"][sub_org_name]

    if (loading) {
        return <div className='text-center mb-5'>
            <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }

    const Details = {
        date: data.transactions[0].created_at,
        name: data.program[0].title,
        price: data.transactions[0].price / 100,
        discount: data.program[0].discount,
        courses: data.program_course.length
    }

    document.title = `Invoice - ${user.name} - ${Details.name}`;

    return (
        <Card className={isMobile && 'rounded-0'} ref={ref}>
            <Card.Body>
                {/* Card body */}
                <div className="d-flex justify-content-between mb-lg-6 mb-3">
                    <div>
                        {/* Images */}
                        {(org && plan !== 'Free') ?
                            <Image src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/brand/${org}/logo.png`} alt="" className="mb-4" height={'36em'} />
                            :
                            <Image src={`https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/brand/logo.png`} alt="" className="mb-4" height={'36em'} />}

                        <h4 className="mb-0">{org && org}</h4>
                        {/* <small>INVOICE ID: #1001</small> */}
                    </div>
                </div>
                <Row className='g-lg-4 g-2 mb-4'>
                    <Col sm={6}>
                        <span className="fs-6">Invoice To</span>
                        <h5 className="mb-0">{user.name}</h5>
                    </Col>
                    <Col sm={6}>
                        <span className="fs-6">Date</span>
                        <h6 className="mb-0">{Details.date.split('T')[0]}</h6>
                    </Col>
                </Row>
                {/* Table */}
                {!isMobile ? <div className="table-responsive mb-12">
                    <Table borderless className="mb-0 text-nowrap">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Program</th>
                                <th scope="col">Courses</th>
                                <th scope="col">Unit Price</th>
                                <th scope="col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-dark">
                                <td>
                                    {Details.name}
                                </td>
                                <td>{Details.courses}</td>
                                <td>{localStorage.getItem('currency')} {Details.price}</td>
                                <td>{localStorage.getItem('currency')} {Details.price}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            {Details.discount && <tr className="text-dark">
                                <td colSpan="2"></td>
                                <td colSpan="1" className="pb-0">
                                    Discount
                                </td>
                                <td className="pb-0">{localStorage.getItem('currency')} {Details.discount}</td>
                            </tr>}
                            <tr className="text-dark">
                                <td colSpan="2"></td>
                                <td colSpan="1" className="pt-0">
                                    Net Amount
                                </td>
                                <td className="pt-0">{localStorage.getItem('currency')} {Details.price - Details.discount}</td>
                            </tr>
                            <tr className="text-dark">
                                <td colSpan="2"></td>
                                <td colSpan="1" className="border-top py-1 fw-bold">
                                    Grand Total
                                </td>
                                <td className="border-top py-1 fw-bold">{localStorage.getItem('currency')} {Details.price - Details.discount}</td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
                    :
                    <div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Program</span>
                            <span className='fw-medium'>{Details.name}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Courses</span>
                            <span className='fw-medium'>{Details.courses}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Unit Price</span>
                            <span className='fw-medium'>{localStorage.getItem('currency')} {Details.price}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Amount</span>
                            <span className='fw-medium'>{localStorage.getItem('currency')} {Details.price}</span>
                        </div>
                        {Details.discount && <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Discount</span>
                            <span className='fw-medium'>{localStorage.getItem('currency')} {Details.discount}</span>
                        </div>}
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Net Amount</span>
                            <span className='fw-medium'>{localStorage.getItem('currency')} {Details.price - Details.discount}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="fs-6">Grand Total</span>
                            <span className='fw-medium'>{localStorage.getItem('currency')} {Details.price - Details.discount}</span>
                        </div>
                    </div>
                }
                {/* Short note */}
                <p className="border-top pt-3 mb-0 ">
                    Notes: Invoice was created on a computer and is valid without the
                    signature and seal.
                </p>
            </Card.Body>
        </Card>
    );
});

export default PaymentInvoiceDetails;
