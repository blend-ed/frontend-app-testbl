import { gql, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Button } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';

const CREATE_FREE_SUBSCRIPTION = gql`
    mutation MyMutation($designation: String = "", $email: String = "", $industry: String = "", $organisation_name: String = "", $phone_no: String = "", $referer: String = "", $organisation_url: String = "", $status: String = "", $name: String = "", $form: String = "") {
        insert_free_trial(objects: {designation: $designation, email: $email, industry: $industry, organisation_name: $organisation_name, phone_no: $phone_no, referer: $referer, organisation_url: $organisation_url, status: $status, name: $name, form: $form}) {
            affected_rows
        }
    }  
`;

const FormField = ({ fieldName, fieldLabel, required, placeholder, className, value, onChange }) => {
    return (
        <Form.Group controlId={fieldName} className='mb-4 position-relative col col-6'>
            {fieldLabel && <Form.Label className='d-flex align-items-center'>
                {fieldLabel}
                {required && <div className='ms-2 bg-light d-flex justify-content-center shadow-sm rounded-circle' style={{ height: '1rem', width: '1rem' }}>
                    <span className="text-dark my-auto fs-5">*</span>
                </div>}
            </Form.Label>}
            <Form.Control
                type="text"
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={className}
            />
        </Form.Group>
    )
}

