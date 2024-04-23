// import node module libraries
import useUserDetails from '../../../hooks/useUserDetails';
import { useState } from 'react';
import {
    Col,
    Image,
    Navbar,
    Offcanvas
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'simplebar/dist/simplebar.min.css';

const NavbarBottomData = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'fe fe-home'
    },
    {
        name: 'Learn',
        path: '/learn',
        path2: '/programs',
        icon: 'fe fe-box'
    },
    {
        name: 'Progress',
        path: '/progress',
        icon: 'fe fe-activity'
    },
    {
        name: 'Discover',
        path: '/discover',
        icon: 'fe fe-search'
    }
]

export const NavbarBottomMenuData = [
    {
        name: 'Calendar',
        path: '/calendar',
        icon: 'fe fe-calendar'
    },
    {
        name: 'Payments',
        path: '/payment',
        icon: 'fe fe-credit-card'
    },
    {
        name: 'Account',
        path: '/account',
        icon: 'fe fe-user'
    }
]

const NavbarBottomMobile = () => {

    const { userDetails } = useUserDetails();

    const location = useLocation()

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <Navbar className="row align-items-center shadow-lg" fixed='bottom' bg='white'>
            {NavbarBottomData.map((item, index) => {
                return (
                    <Col
                        as={Link}
                        to={item.path}
                        className="text-center text-dark"
                        key={index}
                    >
                        <div
                            className={`fe ${item.icon} fw-bold fs-3 pt-2 ${(location.pathname.includes(item.path) || location.pathname.includes(item.path2))
                                ? "pb-2 bg-light-primary rounded rounded-4"
                                : "pb-2"
                                } `}
                        />
                    </Col>
                )
            })}
            <Col
                className="text-center text-dark"
                onClick={() => setShow(true)}
            >
                <Image src={userDetails?.profile_image} className="rounded-circle avatar-xs border border-2 border-dark" />
            </Col>
            <Offcanvas show={show} onHide={handleClose} placement={'bottom'} backdropClassName="bg-transparent" style={{ height: '6.4rem' }}>
                <div className='py-1 text-center' onClick={handleClose}>
                    <span className="fs-5 fw-bold fe fe-chevron-down"/>
                </div>
                <Offcanvas.Body className='row pt-2'>
                    {NavbarBottomMenuData.map((item, index) => {
                        return (
                            <Col
                                as={Link}
                                to={item.path}
                                className="text-dark"
                                key={index}
                                onClick={handleClose}
                            >
                                <div className='text-center'>
                                    <div className={`fe ${item.icon} fs-3 mb-1 fw-bold`}/>
                                    <div className="fs-6 fw-medium">{item.name}</div>
                                </div>
                            </Col>
                        )
                    })}
                </Offcanvas.Body>
            </Offcanvas>
        </Navbar>
    );
};

export default NavbarBottomMobile;
