import axios from 'axios';
import { useEffect, useState } from 'react';
const { gql, useMutation } = require("@apollo/client")

const GET_AWS_PRE_SIGNED_URL = gql`
    mutation getAWSPreSignedURL($client_action: String = "", $params: String = "") {
        getAWSPreSignedURL(client_action: $client_action, params: $params) {
            url
            err_msg
        }
    }
`

const useAWSHandler = () => {

    const [getAWSPreSignedURL, { data: signedURLData, loading, error }] = useMutation(GET_AWS_PRE_SIGNED_URL)
    const [uploadStatus, setUploadStatus] = useState(null);

    const uploadMedia = async (org, mediaType, data, bucketName = 'blend-ed-public-asset') => {

        console.log('banner file data: ', data, org, org?.replace(/[^a-z0-9]/gi, '').toLowerCase(), mediaType, bucketName)
        console.log(process.env.REACT_APP_HASURA_URI, window.location.origin, org)

        let key = ''

        try {
            console.log('up loading media')

            let statusCodes = [] // array to store status codes
            for (const file of data) {
                key = `${mediaType && `${mediaType}/`}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${file.name}`
                console.log('key', key)

                let metadata = {
                    "org-url": window.location.origin,
                    "sub-org": org,
                    "hasura-endpoint": process.env.REACT_APP_HASURA_URI
                }

                let params = {
                    Bucket: bucketName,
                    Key: `${mediaType && `${mediaType}/`}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${file.name}`,
                    // Body: file,
                    ContentType: file.type,
                    ContentLength: file.size,
                    Metadata: metadata
                }
                console.log(params)
                
                const statusCode = await new Promise((resolve, reject) => {
                    getAWSPreSignedURL({
                        variables: {
                            params: JSON.stringify(params),
                            client_action: 'put_object'
                        },
                        onCompleted: async (data) => {
                            console.log('data', data)
                            console.log('data', data.getAWSPreSignedURL.url)
                            // Send the file to the signed URL
                            try {
                                const result = await axios.put(data.getAWSPreSignedURL.url, file, {
                                    headers: {
                                        'Content-Type': file.type,
                                        'x-amz-meta-org-url': metadata['org-url'], // Include the same metadata here
                                        'x-amz-meta-sub-org': metadata['sub-org'],
                                        'x-amz-meta-hasura-endpoint': metadata['hasura-endpoint']
                                    },
                                    onUploadProgress: (progressEvent) => {
                                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                        console.log(`Upload Progress: ${progress}%`)
                                        setUploadStatus(progress*90/100)
                                    }
                                });
                                console.log('File uploaded successfully:', result.status);
                                resolve(result.status);
                            } catch (error) {
                                console.error('Error uploading file:', error);
                                reject(error);
                            }
                        }
                    })
                })
                
                statusCodes.push(statusCode) // push status code to array
                console.log('statusCode', statusCode)
            }
            
            console.log('statusCodes', statusCodes)
            return statusCodes
        } catch (error) {
            console.log(error);
            return null
        }

        // setUploadStatus({ statusCodes, key });
    };

    const fetchMedia = async (org, mediaType, bucketName = 'blend-ed-public-asset') => {
        console.log(org, org?.replace(/[^a-z0-9]/gi,'').toLowerCase(), mediaType, bucketName)

        // prefix: file containing folder path
        // eg: banners/blended/
        const params = {
            Bucket: bucketName,
            Delimiter: '/',
            Prefix: `${mediaType}/${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/`
        }

        // returns: list of files (keys: (<mediatype>/<org>/<filename>)), excludes folder
        try {
            console.log('fetching media')

            // const medias = await s3Client.send(
            //     new ListObjectsCommand(params)
            // )
            // return medias.Contents.filter(i => !i.Key.endsWith('/')).map(i => i.Key)

            console.log(params)

            const keys =  await new Promise((resolve, reject) => {
                getAWSPreSignedURL({
                    variables: {
                        params: JSON.stringify(params),
                        client_action: 'list_objects_v2'
                    },
                    onCompleted: async (data) => {
                        console.log('data', data)
                        console.log('data', data.getAWSPreSignedURL.url)
                        // get the list of files
                        try {
                            const result = await axios.get(data.getAWSPreSignedURL.url);
                            console.log('Files fetched successfully:', result);
                            const xml = new DOMParser().parseFromString(result.data, 'text/xml');
                            const keys = Array.from(xml.getElementsByTagName('Key')).map(key => key.textContent);
                            console.log('Keys:', keys);
                            resolve(keys);
                        } catch (error) {
                            console.error('Error fetching files:', error);
                            reject(error);
                        }
                    }
                })

            })

            console.log('keys', keys)
            return keys;

        } catch (error) {
            return null
        }
    };

    const getMetadata = async (key, bucketName = 'blend-ed-public-asset') => {
        // ...rest of your code
    };

    const deleteMedia = async (key, bucketName = 'blend-ed-public-asset') => {
        console.log('banner file data: ' , key)

        // key format: mediaType/org/filename
        // eg: banners/blended/image.png
        const params = {
            Bucket: bucketName,
            Key: key
        }

        try {
            console.log('deleting media')

            console.log(params)

            getAWSPreSignedURL({
                variables: {
                    params: JSON.stringify(params),
                    client_action: 'delete_object'
                },
                onCompleted: async (data) => {
                    console.log('data', data)
                    console.log('data', data.getAWSPreSignedURL.url)
                }
            })
        } catch (error) {
            console.log(error);
        }
    };

    const deleteFolder = async (folder, bucketName = 'blend-ed-public-asset') => {
        console.log('s3 folder to delete: ' , folder)

        try {
            // List all objects with the given prefix
            const listParams = {
                Bucket: bucketName,
                Prefix: folder
            }

            const keys = await new Promise((resolve, reject) => {
                getAWSPreSignedURL({
                    variables: {
                        params: JSON.stringify(listParams),
                        client_action: 'list_objects_v2'
                    },
                    onCompleted: async (data) => {
                        console.log('data', data);
                        console.log('data', data.getAWSPreSignedURL.url);
                        // Get the list of files
                        try {
                            const result = await axios.get(data.getAWSPreSignedURL.url);
                            console.log('Files fetched successfully:', result);
                            const xml = new DOMParser().parseFromString(result.data, 'text/xml');
                            const keys = Array.from(xml.getElementsByTagName('Key')).map(key => key.textContent);
                            console.log('Keys:', keys);
                            resolve(keys);
                        } catch (error) {
                            console.error('Error fetching files:', error);
                            reject(error);
                        }
                    }
                });
            });

            console.log('keys', keys);

            // If no objects were found, return
            if (keys.length === 0) return null;

            // Prepare delete parameters
            const deleteParams = {
                Bucket: bucketName,
                Delete: { Objects: [] }
            };

            // Add keys of all objects to the delete parameters
            keys.forEach((key) => {
                deleteParams.Delete.Objects.push({ Key: key });
            });

            console.log('deleteParams', deleteParams);

            const deleteStatus = await new Promise((resolve, reject) => {
                getAWSPreSignedURL({
                    variables: {
                        params: JSON.stringify(deleteParams),
                        client_action: 'delete_objects'
                    },
                    onCompleted: async (data) => {
                        console.log('data', data);
                        console.log('data', data.getAWSPreSignedURL.url);
                        resolve(data.getAWSPreSignedURL.url);
                    },
                    onError: (error) => {
                        console.error('Error deleting files:', error);
                        reject(error);
                    }
                });
            });

            console.log('deleteStatusCodes', deleteStatus);
            return deleteStatus;
        } catch (error) {
            console.error(error)
            return null
        }
    };

    const updateMetadata = async (org, file, newMetadata, bucketName = 'blend-ed-public-asset') => {
        // ...rest of your code
    };

    const multipartUpload = async (org, mediaType, data, bucketName = 'blend-ed-public-asset') => {
        // ...rest of your code
    };

    return {
        uploadMedia,
        fetchMedia,
        getMetadata,
        deleteMedia,
        deleteFolder,
        updateMetadata,
        multipartUpload,
        uploadStatus,
        setUploadStatus
    };
};

export default useAWSHandler;