const SandboxModalShow = (props) => {
    const { sandboxModalShow, handleCloseSandboxModal } = props;
    const [formError, setFormError] = useState('');
    const [getOrgUrl, setOrgUrl] = useState();
    const [hashParams, setHashParams] = useState('');

    // State to store form data
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        howDidYouHear: '',
        howDidYouHearOthers: '',
        organizationName: '',
        website: '',
        industry: '',
        designation: '',
    });

    const [createFreeSubscription] = useMutation(CREATE_FREE_SUBSCRIPTION);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    useEffect(() => {
        if (window.location.origin === 'http://localhost:3000') {
            setOrgUrl('http://localhost:3000');
        } else if (window.location.origin === 'https://marketing.blend-ed.com') {
            setOrgUrl('https://demo.blend-ed.com');
        } else {
            setOrgUrl('https://dashboard.blend-ed.com');
        }
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { fullName, email, industry, organizationName, phoneNumber, howDidYouHear, howDidYouHearOthers, website, designation } = formData;
            createFreeSubscription({
                variables: {
                    designation: designation,
                    email: email,
                    industry: industry,
                    organisation_name: organizationName,
                    phone_no: phoneNumber,
                    name: fullName,
                    referer: howDidYouHear === 'Others' ? howDidYouHearOthers : howDidYouHear,
                    organisation_url: website,
                    form: 'Sandbox',
                    status: 'Success'
                },
                onError: (error) => {
                    console.log(error);
                    if (error.message.includes('free_trial_phone_no_key')) {
                        toast.error('Phone number already used! Please use a different phone number.');
                    }
                    else if (error.message.includes('free_trial_username_key') || error.message.includes('free_trial_email_key')) {
                        toast.success('Form submitted successfully!');
                        setFormData({
                            fullName: '',
                            email: '',
                            phoneNumber: '',
                            howDidYouHear: '',
                            howDidYouHearOthers: '',
                            organizationName: '',
                            website: '',
                            industry: '',
                            designation: '',
                        });
                        localStorage.setItem('sandboxFormSubmitted', 'true');
                        handleCloseSandboxModal();
                    } 
                },
                onCompleted: () => {
                    toast.success('Form submitted successfully!');
                    setFormData({
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        howDidYouHear: '',
                        howDidYouHearOthers: '',
                        organizationName: '',
                        website: '',
                        industry: '',
                        designation: '',
                    });
                    localStorage.setItem('sandboxFormSubmitted', 'true');
                    handleCloseSandboxModal();
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setHashParams(window.location.hash.substring(1).split('&'));
    }, [])

    useEffect(() => {
        for (var i = 0; i < hashParams.length; i++) {
            var p = hashParams[i].split('=');
            if (document.getElementById(p[0])?.value) {
                document.getElementById(p[0]).value = decodeURIComponent(p[1]);;
            }
        }
    }, [hashParams])

    return (
        <Modal show={sandboxModalShow} centered size='lg'>
                    <Modal.Body>
                    <div className='d-flex align-items-center'>
                        <Form onSubmit={handleSubmit} className='w-100'>
                            <Row className='gx-6'>
                                <FormField fieldName='fullName' fieldLabel='Full Name' required={true} value={formData.fullName} onChange={handleInputChange} />

                                <FormField fieldName='email' fieldLabel='Email Address' required={true} value={formData.email} onChange={handleInputChange} />

                                <Form.Group controlId="phoneNumber" className="mb-4 position-relative col col-6">
                                    <Form.Label className='d-flex align-items-center'>
                                        Phone Number
                                        <div className='ms-2 bg-light d-flex justify-content-center shadow-sm rounded-circle' style={{ height: '1rem', width: '1rem' }}>
                                            <span className="text-dark my-auto fs-5">*</span>
                                        </div>
                                    </Form.Label>
                                    <PhoneInput
                                        country={'in'}
                                        inputStyle={{ height: '2.5rem', width: '100%', borderRadius: '.4rem', borderColor: '#cbd5e1' }}
                                        buttonStyle={{ height: '2.5rem', borderRadius: '.4rem', borderColor: '#cbd5e1', }}
                                        value={formData.phoneNumber}
                                        onChange={(e) => {
                                            setFormData((prevData) => ({
                                                ...prevData,
                                                phoneNumber: '+' + e,
                                            }));
                                        }}
                                        required
                                    />
                                </Form.Group>

                                <FormField fieldName='organizationName' fieldLabel='Organization Name' required={true} value={formData.organizationName} onChange={handleInputChange} />

                                <FormField fieldName='website' fieldLabel='Website' value={formData.website} onChange={handleInputChange} />

                                <FormField fieldName='designation' fieldLabel='Designation' value={formData.designation} onChange={handleInputChange} />

                                <Form.Group controlId="howDidYouHear" className='mb-4 col col-6'>
                                    <Form.Label className='d-flex align-items-center'>
                                        How did you hear about Blend-ed?
                                        <div className='ms-2 bg-light d-flex justify-content-center shadow-sm rounded-circle' style={{ height: '1rem', width: '1rem' }}>
                                            <span className="text-dark my-auto fs-5">*</span>
                                        </div>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.howDidYouHear}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option></option>
                                        <option>Open edX® Website</option>
                                        <option>Referral</option>
                                        <option>Google Search</option>
                                        <option>Blog</option>
                                        <option>Others</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="industry" className='mb-4 col col-6'>
                                    <Form.Label className='d-flex align-items-center'>
                                        Industry
                                        <div className='ms-2 bg-light d-flex justify-content-center shadow-sm rounded-circle' style={{ height: '1rem', width: '1rem' }}>
                                            <span className="text-dark my-auto fs-5">*</span>
                                        </div>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option></option>
                                        <option>Boot Camp</option>
                                        <option>Education Business</option>
                                        <option>Corporate Training</option>
                                        <option>Vocational Training Center</option>
                                        <option>Public School / College / University</option>
                                        <option>Private School / College / University</option>
                                    </Form.Control>
                                </Form.Group>

                                {formData.howDidYouHear === 'Others' && <FormField fieldName='howDidYouHearOthers' fieldLabel='' required={formData.howDidYouHear === 'Others'} placeholder='Give us a hint' className="mt-n3" />}

                                <div className='mt-2'>
                                    <Button variant="dark" type="submit" className='px-6'>
                                        Submit
                                    </Button>
                                </div>
                            </Row>

                        </Form>
                    </div>

                    </Modal.Body>
                </Modal>
    )
}

export default SandboxModalShow