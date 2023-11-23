import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import selectedMicrophoneState from "./stateMicrophone";
import micVolmeState from "./stateMicVolme";

interface HeaderSettingModalProps {
  isSettingClicked: boolean;
  setIsSettingClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSettingModal = ({ isSettingClicked, setIsSettingClicked }: HeaderSettingModalProps) => {
  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const setSelectedMicrophone = useSetRecoilState(selectedMicrophoneState);
  const setMicVolume = useSetRecoilState(micVolmeState);

  useEffect(() => {
    // 마이크 장치 목록 가져오기
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const microphones = devices.filter((device) => device.kind === "audioinput");
        setMicrophoneDevices(microphones);
      })
      .catch((error) => {
        console.error("입력 장치 목록 불러오기 실패", error);
      });
  }, []);

  const handleGainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGainValue = parseFloat(event.target.value);
    setMicVolume(newGainValue);
  };

  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSettingClicked(!isSettingClicked)}
      />
      <div
        className={`flex flex-col absolute top-24 right-4 items-center gap-4 px-6 py-4 w-96 h-fit semibold-18 bg-grayscale-white rounded-xl border-default duration-500 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-row gap-3 w-full h-10 justify-start">
          <p id="input-device-label">입력 장치 설정</p>
        </div>

        <select
          aria-labelledby="input-device-label"
          className="border w-full"
          onChange={(e) => setSelectedMicrophone(e.target.value)}
        >
          {microphoneDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `마이크 ${microphoneDevices.indexOf(device) + 1}`}
            </option>
          ))}
        </select>

        <div className="flex flex-row gap-3 w-full h-10 justify-start">
          <label htmlFor="volumeSlider">입력 볼륨:</label>
        </div>
        <input
          className="w-full"
          type="range"
          id="volumeSlider"
          min="0"
          max="1"
          step="0.01"
          onChange={handleGainChange}
        />

        <div className="flex flex-row gap-4 w-full"></div>
      </div>
    </>
  );
};

export default HeaderSettingModal;
