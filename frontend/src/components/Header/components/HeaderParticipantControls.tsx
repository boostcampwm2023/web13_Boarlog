import { useState, useRef, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
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
  const [isLectureStart, setIsLectureStart] = useState(false);
  const [isSpeakerOn, setisSpeakerOn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [micVolume, setMicVolume] = useState<number>(0);

  const [didMount, setDidMount] = useState(false);

  const selectedMicrophone = useRecoilValue(selectedMicrophoneState);
  const SpeakerVolume = useRecoilValue(micVolmeState);
  //const setSpeakerVolumeState = useSetRecoilState(micVolmeState);

  // 아래는 추후에 사용할 예정입니다.
  //const timerIdRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const socketRef = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();
  const localAudioRef = useRef<HTMLAudioElement>(null);
  //const SpeakerVolumeRef = useRef<number>(0);
  //const prevSpeakerVolumeRef = useRef<number>(0);

  const navigate = useNavigate();
  const MEDIA_SERVER_URL = "http://localhost:3000/enter-room";

  useEffect(() => {
    setDidMount(true);
  }, []);
  useEffect(() => {
    console.log(didMount);
    if (didMount) {
      enterLecture();
    }
  }, [didMount]);

  useEffect(() => {
    //SpeakerVolumeRef.current = SpeakerVolume;
  }, [SpeakerVolume]);
  useEffect(() => {
    if (isLectureStart) {
      // 추후 구현
    }
  }, [selectedMicrophone]);

  const enterLecture = async () => {
    console.log("1. enterLecture");
    await initConnection();

    await createStudentOffer();
    await setServerAnswer();
  };

  const leaveLecture = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const initConnection = async () => {
    try {
      socketRef.current = io(MEDIA_SERVER_URL);
      pcRef.current = new RTCPeerConnection();
      const stream = new MediaStream();
      localStreamRef.current = stream;

      if (!pcRef.current) return;
      pcRef.current.ontrack = (event) => {
        if (!localStreamRef.current || !localAudioRef.current) return;
        if (event.track.kind === "audio") {
          localStreamRef.current.addTrack(event.track);
          startAnalyse();
          console.log("audio", event.track);
          localAudioRef.current.srcObject = localStreamRef.current;
        } else if (event.track.kind === "video") {
          //localStream.addTrack(event.track);
          //localVideo.srcObject = localStream;
        }
      };
    } catch (e) {
      console.log("에러1", e);
    }
  };

  function getStudentCandidate() {
    if (!pcRef.current) return;
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        if (!socketRef.current) return;
        socketRef.current.emit("studentCandidate", {
          candidate: e.candidate,
          studentSocketId: socketRef.current.id
        });
      }
    };
  }

  async function createStudentOffer() {
    try {
      if (!pcRef.current || !socketRef.current) return;
      const SDP = await pcRef.current.createOffer({
        offerToReceiveAudio: true
      });
      socketRef.current.emit("studentOffer", {
        socketId: socketRef.current.id,
        SDP: SDP
      });

      pcRef.current.setLocalDescription(SDP);
      console.log("2. studentOffer");
      getStudentCandidate();
    } catch (e) {
      console.log(e);
    }
  }

  async function setServerAnswer() {
    if (!socketRef.current) return;
    socketRef.current.on(`${socketRef.current.id}-serverAnswer`, (data) => {
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(data.SDP);
    });
    socketRef.current.on(`${socketRef.current.id}-serverCandidate`, (data) => {
      if (!pcRef.current) return;
      pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }

  const startAnalyse = () => {
    if (!localStreamRef.current) return;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const mediaStreamAudioSourceNode = context.createMediaStreamSource(localStreamRef.current);
    mediaStreamAudioSourceNode.connect(analyser, 0);
    const pcmData = new Float32Array(analyser.fftSize);

    const onFrame = () => {
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

    const audioStream = getAudioStream() as MediaStream;
    setupAudioContext(audioStream);
  };

  function getAudioStream() {
    if (!localStreamRef.current) return;
    const audioTracks = localStreamRef.current.getAudioTracks();
    const audioStream = new MediaStream(audioTracks);
    return audioStream;
  }

  function setupAudioContext(stream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const destination = audioContext.destination;

    source.connect(destination);
  }

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
      <audio id="localAudio" playsInline autoPlay muted ref={localAudioRef}></audio>
      <button onClick={enterLecture}>.</button>
    </>
  );
};

export default HeaderParticipantControls;
