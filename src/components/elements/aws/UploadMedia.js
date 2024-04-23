import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const UploadMedia = async (org, mediaType, data, bucketName = 'blend-ed-public-asset') => {
    // add new metadata
    // (org, file, newMetadata, bucketName = 'blend-ed-public-asset')
    // metatdata: {
    //     ...metadata,
    //     ...newMetadata
    // }
    console.log('banner file data: ' , data, org, org?.replace(/[^a-z0-9]/gi,'').toLowerCase(), mediaType, bucketName)
    console.log(process.env.REACT_APP_HASURA_URI, window.location.origin, org)

    const s3Client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
        }
    })

    let key =''

    // console.log('key', `${mediaType != '' ?  `${mediaType}/` : ''}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${data.name}`)

    // key format: mediaType/org/filename
    // eg: banners/blended/image.png
    // body format: file Type input
    try {
        console.log('up loading media')
        let statusCodes = [] // array to store status codes

        for (const file of data) {
            key = `${mediaType && `${mediaType}/`}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${file.name}`
            console.log('key', key)

            let metadata = {
                "org-url": window.location.origin,
                "sub-org": org?.replace(/[^a-z0-9]/gi,'').toLowerCase(),
                "hasura-endpoint": process.env.REACT_APP_HASURA_URI
            }
        

            const medias = await s3Client.send(
                new PutObjectCommand({
                    Bucket: bucketName,
                    Key: `${mediaType && `${mediaType}/`}${org?.replace(/[^a-z0-9]/gi,'').toLowerCase()}/${file.name}`,
                    Body: file,
                    ContentType: file.type,
                    ContentLength: file.size,
                    Metadata: metadata
                })
            )
            console.log(medias.$metadata.httpStatusCode)
            statusCodes.push(medias.$metadata.httpStatusCode) // push status code to array
        }
        return { statusCodes, key }
    } catch (error) {
        return null
    }
}


export default UploadMedia