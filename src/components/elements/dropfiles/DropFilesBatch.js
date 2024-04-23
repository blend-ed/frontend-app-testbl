// import node module libraries
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, Table } from 'react-bootstrap';
import { FileArrowUp } from 'react-bootstrap-icons';
import Papa from 'papaparse';
import { result } from 'lodash';
import { useMutation, gql } from '@apollo/client';


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
	width: 100,
	height: 100,
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


export const DropFilesBatch = ({setData}) => {
	const [rdata, setRData] = useState([])
	const [files, setFiles] = useState([]);

	// const [createUserAndEnroll, { data, loading, error }] = useMutation(CREATE_USER_AND_ENROLL)
	  
	const { getRootProps, getInputProps } = useDropzone({
		accept: {'.csv': []},
		onDrop: (files) => {
			setFiles(
				files.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file)
					})
				)
			);

			// {files && setData(files)}

			if (files) {
			  Papa.parse(files[0], {
				header: true,
				skipEmptyLines: true,
				complete: function(results) {
					// console.log("RData:", results.data);

					{results.data && setData(results.data)}
					{results.data && setRData(results.data)}
				}}

			  )
			}
		}
	});

	const thumbs = files.map((file) => (
		<div key={file.name}> 	{/* style={thumb} */}
			<div style={thumbInner}>
				{file.name}
			</div>
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
			<div {...getRootProps({ className: 'dropzone pb-2' })}>
				<input {...getInputProps()}/>
				<p>Drag & drop some files here, or click to select files</p>
				<span className="position-absolute">
								<FileArrowUp size={25} className="text-muted" />
				</span>
			</div>
			<aside style={thumbsContainer}>{thumbs}</aside>
			{rdata && <Table className="text-nowrap">
					<thead className="table-light">
						{/* {rdata.map(() => (
							<tr>
								{rdata.map((data) => (
									<th>
										{data}
									</th>
								))[0]}
							</tr>
						))[0]} */}
						{rdata[0] && 
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Role</th>
						</tr>
						}
					</thead>
					<tbody>
						{rdata.map((data) => {
							return (
								(data.name &&
								<tr>
									<td>{data.name}</td>
									<td>{data.email}</td>
									<td>{data.mobile}</td>
									<td>{data.role}</td>
								</tr>
								)
							);
						})}
					</tbody>
				</Table>}
		</section>
	);
};
