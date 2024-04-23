import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"

const DeleteMedia = async (data, bucketName = 'blend-ed-public-asset') => {

    console.log('banner file data: ' , data)

    // key format: mediaType/org/filename
    // eg: banners/blended/image.png
    const params = {
        Bucket: bucketName,
        Key: data
    }

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    try {
        const medias = await s3Client.send(
            new DeleteObjectCommand(params)
        )
        console.log(medias.$metadata.httpStatusCode)
        return medias.$metadata.httpStatusCode
    } catch (error) {
        return null
    }
}


export default DeleteMedia