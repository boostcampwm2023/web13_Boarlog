import fs from 'fs';
import { S3 } from '../config/ncp.config';

const endpoint = process.env.NCP_ENDPOINT;
const bucketName = process.env.NCP_BUCKET_NAME as string;

const uploadFileToObjectStorage = async (file: any, filename: string) => {
  await S3.putObject({
    Bucket: bucketName,
    Key: `${filename}.mp3`,
    ACL: 'public-read',
    Body: fs.createReadStream(file)
  }).promise();

  const url = endpoint + '/' + bucketName + '/' + filename;
  return url;
};

export { uploadFileToObjectStorage };
