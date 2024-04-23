// import node module libraries
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image } from 'react-bootstrap';

const thumbsContainer = {
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginTop: 16
};

const thumb = {
	display: 'inline-flex',
	borderRadius: 2,
	border: '1px solid #eaeaea',
	marginBottom: 8,
	marginRight: 8,
	width: 50,
	height: 50,
	padding: 4,
	boxSizing: 'border-box'
};

const thumbInner = {
	display: 'flex',
	minWidth: 0,
	overflow: 'hidden'
};

const img = {
	display: 'block',
	width: 'auto',
	height: '100%'
};

export const DropFilesVideos = ({setData}) => {
	const [files, setFiles] = useState([]);
	const { getRootProps, getInputProps } = useDropzone({
		accept: {'video/*': []},
		onDrop: (acceptedFiles) => {
			setFiles((prevFiles) => [
				...prevFiles,
				...acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file)
					})
				)]
			);
			
		}
	});

	useEffect(() => {
		setData(files)
	},[files])

	const thumbs = files.map((file) => (
		<div className='mx-2'>
			<div style={thumb} key={file.name}>
				<div style={thumbInner}>
					<Image src='https://cdn-icons-png.flaticon.com/512/101/101671.png' style={img} alt={file.name} />
				</div>
			</div>
			<i className='fs-6'>{file.name}</i>
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
		<section className="container">
			<div {...getRootProps({ className: 'dropzone p-4' })}>
				<input {...getInputProps()} />
				<p className='mb-0'>Drag & drop some files here, or click to select files</p>
			</div>
			{thumbs.length != 0 && <aside style={thumbsContainer}>{thumbs}</aside>}
		</section>
	);
};
