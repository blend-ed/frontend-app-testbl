import { useAuth0 } from "@auth0/auth0-react";
import { useState, useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useLazyQuery } from '@apollo/client'
import { SubOrgContext } from '../context/Context';


const SEND_VERIFY_EMAIL = gql`
    query sendVerificationMail($auth0_id: String = "", $org_url: String = "", $sub_org: String = "") {
        sendVerificationEmail(auth0_id: $auth0_id, org_url: $org_url, sub_org: $sub_org) {
            data
            reason
            status
            err_msg
        }
    }
`

const EmailVerify = () => {
    const { user } = useAuth0();

    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    const [verificationStatus, setVerificationStatus] = useState(user?.["email_verified"]);
    const [isNotificationVisible, setIsNotificationVisible] = useState(true);

    const [sendEmailVerify, { data: emailVerifyRes }] = useLazyQuery(SEND_VERIFY_EMAIL)

    const closeNotification = () => {
        setIsNotificationVisible(false);
    };

    const sendVerificationMail = () => {
        console.log('send verify mail')
        sendEmailVerify({
            variables: {
                auth0_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-auth0-user-id"],
                org_url: window.location.origin,
                sub_org: sub_org_name
            }
        })
    }

    const emailSent = emailVerifyRes && emailVerifyRes.sendVerificationEmail && emailVerifyRes.sendVerificationEmail.status === 201

    if (!verificationStatus && !user?.["sub"].includes('sms') && isNotificationVisible) {
        return (
            <>
                <div className={`py-2 px-4 d-flex justify-content-between align-items-center bg-${!emailSent ? 'warning' : 'success'} text-white`}>
                    {!emailSent ?
                        <div>
                            <span>Please verify your account before it gets <strong>Deactivated</strong>. You only have 3 attempts to login without verifying your email.</span>
                            <Button variant="white" size="sm" className="ms-3 text-dark-warning" onClick={sendVerificationMail}>Resend Verification mail</Button>
                        </div>
                        :
                        <div>
                            <span>Verification mail has been sent to your mail</span>
                        </div>
                    }
                    <Link to='#' onClick={closeNotification} className="py-1 text-white">
                        <i className="fe fe-x"></i>
                    </Link>
                </div>
            </>
        );
    }

    return null;
};

export default EmailVerify;