import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3"

const DeleteFolder = async (folder, bucketName = 'blend-ed-public-asset') => {

    console.log('banner file data: ' , folder)

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    try {
        // List all objects with the given prefix
        const listParams = {
            Bucket: bucketName,
            Prefix: folder
        }
        const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams))

        // If no objects were found, return
        if (listedObjects.Contents.length === 0) return null;

        // Prepare delete parameters
        const deleteParams = {
            Bucket: bucketName,
            Delete: { Objects: [] }
        };

        // Add keys of all objects to the delete parameters
        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });

        // Delete all objects
        const deletedObjects = await s3Client.send(new DeleteObjectsCommand(deleteParams))

        console.log(deletedObjects.$metadata.httpStatusCode)
        return deletedObjects.$metadata.httpStatusCode
    } catch (error) {
        console.error(error)
        return null
    }
}

export default DeleteFolder