import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3"

const FetchMedia = async (org, mediaType, bucketName = 'blend-ed-public-asset') => {

    console.log(org, org?.replace(/[^a-z0-9]/gi,'').toLowerCase(), mediaType, bucketName)

    // prefix: file containing folder path
    // eg: banners/blended/
    const params = {
        Bucket: bucketName,
        Delimiter: '/',
        Prefix: `${mediaType}/${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/`
    }

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    // returns: list of files (keys: (<mediatype>/<org>/<filename>)), excludes folder
    try {
        const medias = await s3Client.send(
            new ListObjectsCommand(params)
        )
        return medias.Contents.filter(i => !i.Key.endsWith('/')).map(i => i.Key)
    } catch (error) {
        return null
    }
}


export default FetchMedia