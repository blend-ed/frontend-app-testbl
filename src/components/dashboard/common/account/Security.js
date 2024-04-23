// import node module libraries
import React, { useState } from "react";
import {
    Col,
    Row,
    Form,
    Card,
    OverlayTrigger,
    Tooltip,
    Button,
    Spinner,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

// import custom components
import PasswordStrengthMeter from "../../../../components/elements/passwordstrength/PasswordStrengthMeter";
import { useAuth0 } from "@auth0/auth0-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";

const PASSWORD_RESET_MAIL = gql`
  mutation passwordResetMail($email: String = "", $org_url: String = "") {
    passwordResetMail(email: $email, org_url: $org_url) {
      message
      err_msg
    }
  }
`;

const PASSWORD_RESET = gql`
  mutation passwordReset(
    $org_url: String = ""
    $email: String = ""
    $user_id: String = ""
    $password: String = ""
    $oldpassword: String = ""
  ) {
    passwordReset(
      org_url: $org_url
      email: $email
      user_id: $user_id
      password: $password
      oldpassword: $oldpassword
    ) {
      message
      err_msg
    }
  }
`;

const Security = (props) => {

    const { userDetails, loading } = props;

    const { user } = useAuth0();

    const [sendResetMail] = useMutation(PASSWORD_RESET_MAIL, {
        variables: {
            org_url: window.location.origin,
            email: userDetails?.user.email,
        },
        onCompleted: () => {
            toast.success("Password reset mail sent successfully")
        }
    });

    const [passwordReset, { loading: resetLoading }] = useMutation(PASSWORD_RESET);

    const handleResetPasswordMailClick = () => {
        sendResetMail();
    };

    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [currentpassword, setCurrentPassword] = useState("");

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="grow" size="sm" variant="tertiary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <h3 className="mb-4">Account Information</h3>
            <h4 className="mb-0">Email Address</h4>
            <p>
                Your email address is{" "}
                <span className="text-success">{userDetails?.user.email}</span>
            </p>
            {user.sub.startsWith("auth0") &&
                (<>
                    <hr className="my-5" />
                    <div>
                        <h4 className="mb-0">Change Password</h4>
                        <p>
                            We will email you a confirmation when changing your password,
                            so please expect that email after submitting.
                        </p>
                        {/* Form */}
                        <Form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (confirmpassword === password) {
                                    passwordReset({
                                        variables: {
                                            org_url: window.location.origin,
                                            user_id: user?.["sub"],
                                            password: confirmpassword,
                                            oldpassword: currentpassword,
                                            email: userDetails?.user.email
                                        },
                                        onCompleted: () => {
                                            toast.success("Password changed successfully")
                                            setCurrentPassword("");
                                            setConfirmPassword("");
                                            setPassword("");
                                        }
                                    });
                                } else {
                                    toast.error("Password entered doesn't match");
                                }
                            }}
                        >
                            <Row>
                                <Col lg={6} md={12} sm={12}>
                                    {/* Current password */}

                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="currentpassword">
                                            Current Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="currentpassword"
                                            value={currentpassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    {/* New password */}
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="newpassword">
                                            New Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="newpassword"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Row className="align-items-center g-0">
                                        <Col sm={6}>
                                            <span
                                                data-bs-toggle="tooltip"
                                                data-placement="right"
                                                title=""
                                            >
                                                Password strength
                                                <OverlayTrigger
                                                    key="top"
                                                    placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-top">
                                                            Test it by typing a password in the field
                                                            below. To reach full strength, use at least 6
                                                            characters, a capital letter and a digit, e.g.
                                                            'Test01'
                                                        </Tooltip>
                                                    }
                                                >
                                                    <i className="fas fa-question-circle ms-1"></i>
                                                </OverlayTrigger>
                                            </span>
                                        </Col>
                                    </Row>
                                    <PasswordStrengthMeter password={password} />

                                    {/* Confirm new password */}
                                    <Form.Group className="mb-3">
                                        <Form.Label htmlFor="confirmpassword">
                                            Confirm New Password
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="confirmpassword"
                                            value={confirmpassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    {/* Button */}
                                    <Button
                                        type="submit"
                                        className={
                                            `btn btn-primary`
                                        }
                                        disabled={password === "" || confirmpassword === "" || currentpassword === "" || resetLoading}
                                    >
                                        {resetLoading ?
                                            <Spinner animation="border" size="sm" />
                                            :
                                            'Save Password'
                                        }
                                    </Button>
                                    <div className="col-6"></div>
                                </Col>
                                <Col lg={12} md={12} sm={12} className="mt-4">
                                    <p className="mb-0">
                                        Can't remember your current password?{" "}
                                        <Link
                                            to="#"
                                            onClick={() => handleResetPasswordMailClick()}
                                        >
                                            Reset your password via email
                                        </Link>
                                    </p>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </>)
            }
            <hr className="my-5" />
            <div className="mb-5">
                <div>
                    <h3 className="mb-0">Delete your account</h3>
                    <p>
                        Delete or Close your account permanently.
                    </p>
                </div>
                <span className="text-danger h4">Warning</span>
                <p>
                    If you close your account, you will be unsubscribed from all
                    your 0 courses, and will lose access forever.
                </p>
                <Link to="/dashboard" className="btn btn-outline-danger btn-sm">
                    Close My Account
                </Link>
            </div>
        </div>
    );
};

export default Security;
