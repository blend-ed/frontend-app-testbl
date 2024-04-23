// import node module libraries
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

// import sub components
import PaymentInvoiceDetails from './PaymentInvoiceDetails';
import { useMediaQuery } from 'react-responsive';

const PaymentDetails = () => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const isMobile = useMediaQuery({ maxWidth: 767 });

    return (
        <div className='m-n4 m-lg-0'>
            <Link
                to="#"
                className="text-muted fs-4 print-link no-print text-end me-5 mb-3 d-none d-md-block"
                onClick={handlePrint}
            >
                <i className="fe fe-printer"></i> Print
            </Link>
            <PaymentInvoiceDetails ref={componentRef} />
        </div>
    );
};

export default PaymentDetails;
