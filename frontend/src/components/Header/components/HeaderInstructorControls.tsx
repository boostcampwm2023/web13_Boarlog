import { useState, useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { io, Socket } from "socket.io-client";

import VolumeMeter from "./VolumeMeter";

import PlayIcon from "@/assets/svgs/play.svg?react";
import StopIcon from "@/assets/svgs/stop.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import Modal from "@/components/Modal/Modal";

import selectedMicrophoneState from "./stateMicrophone";
import micVolmeState from "./stateMicVolme";

const HeaderInstructorControls = () => {
  const [isLectureStart, setIsLectureStart] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [micVolume, setMicVolume] = useState<number>(0);

  const recordingTimerRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const socketRef = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const mediaStreamRef = useRef<MediaStream>();

  const selectedMicrophone = useRecoilValue(selectedMicrophoneState);
  const MEDIA_SERVER_URL = "http://localhost:3000/create-room";

  const inputMicVolume = useRecoilValue(micVolmeState);
  const inputMicVolumeRef = useRef<number>(0);
  useEffect(() => {
    inputMicVolumeRef.current = inputMicVolume;
  }, [inputMicVolume]);
  const updatedStreamRef = useRef<MediaStream | null>(null);

  const startLecture = async () => {
    if (!selectedMicrophone) return alert("음성 입력장치(마이크)를 먼저 선택해주세요");

    await initConnection();
    await createPresenterOffer();
    listenForServerAnswer();
    setIsLectureStart(true);
  };

  const stopLecture = () => {
    if (!isLectureStart) return alert("강의가 시작되지 않았습니다.");

    setIsLectureStart(false);
    setRecordingTime(0);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current); // 경과 시간 표시 타이머 중지
    if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current); // 마이크 볼륨 측정 중지
    if (socketRef.current) socketRef.current.disconnect(); // 소켓 연결 해제
    if (pcRef.current) pcRef.current.close(); // RTCPeerConnection 해제
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // 미디어 트랙 중지

    setIsModalOpen(false); // 일단은 모달만 닫습니다.
  };

  const initConnection = async () => {
    try {
      // 0. 소켓 연결
      socketRef.current = io(MEDIA_SERVER_URL);

      // 1. 로컬 stream 생성 (발표자 브라우저에서 미디어 track 설정)
      if (!selectedMicrophone) throw new Error("마이크를 먼저 선택해주세요");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicrophone }
      });
      mediaStreamRef.current = stream;

      await setupAudioAnalysis(stream);
      startRecordingTimer();

      if (updatedStreamRef.current) console.log("1. 로컬 stream 생성 완료");

      // 2. 로컬 RTCPeerConnection 생성
      pcRef.current = new RTCPeerConnection();
      console.log("2. 로컬 RTCPeerConnection 생성 완료");

      // 3. 로컬 stream에 track 추가, 발표자의 미디어 트랙을 로컬 RTCPeerConnection에 추가
      if (updatedStreamRef.current) {
        console.log(updatedStreamRef.current);
        console.log("3.track 추가");

        updatedStreamRef.current.getTracks().forEach((track) => {
          if (!updatedStreamRef.current) return;
          console.log("track:", track);
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, updatedStreamRef.current);
        });
      } else {
        console.error("no stream");
      }
    } catch (e) {
      console.error(e);
    }
  };

  async function createPresenterOffer() {
    // 4. 발표자의 offer 생성
    try {
      if (!pcRef.current || !socketRef.current) return;
      const SDP = await pcRef.current.createOffer();
      socketRef.current.emit("presenterOffer", {
        socketId: socketRef.current.id,
        SDP: SDP
      });
      console.log("4. 발표자 localDescription 설정 완료");
      pcRef.current.setLocalDescription(SDP);
      getPresenterCandidate();
    } catch (e) {
      console.error(e);
    }
  }

  function getPresenterCandidate() {
    // 5. 발표자의 candidate 수집
    if (!pcRef.current) return;
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        if (!socketRef.current) return;
        console.log("5. 발표자 candidate 수집");
        socketRef.current.emit("presenterCandidate", {
          candidate: e.candidate,
          presenterSocketId: socketRef.current.id
        });
      }
    };
  }

  async function listenForServerAnswer() {
    // 6. 서버로부터 answer 받음
    if (!socketRef.current) return;
    socketRef.current.on(`${socketRef.current.id}-serverAnswer`, (data) => {
      if (!pcRef.current) return;
      console.log("6. remoteDescription 설정완료");
      pcRef.current.setRemoteDescription(data.SDP);
    });
    socketRef.current.on(`${socketRef.current.id}-serverCandidate`, (data) => {
      if (!pcRef.current) return;
      console.log("7. 서버로부터 candidate 받음");
      pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }

  // 마이크 볼륨 측정을 위한 부분입니다
  const setupAudioAnalysis = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);

    const gainNode = audioContext.createGain();
    mediaStreamAudioSourceNode.connect(gainNode);
    gainNode.connect(analyser);

    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    gainNode.connect(mediaStreamDestination);
    updatedStreamRef.current = mediaStreamDestination.stream;

    const pcmData = new Float32Array(analyser.fftSize);

    const onFrame = () => {
      gainNode.gain.value = inputMicVolumeRef.current;

      analyser.getFloatTimeDomainData(pcmData);
      let sum = 0.0;
      for (const amplitude of pcmData) {
        sum += amplitude * amplitude;
      }
      const rms = Math.sqrt(sum / pcmData.length);
      const normalizedVolume = Math.min(1, rms / 0.5);
      setMicVolume(normalizedVolume);
      onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    };
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
  };

  // 경과 시간을 표시하기 위한 부분입니다
  const startRecordingTimer = () => {
    let startTime = Date.now();
    const updateRecordingTime = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setRecordingTime(elapsedTime);
    };
    const recordingTimer = setInterval(updateRecordingTime, 1000);
    recordingTimerRef.current = recordingTimer;
  };

  return (
    <>
      <div className="flex gap-2 fixed left-1/2 -translate-x-1/2">
        <VolumeMeter micVolume={micVolume} />
        <p className="semibold-20 text-boarlog-100">
          {Math.floor(recordingTime / 60)
            .toString()
            .padStart(2, "0")}
          :{(recordingTime % 60).toString().padStart(2, "0")}
        </p>
      </div>

      <SmallButton
        className={`text-grayscale-white ${isLectureStart ? "bg-alert-100" : "bg-boarlog-100"}`}
        onClick={!isLectureStart ? startLecture : () => setIsModalOpen(true)}
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
      <Modal
        modalText="강의를 종료하시겠습니까?"
        cancelText="취소"
        confirmText="강의 종료하기"
        cancelButtonStyle="black"
        confirmButtonStyle="red"
        confirmClick={stopLecture}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default HeaderInstructorControls;
