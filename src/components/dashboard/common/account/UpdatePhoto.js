import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { DropFilesPhotos } from '../../../../components/elements/dropfiles/DropFilesPhotos';
import { useState } from 'react';
import { Button, Card, Image, Modal, Placeholder, Spinner } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { toast } from 'react-toastify';

const UpdatePhoto = ({ name, profileImage, refetch, yearOfBirth, token }) => {
    const { user, getIdTokenClaims } = useAuth0()
    const username = user?.["https://hasura.io/jwt/claims"].openedx_username

    const [modalShow, setModalShow] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [isUploading, setIsUploading] = useState(false);


    const handlePhotoUpload = async (file) => {
        setIsUploading(true);
        const formData = new FormData();
        const token = await getIdTokenClaims();
        formData.append('file', file);
        formData.append('user_id', user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]);
        formData.append('org_url', window.location.origin);
        formData.append('img_type', file?.type || fileData?.type)

        const response = await axios.post(`https://${process.env.REACT_APP_CLOUD_FN_URL}/imageUploader`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Token": `${token["__raw"]}`
            }
        })

        if (response.status === 204) {
            toast.success('Photo Updated!')
            setModalShow(false)
            setFileData(null)
            setIsUploading(false)
        }
        else {
            console.log(JSON.parse(response.data.substring(4).replace(/'/g, '"')))
            toast.error(JSON.parse(response.data.substring(4).replace(/'/g, '"')).user_message)
        }
        refetch()
    };

    const isMobile = useMediaQuery({ maxWidth: 767 })

    if (!yearOfBirth && modalShow) {
        toast.error('Please update your year of birth to upload a photo')
        setModalShow(false)
    }

    return (
        <Card.Body className="px-lg-8 mt-lg-n10 mt-n6 mb-n2 d-flex align-items-end">
            <div className="position-relative">
                {profileImage ? <Image
                    src={profileImage}
                    roundedCircle
                    className={`${isMobile ? 'avatar-xl' : 'avatar-xxl'} border border-4 border-light`}
                />
                    :
                    <Placeholder animation="glow">
                        <Placeholder xs={4} className={`${isMobile ? 'avatar-xl' : 'avatar-xxl'} rounded-circle border border-4 border-white bg-gray`} />
                    </Placeholder>}
                <Button variant="primary" size={isMobile ? 'xs' : "sm"} onClick={() => setModalShow(true)} className="btn-icon rounded-circle position-absolute bottom-0 end-0" >
                    <i className="fe fe-edit" />
                </Button>
            </div>
            <div className="ms-4">
                <h4 className="fs-lg-3 mb-0">
                    {name}
                </h4>
                <p className="text-muted mb-0 fs-lg-4">
                    {username}
                </p>
            </div>
            {yearOfBirth &&
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    centered
                >
                    <Modal.Body className='p-2 text-center'>
                        <DropFilesPhotos setData={setFileData} limit={1} data={fileData} />
                        {fileData && fileData?.length !== 0 && (
                            <Button className="mt-2 px-4" size={isMobile && 'sm'} onClick={() => handlePhotoUpload(fileData[0])}>
                                {isUploading ? <Spinner animation="border" size="sm" variant="light" role="status" />
                                    :
                                    'Upload Photo'
                                }
                            </Button>
                        )}
                    </Modal.Body>
                </Modal>
            }
        </Card.Body>
    )
}

export default UpdatePhoto