import { gql, useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import DarkLightMode from "../../../../layouts/DarkLightMode";
import { useState } from "react";
import { Button, Col, Form, NavLink, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";

const GET_SUB_ORGS = gql`
    query getSubOrgs($domain: String = "", $user_id: uuid = "") {
        organisation_user(where: {user_id: {_eq: $user_id}, sub_org: {organisation: {domain: {_eq: $domain}}}}, distinct_on: sub_org_id) {
            sub_org {
                name
                id
            }
        }
    }
`;

const GET_USER_DETAILS = gql`
    query GetUserDetails($user_id: uuid = "", $domain: String = "") {
        user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}) {
            id
            default_suborg_details {
                name
                id
            }
        }
    }
`;

const UPDATE_DEFAULT_SUBORG = gql`
    mutation updateDefaultSuborg($user_id: uuid = "", $domain: String = "", $default_suborg: uuid = "") {
        update_user_details(where: {user_id: {_eq: $user_id}, organisation: {domain: {_eq: $domain}}}, _set: {default_suborg: $default_suborg}) {
            returning {
                default_suborg_details {
                    name
                }
            }
        }
    }  
`;  

const Preferences = () => {

    const { user } = useAuth0();

    const [isEditing, setIsEditing] = useState(false)
    
    const [defaultSubOrg, setDefaultSubOrg] = useState(null);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const { data: subOrgs, loading: subOrgsLoading } = useQuery(GET_SUB_ORGS, {
        variables: {
            domain: window.location.origin,
            user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"]
        }
    });

    const { data: userDetails, refetch } = useQuery(GET_USER_DETAILS, {
        variables: {
            user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"],
            domain: window.location.origin
        }
    });

    const [updateDefaultSuborg, { loading: updateLoading }] = useMutation(UPDATE_DEFAULT_SUBORG);

    const handleSaveClick = () => {
        updateDefaultSuborg({
            variables: {
                user_id: user?.['https://hasura.io/jwt/claims']["x-hasura-user-id"],
                domain: window.location.origin,
                default_suborg: defaultSubOrg
            },
            onCompleted: () => {
                setIsEditing(false);
                refetch();
                toast.success('Default sub-organisation updated successfully');
            }
        });
    };

    const subOrgOptions = subOrgs?.organisation_user.map(org => ({
        value: org.sub_org.id,
        label: org.sub_org.name
    }));

    return (
        <div>
            <h3 className="mb-4">Preferences</h3>
            <Row className="mb-3">
                <Col>
                    <p className="mb-1 fs-6">Theme</p>
                    <DarkLightMode />
                </Col>
                {(userDetails && userDetails.user_details.length > 0) ? <Col>
                    <p className="mb-1 fs-6">Default Sub-organisation</p>
                    {isEditing ? (
                        <Form>
                            <Select
                                options={subOrgOptions}
                                isDisabled={subOrgsLoading}
                                isLoading={subOrgsLoading}
                                defaultValue={subOrgOptions.find(org => org.value === userDetails?.user_details[0]?.default_suborg_details?.id)}
                                onChange={(selectedOption) => setDefaultSubOrg(selectedOption.value)}
                            />
                            <div className="mt-2">
                                {!updateLoading && <Button size={'sm'} className="me-2" variant="outline-primary" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>}
                                <Button size={'sm'} variant="primary" onClick={handleSaveClick}>
                                    {updateLoading ? (
                                        <Spinner animation="border" size="sm" variant="light" role="status" className="mt-1">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    ) : (
                                        "Save"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    ) :
                    !(userDetails?.user_details[0]?.default_suborg_details?.name) ? (
                        <div className="d-flex">
                            <Button size={'xs'} variant="outline-primary" onClick={handleEditClick}>
                                Add
                            </Button>
                        </div>
                    )
                        : (
                            <div className="d-flex">
                                <h5>{userDetails.user_details[0]?.default_suborg_details?.name}</h5>
                                <NavLink onClick={handleEditClick}>
                                    <span className="ms-2 fe fe-edit" />
                                </NavLink>
                            </div>
                        )
                }
                </Col>
                :
                <Col>
                    <p className="mb-1 fs-6">Default Sub-organisation</p>
                    <p className="mb-1 fs-6"><i>Save your user details to set default sub-organisation</i></p>
                </Col>}
            </Row>
        </div>
    );
}

export default Preferences;