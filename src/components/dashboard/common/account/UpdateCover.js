import { useAuth0 } from "@auth0/auth0-react";
import Uppy from '@uppy/core';
import ImageEditor from "@uppy/image-editor";
import { DashboardModal } from '@uppy/react';
import Webcam from '@uppy/webcam';
import axios from 'axios';
import { useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useMediaQuery } from "react-responsive";

const UpdateCover = ({ coverImage }) => {

    const [modalShow, setModalShow] = useState(false);

    const [uppy] = useState(() => new Uppy(
        {
            allowMultipleUploadBatches: false,
            restrictions: {
                maxFileSize: 15 * 1024 * 1024,
                maxNumberOfFiles: 1,
                allowedFileTypes: ['.jpg', '.jpeg', 'gif', '.png'],
            },
        }
    )
        .use(Webcam)
        .use(ImageEditor, {
            quality: 0.8,
            cropperOptions: {
                viewMode: 1,
                background: false,
                autoCropArea: 1,
                responsive: true,
                zoomable: false,
            },
            actions: {
                revert: true,
                rotate: true,
                flip: true,
                zoomIn: true,
                zoomOut: true,
                cropSquare: true,
                cropWidescreen: true,
                cropWidescreenVertical: true,
            },
        })
    );

    const isMobile = useMediaQuery({ maxWidth: 767 })

    return (
        <div className="position-relative">
            {/* <Button variant="primary" size={isMobile ? "xs" : "sm"} className="position-absolute top-0 end-0 m-3 rounded" onClick={() => setModalShow(true) } >
                <i className="fe fe-edit me-2" />
                Edit Cover
            </Button> */}
            <Image src={coverImage} height={isMobile ? '80rem' : '160rem'} width={'100%'} style={{ objectFit: 'cover' }} />
            <DashboardModal
                uppy={uppy}
                closeModalOnClickOutside
                open={modalShow}
                onRequestClose={() => setModalShow(false)}
                plugins={['Webcam', 'ImageEditor']}
                metaFields={[
                    { id: 'name', name: 'Name', placeholder: 'File name' },
                ]}
            />
        </div>
    )
}

export default UpdateCover