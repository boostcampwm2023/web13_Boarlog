import { atom } from "recoil";

export const selectedSpeakerState = atom<string>({
  key: "selectedSpeaker",
  default: "default",
  dangerouslyAllowMutability: true
});

export default selectedSpeakerState;
