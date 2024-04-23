// import node module libraries
import { Alert, Button, Col, Form, NavLink, Placeholder, Row, Spinner } from "react-bootstrap";

// import profile layout wrapper
import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import Select from "react-select";
import countries from "./Countries";

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from "react-toastify";
import { CertificateCard } from "./CertificateCard";

const GET_USER_DETAILS = gql`
    query getUserDetails($method: String = "", $org_url: String = "", $user_id: uuid = "") {
        userDetails(method: $method, org_url: $org_url, user_id: $user_id) {
            err_msg
            course_certificates
        }
    }  
`;

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

// const OPENEDX_URL = gql``

const Profile = (props) => {

    const { userDetails, loading, refetch } = props;

    const { user } = useAuth0();

    const [formData, setFormData] = useState({});
    const [initialFormData, setInitialFormData] = useState({});

    const [isEditing, setIsEditing] = useState({
        name: false,
        username: false,
        gender: false,
        year_of_birth: false,
        country: false,
    });

    const { data: courseCertificates, loading: courseCertificatesLoading } = useQuery(GET_USER_DETAILS, {
        variables: {
            method: "GET",
            org_url: window.location.origin,
            user_id: user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"],
        },
    });

    const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
        onCompleted: () => {
            toast.success("Profile updated successfully!");
            refetch();
        },
    });


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
            const initialData = {
                name: name || "",
                username: username || "",
                gender: gender || "",
                year_of_birth: year_of_birth || "",
                country: country || "",
                mobile: mobile || ""
            };
            setFormData(initialData);
            setInitialFormData(initialData); // Set the initial form data
        }
    }, [userDetails]);

    const handleChange = (event, fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: event.target.value,
        }));
    };

    const handleSelectChange = (selectedOption, fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };

    const handleEditClick = (fieldName) => {
        setIsEditing((prevIsEditing) => ({
            ...prevIsEditing,
            [fieldName]: true,
        }));
    };

    const handleCancelEdit = (fieldName) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [fieldName]: userDetails[fieldName],
        }));
        setIsEditing((prevIsEditing) => ({
            ...prevIsEditing,
            [fieldName]: false,
        }));
    };

    const handleSaveEdit = (fieldName) => {

        if (fieldName === 'mobile' && !isValidPhoneNumber(formData.mobile)) {
            toast.error('Invalid phone number!');
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            // If the form data has not changed, simply return from the function
            handleCancelEdit(fieldName);
            return;
        }

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
                handleCancelEdit(fieldName);
            },
        });
    };

    const isYearOfBirthAdded = userDetails?.year_of_birth;

    const renderField = (label, fieldName) => {
        const isEditable = isEditing[fieldName];
        const fieldValue = formData[fieldName] || userDetails?.[fieldName];

        const getDisplayGender = (value) => {
            switch (value) {
                case 'm':
                    return 'Male';
                case 'f':
                    return 'Female';
                case 'o':
                    return 'Prefer not to say';
                default:
                    return value;
            }
        }

        const getYears = () => {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 100; // Change this to the year you want to start from
            const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i);
            return years;
        }

        const countryOptions = Object.entries(countries).map(([label, value]) => ({ label, value }));

        const showDetails = isYearOfBirthAdded || fieldName === 'year_of_birth' || fieldName === 'name' || fieldName === 'email'

        if (!showDetails) {
            return null;
        }

        return (
            <Col md={6} sm={12} className="mb-4 pe-lg-8">
                <p className="mb-1 fs-6">{label}</p>
                {loading ? <Placeholder xs={6} className="mb-2 rounded text-gray" /> : isEditable ? (
                    <div>
                        {fieldName === 'mobile' ? (
                            <PhoneInput
                                international
                                defaultCountry="US"
                                value={fieldValue}
                                onChange={(value) => handleSelectChange({ value }, fieldName)}
                                className="me-2"
                            />
                        ) : fieldName === 'country' ? (
                            <Select
                                value={countryOptions.find(option => option.value === fieldValue)}
                                onChange={(selectedOption) => handleSelectChange(selectedOption, fieldName)}
                                options={countryOptions}
                                className="me-2"
                                isSearchable
                            />
                        ) : fieldName === 'year_of_birth' ? (


                            <Select
                                size="sm"
                                value={{ value: formData[fieldName], label: formData[fieldName] }}
                                options={getYears().map(year => ({ value: year, label: year }))}
                                onChange={dobData => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        [fieldName]: dobData.value
                                    }));
                                }}
                            />



                        ) : fieldName === 'gender' ? (
                            <Select
                                size="sm"
                                value={{ value: fieldValue, label: getDisplayGender(fieldValue) }}
                                onChange={e => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        [fieldName]: e.value
                                    }));
                                }}
                                options={[
                                    { value: 'm', label: 'Male' },
                                    { value: 'f', label: 'Female' },
                                    { value: 'o', label: 'Prefer not to say' },
                                ]}
                                className="me-2"
                                required
                            />
                        ) : (
                            <Form.Control
                                size="sm"
                                type="text"
                                defaultValue={fieldValue}
                                onChange={(event) => handleChange(event, fieldName)}
                                required
                                className="me-2"
                            />
                        )}
                        <div className="mt-2">
                            {!updateLoading && <Button size={'sm'} className="me-2" variant="outline-primary" onClick={() => handleCancelEdit(fieldName)}>
                                Cancel
                            </Button>}
                            <Button size={'sm'} variant="primary" onClick={() => handleSaveEdit(fieldName)}>
                                {updateLoading ? (
                                    <Spinner animation="border" size="sm" variant="light" role="status" className="mt-1">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </div>
                    </div>
                ) :
                    !(userDetails[fieldName]) ? (
                        <div className="d-flex">
                            <Button size={'xs'} variant="outline-primary" onClick={() => handleEditClick(fieldName)}>
                                Add
                            </Button>
                        </div>
                    )
                        : (
                            <div className="d-flex">
                                <h5>{countryOptions.find(option => option.value === fieldValue)?.label || getDisplayGender(fieldValue)}</h5>
                                <NavLink onClick={() => handleEditClick(fieldName)}>
                                    <span className="ms-2 fe fe-edit" />
                                </NavLink>
                            </div>
                        )
                }
            </Col>
        );
    };

    return (
        <div className="mb-n4">
            <div className="mb-4">
                <h3>Profile Information</h3>
                {!isYearOfBirthAdded && !loading &&
                    <Alert variant="info" className="py-2 bg-light-info">
                        Complete profile information will only be shown and made editable if you
                        <span onClick={() => handleEditClick('year_of_birth')} className="ms-1 text-decoration-underline fw-medium" as={NavLink} style={{ cursor: 'pointer' }}>
                            add the year of birth
                        </span>
                        .
                    </Alert>}
            </div>
            <Row>
                {renderField("Full Name", "name")}
                <Col md={6} sm={12} className="mb-4 pe-lg-8">
                    <p className="mb-1 fs-6">Email</p>
                    <h5>{loading ? <Placeholder xs={6} className="mb-2 rounded text-gray" /> : userDetails?.user?.email}</h5>
                </Col>
                {renderField("Phone Number", "mobile")}
                {renderField("Year of Birth", "year_of_birth")}
                {renderField("Gender", "gender")}
                {renderField("Country", "country")}
            </Row>
            {courseCertificates?.userDetails?.course_certificates?.length > 0 && <>
                <hr />
                <div className="my-6">
                    <h3 className="mb-3">Course Certificates</h3>
                    <Row className={"g-4"}>
                        {courseCertificates?.userDetails?.course_certificates?.map((certificate, index) => (
                            <Col lg={5} key={index}>
                                <CertificateCard certificate={certificate} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </>}
        </div>
    );
};

export default Profile;
