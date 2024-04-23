// import node module libraries
import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth0 } from '@auth0/auth0-react';
import { gql, useQuery } from '@apollo/client';
import { useContext } from 'react';
import { SubOrgContext } from '../../../../context/Context';
import { useMediaQuery } from 'react-responsive';

const Payment = () => {
    const { user: student } = useAuth0();

    const ConfigContext = useContext(SubOrgContext);
    const sub_org_name = 'localhost';

    const [sortedTransactions, setSortedTransactions] = useState([]);

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const PAYMENT_QUERY = gql`
    query MyPrograms($_eq: uuid, $org_url: String, $sub_org_name: String) {
      transactions(
        where: {
          user_id: { _eq: $_eq }
          program: {
            sub_org: {
              name: { _eq: $sub_org_name }
              organisation: { domain: { _eq: $org_url } }
            }
          }
          status: { _in: ["Completed", "Failed"] }
        }
      ) {
        program {
          title
          id
        }
        price
        status
        razorpay_id
        updated_at
        id
      }
    }
  `;

    const { loading, error, data } = useQuery(PAYMENT_QUERY, {
        variables: {
            org_url: window.location.origin,
            _eq: student?.['https://hasura.io/jwt/claims']['x-hasura-user-id'],
            sub_org_name: sub_org_name,
        },
    });

    useEffect(() => {
        if (data) {
            setSortedTransactions(
                [...data.transactions].sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                )
            );
        }
    }, [data]);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (data.transactions.length === 0) {
        return (
            <Card>
                <Card.Body>
                    <h4 className="text-center mb-0 text-primary">
                        No payment data available.
                    </h4>
                </Card.Body>
            </Card>
        );
    }

    if (!isMobile) {
        return (
            <div>
                <Card className="border-0">
                    <Card.Header>
                        <div className="">
                            <h3 className="mb-0">Fees</h3>
                            {/* <p className="mb-0">You can find all of your fee payments here.</p> */}
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {/* Table */}
                        <div className="table-invoice table-responsive border-0 ">
                            <Table className="table mb-0 text-nowrap">
                                {data && (
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="border-bottom-0">
                                                Payment Id
                                            </th>
                                            <th scope="col" className="border-bottom-0">
                                                Program
                                            </th>
                                            <th scope="col" className="border-bottom-0">
                                                Date
                                            </th>
                                            <th scope="col" className="border-bottom-0">
                                                Amount
                                            </th>
                                            <th scope="col" className="border-bottom-0">
                                                Status
                                            </th>
                                            <th scope="col" className="border-bottom-0"></th>
                                        </tr>
                                    </thead>
                                )}
                                <tbody className="align-middle">
                                    {data ? (
                                        data.transactions.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.id.split('-')[0]}</td>
                                                <td>{item.program.title}</td>
                                                <td>
                                                    {new Date(item.updated_at).toLocaleDateString()}
                                                </td>
                                                <td>{localStorage.getItem('currency')} {item.price / 100}</td>
                                                <td>
                                                    <Badge
                                                        bg={item.status === 'Due' ? 'danger' : 'success'}
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    {
                                                        item.status == 'Due' ? (
                                                            <Link to="#" className={`btn btn-xs btn-primary`}>
                                                                <i className="fe fe-credit-card me-2 fw-bold" />
                                                                Pay
                                                            </Link>
                                                        ) : (
                                                            <Link
                                                                to={`/payment-invoice/${item.program.id}`}
                                                                className="btn btn-primary btn-xs"
                                                            >
                                                                <i className="fe fe-eye me-1" /> Show Invoice
                                                            </Link>
                                                        )
                                                        // <Link
                                                        // 	to={`assets/images/pdf/${item.pdf}`}
                                                        // 	target="_blank"
                                                        // 	className="fe fe-download align-middle"
                                                        // 	download
                                                        // />
                                                        // <DownloadButton amount_paid={item.price} program={item.title}/>
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <div className="bg-light rounded-bottom">
                                            <p className="mb-0">
                                                No fee data available; no fees paid yet.
                                            </p>
                                        </div>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    } else {
        return (
            <div className="mt-n2 mx-n2">
                {data &&
                    sortedTransactions.map((item, index) => (
                        <Card
                            key={index}
                            className="position-relative overflow-hidden mb-3 text-dark"
                            as={Link}
                            to={`/payment-invoice/${item.program.id}`}
                        >
                            <Card.Body className="pb-2 pt-2 px-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div
                                        className="fw-semi-bold text-truncate-line-2"
                                    // style={{ height: '3rem' }}
                                    >
                                        {item.program.title}
                                    </div>
                                    <div className="fa-solid fa-chevron-right" />
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="fs-6">
                                        {new Date(item.updated_at).toLocaleDateString('en-IN')}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="fs-6">{localStorage.getItem('currency')} {item.price / 100}</div>
                                        <div
                                            className={`ms-2 fa-solid fa-circle-${item.status === 'Due' ? 'minus' : 'check'
                                                } text-${item.status === 'Due' ? 'warning' : 'success'}`}
                                        />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
            </div>
        );
    }
};

export default Payment;
