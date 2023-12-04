import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getEmailByJwtPayload = (accessToken: string): string => {
  const payload = verifyJWT(accessToken) as JwtPayload;
  return payload.email;
};

const verifyJWT = (token: string) => {
  const secretKey = process.env.JWT_SECRET_KEY as string;
  return jwt.verify(token, secretKey);
};

export { getEmailByJwtPayload };
