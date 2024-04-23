// Desc: Update metadata of a file in S3 bucket

import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";

const UpdateMetadata = async (org, file, newMetadata, bucketName = 'blend-ed-public-asset') => {

    console.log(org, file, newMetadata, bucketName)

    let metadata = {
        "org-url": window.location.origin,
        "sub-org": org?.replace(/[^a-z0-9]/gi,'').toLowerCase(),
        "hasura-endpoint": process.env.REACT_APP_HASURA_URI
    }

    metadata = {
        ...metadata,
        ...newMetadata
    }

    const params = {
        Bucket: bucketName,
        CopySource: `${bucketName}/${file}`,
        Key: file,
        Metadata: metadata,
        MetadataDirective: "REPLACE",
    };

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    try {
        const command = new CopyObjectCommand(params);
        const response = await s3Client.send(command);
        return response;
    } catch (error) {
        console.error(error);
        return null
    }
}

export default UpdateMetadata;