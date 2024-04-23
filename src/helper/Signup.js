import { useAuth0 } from "@auth0/auth0-react";
import apple from "../assets/images/social/Apple.svg";
import google from "../assets/images/social/Google.svg";
import { Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const Signup = () => {

    const { loginWithRedirect } = useAuth0();

    const Buttons = [
        { icon: 'phone', name: 'SMS', color: 'login', connection: 'sms' },
        { icon: 'envelope', name: 'Email', color: 'login', connection: '' },
        { name: 'Google', color: 'outline-gray border border-2', connection: 'google-oauth2' },
        { name: 'Apple', color: 'outline-gray border border-2', connection: 'apple' }
    ]

    const isMobile = useMediaQuery({ maxWidth: 820 })

    return (
        <div className="vh-100" style={{ backgroundColor: 'white' }}>
            <div
                className="position-absolute top-50 start-50 translate-middle"
                style={{ maxHeight: '100vh', maxWidth: '100vw', minWidth: isMobile ? '90vw' : '21vw' }}
            >
                <div className="text-center mb-4">
                    <h1 style={{ color: '#1C223D' }}>Create Your Account</h1>
                    <p style={{ color: '#1C223D' }}>Sign Up to Continue.</p>
                </div>
                {Buttons.map((item, index) => (
                    <Link
                        key={index}
                        to='#'
                        onClick={() => { loginWithRedirect({authorizationParams: {screen_hint: 'signup', redirect_uri: `${window.location.origin}/dashboard`, connection: item.connection}}) }}
                        className={`d-flex justify-content-center btn btn-lg btn-${item.color} w-100 rounded-sm mb-4 fw-normal fs-4 ${(item.name === 'Google' || item.name === 'Apple') && 'text-dark-sp'}`}
                        style={{ border: '#e2e8f0' }}
                    >
                        {item.name === 'Google'
                            ? <Image src={google} fluid className="icon-xxs me-2" />
                            : item.name === 'Apple' ?
                                <Image src={apple} fluid className="icon-xxs me-2" />
                                : <i className={`fa-solid fa-${item.icon} me-2 align-self-center`} />
                        }
                        Continue with {item.name}
                    </Link>
                ))}
                <div className="d-flex">
                    <p className="text-dark-sp">
                        Already have an account?
                    </p>
                    <Link to='/' className="ms-2 fw-bold text-login">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup