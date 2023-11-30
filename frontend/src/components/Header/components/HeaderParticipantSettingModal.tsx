import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";

import selectedSpeakerState from "./stateSelectedSpeaker";
import speakerVolmeState from "./stateSpeakerVolme";

interface HeaderSettingModalProps {
  isSettingClicked: boolean;
  setIsSettingClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSettingModal = ({ isSettingClicked, setIsSettingClicked }: HeaderSettingModalProps) => {
  const [speakerDevices, setSpeakerDevices] = useState<MediaDeviceInfo[]>([]);

  const setSelectedSpeaker = useSetRecoilState(selectedSpeakerState);
  const setSpeakerVolume = useSetRecoilState(speakerVolmeState);

  useEffect(() => {
    // 마이크 장치 목록 가져오기
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const microphones = devices.filter((device) => device.kind === "audiooutput");
        setSpeakerDevices(microphones);
      })
      .catch((error) => {
        console.error("입력 장치 목록 불러오기 실패", error);
      });
  }, []);

  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSettingClicked(!isSettingClicked)}
      />
      <div
        className={`flex flex-col fixed sm:absolute top-24 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-4 items-center gap-4 px-6 py-4 w-11/12 sm:w-96 h-fit bg-grayscale-white rounded-xl border-default duration-500 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-row gap-3 w-full justify-start">
          <p id="input-device-label">스피커 선택</p>
        </div>

        <select
          aria-labelledby="input-device-label"
          className="border w-full rounded-xl px-3 py-4"
          onChange={(e) => setSelectedSpeaker(e.target.value)}
        >
          {speakerDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `스피커 ${speakerDevices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>

        <div className="flex flex-row gap-3 w-full h-10 justify-start">
          <label htmlFor="volumeSlider">스피커 볼륨</label>
        </div>
        <input
          className="w-full"
          type="range"
          id="volumeSlider"
          min="0"
          max="1"
          step="0.01"
          onChange={(e) => setSpeakerVolume(parseFloat(e.target.value))}
        />

        <div className="flex flex-row gap-4 w-full"></div>
      </div>
    </>
  );
};

export default HeaderSettingModal;
