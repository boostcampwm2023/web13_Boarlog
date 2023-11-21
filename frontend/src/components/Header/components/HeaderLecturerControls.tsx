import { useState } from "react";
import PlayIcon from "@/assets/svgs/play.svg?react";
import StopIcon from "@/assets/svgs/stop.svg?react";
import SettingIcon from "@/assets/svgs/setting.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";

const HeaderLecturerControls = () => {
  const [isLectureStart, setIsLectureStart] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);

  return (
    <>
      <SmallButton
        className={`text-grayscale-white ${isLectureStart ? "bg-alert-100" : "bg-boarlog-100"}`}
        onClick={() => setIsLectureStart(!isLectureStart)}
      >
        {isLectureStart ? (
          <>
            <StopIcon className="w-5 h-5 fill-grayscale-white" />
            강의 종료
          </>
        ) : (
          <>
            <PlayIcon className="w-5 h-5 fill-grayscale-white" />
            강의 시작
          </>
        )}
      </SmallButton>
      <SmallButton
        className={`text-grayscale-white ${isMicOn ? "bg-boarlog-100" : "bg-alert-100"}`}
        onClick={() => setIsMicOn(!isMicOn)}
      >
        {isMicOn ? (
          <MicOnIcon className="w-5 h-5 fill-grayscale-white" />
        ) : (
          <MicOffIcon className="w-5 h-5 fill-grayscale-white" />
        )}
      </SmallButton>
      <SmallButton className="bg-grayscale-lightgray text-grayscale-white" onClick={() => console.log("digh")}>
        <SettingIcon className="w-5 h-5 fill-grayscale-black" />
      </SmallButton>
    </>
  );
};

export default HeaderLecturerControls;
