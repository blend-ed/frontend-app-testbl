import { useAuth0 } from '@auth0/auth0-react'
import React, { useContext, useEffect } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { RoleConfigContext, SubOrgContext } from '../../../../context/Context';
import { Link } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';


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

export default function VerifyMail() {
    const {user, isAuthenticated} = useAuth0()
    const ConfigContext = useContext(SubOrgContext)
    const sub_org_name = 'localhost'

    if (!isAuthenticated) location.replace('/login')

    const [sendEmailVerify, { data: emailVerifyRes }] = useLazyQuery(SEND_VERIFY_EMAIL)

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

    return (
        <div className='vh-100 d-flex align-items-center text-center justify-content-center'>
            <Alert variant="white" className='text-dark'>
                <Alert.Heading className='d-flex align-items-center justify-content-center'>Check your mail <span className='fe fe-mail ms-2'/></Alert.Heading>
                <p>
                    We've sent an email to {user.email}. Please check your inbox.
                </p>
                <hr />
                <p>
                It is important to verify your email address to guarantee the best email deliverability from {sub_org_name}.
                </p>
                <Button size='sm' as={Link} to='/logout' className='me-2' variant='outline-dark' onClick={sendVerificationMail}>Login again</Button>{' '}
                <Button size='sm' variant='dark' onClick={sendVerificationMail}>Resend verification mail</Button>{' '}
            </Alert>
        </div>
    )
}
