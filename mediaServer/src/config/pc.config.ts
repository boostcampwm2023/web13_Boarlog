import dotenv from 'dotenv';

dotenv.config();

export const pc_config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302']
    },
    {
      urls: process.env.TURN_URL as string,
      username: process.env.TURN_USERNAME as string,
      credential: process.env.TURN_PASSWORD as string
    }
  ]
};
