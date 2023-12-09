import * as bcrypt from 'bcrypt';

const MAX_NUMBER = 999999;
const SALT_OR_ROUNDS = 10;

const generateRandomNumber = () => {
  const randomNumber = Math.floor(Math.random() * MAX_NUMBER + 1);
  return String(randomNumber).padStart(6, '0');
};

const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_OR_ROUNDS);
};

const decryptPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { generateRandomNumber, encryptPassword, decryptPassword };
