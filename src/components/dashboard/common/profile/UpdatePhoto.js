import { useState } from "react";
import { Button, Col, Image, Modal, Spinner } from "react-bootstrap"
import { DropFiles } from "components/elements/dropfiles/DropFiles";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from 'react-toastify';
import axios from "axios";

const UpdatePhoto = ({imgUrl, refetch}) => {

    const { user } = useAuth0()

    const [modalShow, setModalShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [updated, setUpdated] = useState()
    const [error, setError] = useState()
    const [show, setShow] = useState(false);

    const [imgData, setImgData] = useState(null)

    const handlePhotoUpload = async (file) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', user?.["https://hasura.io/jwt/claims"]["x-hasura-user-id"]);
        formData.append('org_url', window.location.origin);
        formData.append('img_type', file.type)
    
        console.log(file.type)
    
        const response = await axios.post(`https://${process.env.REACT_APP_CLOUD_FN_URL}/imageUploader`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
          }
        })
    
        if (response.status === 204) {
            console.log(response)
            setUpdated(true)
            toast.success('Photo Updated!')
        }
        else {
            console.log(JSON.parse(response.data.substring(4).replace(/'/g, '"')))
            toast.error(JSON.parse(response.data.substring(4).replace(/'/g, '"')).user_message)
        }
    
        refetch()
        setIsLoading(false);
    };


    return(
        <Col
            md={6}
            sm={12}
            className="d-lg-flex align-items-center mt-md-n4 mt-2 text-center mb-6 mb-md-0"
        >
            <div className="position-relative me-md-3 mb-3 mb-md-0">
                <Image
                    src={imgUrl}
                    id="img-uploaded"
                    className={`avatar-xl rounded-circle ${isLoading && 'opacity-25'}`}
                    alt=""
                />
                {isLoading && <div className="position-absolute top-50 start-50 translate-middle">
                    <Spinner animation="grow" size="sm" variant="primary" role="status" className="mb-n1">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>}
            </div>
            <div>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setModalShow(true)}
                >
                    Change
                </Button>{" "}
                <Button variant="outline-danger" size="sm">
                    Delete
                </Button>
            </div>
            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="text-center">
                <div className="dropzone border-dashed text-center mb-3">
                    <DropFiles setData={setImgData}/>
                </div>
                <Button size='sm' variant="primary" onClick={() => {handlePhotoUpload(imgData), setModalShow(false)}} disabled={!imgData}>
                    Submit
                </Button>
                </Modal.Body>
            </Modal>
        </Col>
    )
}

export default UpdatePhoto