import { gql, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import UpdatePhoto from "components/dashboard/common/profile/UpdatePhoto";
import { useEffect, useState } from "react";
import {
    Button,
    Col,
    Form, Modal, Row,
    Spinner
} from "react-bootstrap";

// import custom components
import countries from "components/dashboard/common/account/Countries";
import useUserDetails from "hooks/useUserDetails";

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $org_url: String
    $user_id: uuid
    $name: String
    $country: String
    $education: String
    $gender: String
    $year_of_birth: Int
    $mobile: String
  ) {
    updateProfile(
      method: "POST"
      user_id: $user_id
      org_url: $org_url
      name: $name
      gender: $gender
      education: $education
      country: $country
      year_of_birth: $year_of_birth
      phone_no: $mobile
    ) {
      status
      err_msg
    }
  }
`;

export const ProfileModal = ({ firstLogin }) => {

    const { user } = useAuth0();
    const { userDetails, userDetailsRefetch: refetch } = useUserDetails();

    const [formData, setFormData] = useState({});

    const [modalShow, setModalShow] = useState(firstLogin);

    const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

    useEffect(() => {
        if (userDetails) {
            const {
                name,
                username,
                gender,
                year_of_birth,
                country,
                mobile
            } = userDetails;
            setFormData({
                name: name || "",
                username: username || "",
                gender: gender || "",
                year_of_birth: year_of_birth || 2000,
                country: country || "IN",
                mobile: mobile || ""
            });
        }
    }, [userDetails]);

    const handleChange = (event, fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateProfile({
            variables: {
                org_url: window.location.origin,
                user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
                name: formData.name,
                country: formData.country,
                education: formData.education,
                year_of_birth: parseInt(formData.year_of_birth),
                gender: formData.gender,
                mobile: formData.mobile
            },
            onCompleted: () => {
                refetch();
                setModalShow(false);
            },
        });
    };

    return (
        <div>
            <Modal show={modalShow} size="lg" centered onHide={() => setModalShow(false)}>
                <Modal.Header className="d-block">
                    <h3 className="mb-0">Profile Information</h3>
                    <p className="fs-6 mb-0">
                        Update your profile information and get started with your learning
                    </p>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="gx-6 mx-2">
                            {userDetails.year_of_birth &&
                                <UpdatePhoto refetch={refetch} imgUrl={userDetails.profile_image} />
                            }

                            <Col md={6} sm={12} className="mb-4">
                                <Form.Group className="mb-3" controlId="formFullName">
                                    <Form.Label>Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name || ""}
                                        onChange={(event) => handleChange(event, "name")}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* Gender */}
                            <Col
                                md={6}
                                sm={12}
                                className="mb-4 d-flex align-items-center"
                            >
                                <Form.Group className="mb-3 w-100" controlId="formGender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.gender}
                                        onChange={(event) => handleChange(event, "gender")}
                                        required
                                    >
                                        <option value="m" selected={userDetails.gender === "m"}>Male</option>
                                        <option value="f" selected={userDetails.gender === "f"}>Female</option>
                                        <option value="o" selected={userDetails.gender === "o"}>Other</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            {/* Birthday */}
                            <Col md={6} sm={12} className="mb-4">
                                <Form.Group className="mb-3" controlId="formBirthday">
                                    <Form.Label>Year of Birth</Form.Label>
                                    <Form.Control
                                        value={formData.year_of_birth}
                                        type="number"
                                        min="1950"
                                        max="2023"
                                        required
                                        onChange={(event) =>
                                            handleChange(event, "year_of_birth")
                                        }
                                    />
                                </Form.Group>
                            </Col>

                            {/* Country */}
                            <Col md={6} sm={12} className="mb-4">
                                <Form.Group className="mb-3" controlId="formState">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.country}
                                        required
                                        onChange={(event) => handleChange(event, "country")}
                                    >
                                        {Object.keys(countries).map((country) => (
                                            <option key={country} value={countries[country]}>
                                                {country}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col md={6} sm={12} className="mb-4">
                                <Form.Group className="mb-3" controlId="formPhoneNo">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.mobile || ""}
                                        onChange={(event) => handleChange(event, "mobile")}
                                    />
                                </Form.Group>
                            </Col>

                            {/* Button */}
                            <Col sm={12} md={12} className="mb-2 text-start">
                                {!updateLoading && <Button variant="outline-primary" className="me-md-2" onClick={() => setModalShow(false)}>
                                    Skip
                                </Button>}{" "}
                                {updateLoading ?
                                    <Button variant="primary" type="submit" disabled>
                                        <Spinner animation="border" size="sm" />
                                    </Button> :
                                    <Button variant="primary" type="submit">
                                        Update Profile
                                    </Button>}
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}