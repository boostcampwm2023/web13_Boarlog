import AWS from 'aws-sdk';

const endpoint = process.env.NCP_ENDPOINT;
const region = process.env.NCP_REGION;
const access_key = process.env.NCP_ACCESS_KEY as string;
const secret_key = process.env.NCP_SECRET_KEY as string;

export const S3 = new AWS.S3({
  endpoint: endpoint,
  region: region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key
  }
});
