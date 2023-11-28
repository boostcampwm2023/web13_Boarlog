import { useState, useRef, useEffect } from "react";
// @ts-ignore
import { useRecoilValue, useSetRecoilState } from "recoil";
//import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import VolumeMeter from "./VolumeMeter";

import StopIcon from "@/assets/svgs/stop.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import Modal from "@/components/Modal/Modal";

import selectedMicrophoneState from "./stateMicrophone";
import micVolmeState from "./stateMicVolme";

const HeaderParticipantControls = () => {
  // @ts-ignore
  const [isLectureStart, setIsLectureStart] = useState(false);
  const [isSpeakerOn, setisSpeakerOn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // @ts-ignore
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  // @ts-ignore
  const [micVolume, setMicVolume] = useState<number>(0);

  const selectedMicrophone = useRecoilValue(selectedMicrophoneState);
  const SpeakerVolume = useRecoilValue(micVolmeState);
  //const setSpeakerVolumeState = useSetRecoilState(micVolmeState);

  // 아래는 추후에 사용할 예정입니다.
  //const timerIdRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  //const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  //const socketRef = useRef<Socket>();
  //const pcRef = useRef<RTCPeerConnection>();
  //const mediaStreamRef = useRef<MediaStream>();
  //const updatedStreamRef = useRef<MediaStream>();
  const SpeakerVolumeRef = useRef<number>(0);
  //const prevSpeakerVolumeRef = useRef<number>(0);

  const navigate = useNavigate();
  //const MEDIA_SERVER_URL = "http://localhost:3000/create-room";

  useEffect(() => {
    SpeakerVolumeRef.current = SpeakerVolume;
  }, [SpeakerVolume]);
  useEffect(() => {
    if (isLectureStart) {
      // 추후 구현
    }
  }, [selectedMicrophone]);

  const leaveLecture = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const mute = () => {
    if (isSpeakerOn) {
      // 추후 구현
      setisSpeakerOn(false);
    } else {
      // 추후 구현
      setisSpeakerOn(true);
    }
  };

  return (
    <>
      <div className="flex gap-2 fixed left-1/2 -translate-x-1/2">
        <VolumeMeter micVolume={micVolume} />
        <p className="semibold-20 text-boarlog-100">
          {Math.floor(elapsedTime / 60)
            .toString()
            .padStart(2, "0")}
          :{(elapsedTime % 60).toString().padStart(2, "0")}
        </p>
      </div>

      <SmallButton className={`text-grayscale-white bg-alert-100`} onClick={() => setIsModalOpen(true)}>
        <StopIcon className="w-5 h-5 fill-grayscale-white" />
        강의 나가기
      </SmallButton>
      <SmallButton className={`text-grayscale-white ${isSpeakerOn ? "bg-boarlog-100" : "bg-alert-100"}`} onClick={mute}>
        {isSpeakerOn ? (
          <MicOnIcon className="w-5 h-5 fill-grayscale-white" />
        ) : (
          <MicOffIcon className="w-5 h-5 fill-grayscale-white" />
        )}
      </SmallButton>
      <Modal
        modalText="강의를 나가시겠습니까?"
        cancelText="취소"
        confirmText="강의 나가기"
        cancelButtonStyle="black"
        confirmButtonStyle="red"
        confirmClick={leaveLecture}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default HeaderParticipantControls;
