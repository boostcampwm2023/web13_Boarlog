import { atom } from "recoil";
import { Socket } from "socket.io-client";

export const participantSocketRefState = atom<Socket | null>({
  key: "participantSocketRefState",
  default: null,
  dangerouslyAllowMutability: true
});

export default participantSocketRefState;
