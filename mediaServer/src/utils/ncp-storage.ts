import fs from 'fs';
import AWS from 'aws-sdk';

const endpoint = process.env.NCP_ENDPOINT;
const region = process.env.NCP_REGION;
const access_key = process.env.NCP_ACCESS_KEY as string;
const secret_key = process.env.NCP_SECRET_KEY as string;
const bucketName = process.env.NCP_BUCKET_NAME as string;

const S3 = new AWS.S3({
  endpoint: endpoint,
  region: region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key
  }
});

const saveFile = async (file: any, filename: string) => {
  await S3.putObject({
    Bucket: bucketName,
    Key: `${filename}.mp4`,
    ACL: 'public-read',
    Body: fs.createReadStream(file)
  }).promise();

  const url = endpoint + '/' + bucketName + '/' + filename;
  return url;
};

export { saveFile };
