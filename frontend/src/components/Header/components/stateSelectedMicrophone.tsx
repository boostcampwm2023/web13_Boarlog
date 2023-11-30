import { atom } from "recoil";

export const selectedMicrophoneState = atom<string>({
  key: "selectedMicrophone",
  default: "default",
  dangerouslyAllowMutability: true
});

export default selectedMicrophoneState;
