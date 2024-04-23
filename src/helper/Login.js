import { useAuth0 } from "@auth0/auth0-react";
import apple from "../assets/images/social/Apple.svg";
import google from "../assets/images/social/Google.svg";
import { SubOrgContext } from "../context/Context";
import { useContext } from "react";
import { Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

const Login = () => {

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const isMobile = useMediaQuery({ maxWidth: 820 })

    location.replace('/dashboard');


    const Buttons = [
        { icon: 'phone', name: 'SMS', color: 'login', connection: 'sms' },
        { icon: 'envelope', name: 'Email', color: 'login', connection: '' },
        { name: 'Google', color: 'outline-gray border border-2', connection: 'google-oauth2' },
        { name: 'Apple', color: 'outline-gray border border-2', connection: 'apple' }
    ]
    
    let discover = ''
    if (window.location.hash.includes('discover')) {
        discover = window.location.hash.split('=')[1]
        localStorage.setItem('discover', discover)
    }
    
    if (!isAuthenticated) {
        return (
            <div className="vh-100" style={{ backgroundColor: 'white' }}>
                <div
                    className="position-absolute top-50 start-50 translate-middle"
                    style={{ maxHeight: '100vh', maxWidth: '100vw', minWidth: isMobile ? '90vw' : '21vw' }}
                >
                    <div className="text-center mb-4">
                        <h1 style={{ color: '#1C223D' }}>Welcome back</h1>
                        <p style={{ color: '#1C223D' }}>Log in to Your Account.</p>
                    </div>
                    {Buttons.map((item, index) => (
                        <Link
                            key={index}
                            to='#'
                            onClick={() => { loginWithRedirect({authorizationParams: {screen_hint: 'login', redirect_uri: `${window.location.origin}/login`, connection: item.connection, appState: {target: `${window.location.origin}/discover/single/${discover}`} }}) }}
                            className={`d-flex justify-content-center btn btn-lg btn-${item.color} w-100 rounded-1 mb-4 fw-normal fs-4 ${(item.name === 'Google' || item.name === 'Apple') && 'text-dark-sp'}`}
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
                            Don't have an account?
                        </p>
                        <Link to='/signup' className="ms-2 fw-bold text-login">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login