// import node module libraries
import { useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

export const DropFilesPhotos = ({ setData, limit, currentImage, ORG, course }) => {
    const [files, setFiles] = useState([]);
    const [removed, setRemoved] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file)
                    })
                )
            );
        },
        maxFiles: limit
    });

    const handleRemove = (file) => {
        setFiles(files.filter((f) => f.name !== file.name));
        setRemoved(true);
    }

    useEffect(() => {
        setData(files)
    }, [files])

    useEffect(() => {
        if (currentImage && (!files.length || files[0].preview !== currentImage)) {
            setFiles([{ preview: currentImage }])
        }
    }, [currentImage])

    const thumbs = files.map((file) => (
        <div key={file.name} className='m-4 position-relative'>
            <div className='position-absolute top-0 start-100 translate-middle'>
                <button className='btn btn-dark py-0 px-1 rounded-circle btn-sm fe fe-x' onClick={() => handleRemove(file)}></button>
            </div>
            <Image
                src={removed ? file.preview : currentImage ? (course ? currentImage : `https://blend-ed-public-asset.s3.ap-south-1.amazonaws.com/programCardImages/${ORG}/${file.preview}`) : file.preview}
                alt={file.name}
                fluid
                style={{ objectFit: 'contain', height: '100%' }}
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = file.preview
                }}
            />
        </div>
    ));

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        },
        [files]
    );

    return (
        <section className="dropzone border-dashed rounded">
            {!(files.length > 0) ? <div {...getRootProps({ className: 'dropzone' })} style={{ height: '20rem' }} className='d-flex flex-column align-items-center'>
                <input {...getInputProps()} />
                <p className='fs-3 text-dark my-auto text-center px-4'>Drop files here, or <Link to="#">click</Link> to select files</p>
            </div>
                :
                <aside style={{ height: '20rem' }} className='d-flex justify-content-center'>{thumbs}</aside>}
        </section>
    );
};
