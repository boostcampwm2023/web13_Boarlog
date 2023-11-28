import { useState, useRef, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
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
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [micVolume, setMicVolume] = useState<number>(0);

  const selectedMicrophone = useRecoilValue(selectedMicrophoneState);
  const inputMicVolume = useRecoilValue(micVolmeState);
  const setInputMicVolumeState = useSetRecoilState(micVolmeState);

  const timerIdRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const socketRef = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const mediaStreamRef = useRef<MediaStream>();
  const updatedStreamRef = useRef<MediaStream>();
  const inputMicVolumeRef = useRef<number>(0);
  const prevInputMicVolumeRef = useRef<number>(0);

  const MEDIA_SERVER_URL = "http://localhost:3000/create-room";
  const pc_config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      },
      {
        urls: import.meta.env.VITE_TURN_URL as string,
        username: import.meta.env.VITE_TURN_USERNAME as string,
        credential: import.meta.env.VITE_TURN_PASSWORD as string
      }
    ]
  };

  useEffect(() => {
    inputMicVolumeRef.current = inputMicVolume;
  }, [inputMicVolume]);
  useEffect(() => {
    if (isLectureStart) {
      replaceAudioTrack();
    }
  }, [selectedMicrophone]);

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
    setElapsedTime(0);

    if (timerIdRef.current) clearInterval(timerIdRef.current); // 경과 시간 표시 타이머 중지
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
      startTimer();

      // 2. 로컬 RTCPeerConnection 생성
      pcRef.current = new RTCPeerConnection(pc_config);
      // 3. 로컬 stream에 track 추가, 발표자의 미디어 트랙을 로컬 RTCPeerConnection에 추가
      if (updatedStreamRef.current) {
        updatedStreamRef.current.getTracks().forEach((track) => {
          if (!updatedStreamRef.current) return;
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, updatedStreamRef.current);
        });
      } else {
        console.error("no stream");
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function createPresenterOffer() {
    // 4. 발표자의 offer 생성
    try {
      if (!pcRef.current || !socketRef.current) return;
      const SDP = await pcRef.current.createOffer({
        offerToReceiveAudio: true
      });
      socketRef.current.emit("presenterOffer", {
        socketId: socketRef.current.id,
        SDP: SDP
      });
      pcRef.current.setLocalDescription(SDP);
      getPresenterCandidate();
    } catch (error) {
      console.error(error);
    }
  }

  function getPresenterCandidate() {
    // 5. 발표자의 candidate 수집
    if (!pcRef.current) return;
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        if (!socketRef.current) return;
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

  // 사용자에게 입력받은 MediaStream을 분석/변환하여 updatedStream으로 바꿔주는 함수
  const setupAudioAnalysis = (stream: MediaStream) => {
    // Web Audio API에서 오디오를 다루기 위한 기본 객체 AudioContext 생성
    const audioContext = new AudioContext();
    // 오디오 신호를 분석하기 위한 AnalyserNode 객체 생성
    const analyser = audioContext.createAnalyser();
    // 미디어 스트림을 audioContext 내에서 사용할 수 있는 형식으로 변환
    const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);

    // 입력 오디오 신호의 볼륨을 조절하기 위한 GainNode 객체 생성
    const gainNode = audioContext.createGain();
    // 변환된 미디어 스트림을 GainNode 객체에 연결
    mediaStreamAudioSourceNode.connect(gainNode);
    // GainNode 객체를 AnalyserNode 객체에 연결
    gainNode.connect(analyser);

    // audioContext에서 처리된 오디오로 새로운 미디어 스트림 생성
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    // gainNode와 새 미디어 스트림 연결
    gainNode.connect(mediaStreamDestination);
    // 업데이트된 미디어 스트림을 앞으로 참조하도록 설정
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
  const startTimer = () => {
    let startTime = Date.now();
    const updateElapsedTime = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsedTime);
    };
    const timer = setInterval(updateElapsedTime, 1000);
    timerIdRef.current = timer;
  };

  // 기존에 미디어 서버에 보내는 오디오 트랙을 새 마이크의 오디오 트랙으로 교체
  const replaceAudioTrack = async () => {
    try {
      if (!selectedMicrophone) throw new Error("마이크를 먼저 선택해주세요");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicrophone }
      });
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // 기존 미디어 트랙 중지
      mediaStreamRef.current = stream;

      await setupAudioAnalysis(stream);

      if (!updatedStreamRef.current || !pcRef.current) return;
      // 기존트랙: pcRef.current.getSenders()[0].track
      // 새트랙: updatedStreamRef.current.getAudioTracks()[0]
      pcRef.current.getSenders()[0].replaceTrack(updatedStreamRef.current.getAudioTracks()[0]);
    } catch (error) {
      console.error("오디오 replace 작업 실패", error);
    }
  };

  const mute = () => {
    if (isMicOn) {
      prevInputMicVolumeRef.current = inputMicVolumeRef.current;
      setInputMicVolumeState(0);
      setIsMicOn(false);
    } else {
      setInputMicVolumeState(prevInputMicVolumeRef.current);
      setIsMicOn(true);
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
      <SmallButton className={`text-grayscale-white ${isMicOn ? "bg-boarlog-100" : "bg-alert-100"}`} onClick={mute}>
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
