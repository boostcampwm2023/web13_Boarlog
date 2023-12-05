import { atom } from "recoil";
import { Socket } from "socket.io-client";

export const instructorSocketRefState = atom<Socket | null>({
  key: "instructorSocketRefState",
  default: null,
  dangerouslyAllowMutability: true
});

export default instructorSocketRefState;
