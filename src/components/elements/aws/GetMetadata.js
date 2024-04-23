// get aws s3 object metadata
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3"

const GetMetadata = async (key, bucketName = 'blend-ed-public-asset') => {
    
    console.log(key, bucketName)

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    try {
        const response = await s3Client.send(
            new HeadObjectCommand({
                Bucket: bucketName,
                Key: key
            })
        )

        // console log header of the response
        console.log(response)

        return response.Metadata;
    } catch (error) {
        return error
    }
}

export default GetMetadata