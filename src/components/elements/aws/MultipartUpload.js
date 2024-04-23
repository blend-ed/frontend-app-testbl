import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const UploadMedia = async (org, mediaType, data, bucketName = 'blend-ed-public-asset') => {
    
    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    try {
        let statusCodes = []; // array to store status codes
        for (const file of data) {
            const params = {
                Bucket: bucketName,
                Key: `${mediaType && `${mediaType}/`}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${file.name}`,
                Body: file,
                ContentType: file.type,
                ContentLength: file.size
            };

            const uploader = new Upload({
                client: s3Client,
                params: params
            });

            uploader.on('httpUploadProgress', (progress) => {
                console.log(`Uploaded: ${progress.loaded} / ${progress.total}`);
            });

            await uploader.done();

            statusCodes.push(200); // push status code to array
        }
        return statusCodes; // return array of status codes
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default UploadMedia;