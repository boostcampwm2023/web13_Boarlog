// 이번 주 일요일까지 파일 분리, 리팩토링 하겠습니다.
import { useState, useRef, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Socket, Manager } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/Toast/useToast";

import VolumeMeter from "./VolumeMeter";
import StopIcon from "@/assets/svgs/stop.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import Modal from "@/components/Modal/Modal";

import selectedSpeakerState from "@/stores/stateSelectedSpeaker";
import speakerVolmeState from "@/stores/stateSpeakerVolume";
import micVolumeState from "@/stores/stateMicVolume";
import participantCavasInstanceState from "@/stores/stateParticipantCanvasInstance";
import participantSocketRefState from "@/stores/stateParticipantSocketRef";

interface HeaderParticipantControlsProps {
  setLectureCode: React.Dispatch<React.SetStateAction<string>>;
}

const HeaderParticipantControls = ({ setLectureCode }: HeaderParticipantControlsProps) => {
  const [isSpeakerOn, setisSpeakerOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [didMount, setDidMount] = useState(false);

  const selectedSpeaker = useRecoilValue(selectedSpeakerState);
  const speakerVolume = useRecoilValue(speakerVolmeState);
  const fabricCanvasRef = useRecoilValue(participantCavasInstanceState);
  const setSpeakerVolume = useSetRecoilState(speakerVolmeState);
  const setMicVolumeState = useSetRecoilState(micVolumeState);
  const setParticipantSocket = useSetRecoilState(participantSocketRefState);

  const timerIdRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const managerRef = useRef<Manager>();
  const socketRef = useRef<Socket>();
  const socketRef2 = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const mediaStreamRef = useRef<MediaStream>();
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const speakerVolumeRef = useRef<number>(0);
  const prevSpeakerVolumeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const navigate = useNavigate();
  const showToast = useToast();

  const roomid = new URLSearchParams(useLocation().search).get("roomid") || "999999";
  const sampleAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBsYXRpbm91c3MwMkBnbWFpbC5jb20iLCJpYXQiOjE3MDE2ODUyMDYsImV4cCI6MTcwMjcyMjAwNn0.gNXyIPGyaBKX5KjBVB6USNWGEc3k9ZruCTglCGeLo3Y";
  const pc_config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  };

  useEffect(() => {
    setDidMount(true);
    const backToMain = () => {
      leaveLecture();
      navigate("/");
      window.removeEventListener("popstate", backToMain);
    };
    window.addEventListener("popstate", backToMain);
  }, []);
  useEffect(() => {
    if (didMount) {
      enterLecture();
      setLectureCode(roomid);
    }
  }, [didMount]);

  useEffect(() => {
    speakerVolumeRef.current = speakerVolume;
  }, [speakerVolume]);
  useEffect(() => {
    if (!audioContextRef.current) return;
    (audioContextRef.current as any).setSinkId(selectedSpeaker);
  }, [selectedSpeaker]);

  const enterLecture = async () => {
    //showToast({ message: "서버에 접속하는 중입니다.", type: "default" });
    await initConnection();
    await createStudentOffer();
    await setServerAnswer();

    if (!managerRef.current) return;
    socketRef2.current = managerRef.current.socket("/lecture", {
      auth: {
        accessToken: sampleAccessToken,
        refreshToken: "sample"
      }
    });
    setParticipantSocket(socketRef2.current);
    socketRef2.current.on("connect", () => {
      console.log("소켓이 성공적으로 연결되었습니다.");
    });
    socketRef2.current.on("connect_error", (err) => {
      console.error(err.message);
    });
    socketRef2.current.on("ended", () => {
      showToast({ message: "강의가 종료되었습니다.", type: "alert" });
      leaveLecture();
      navigate("/lecture-end");
    });
    socketRef2.current.on("update", (data) => {
      // 캔버스 데이터 업데이트
      renderCanvas(data.content);
    });

    if (!pcRef.current) return;
    pcRef.current.oniceconnectionstatechange = () => {
      if (!pcRef.current) return;
      if (pcRef.current.iceConnectionState === "connected") {
        showToast({ message: "강의가 시작되었습니다.", type: "success" });
        showToast({ message: "우측 상단 음소거 버튼을 눌러 음소거를 해제 할 수 있습니다.", type: "alert" });
      }
    };
    pcRef.current.ontrack = (event) => {
      if (!mediaStreamRef.current || !localAudioRef.current) return;
      if (event.track.kind === "audio") {
        mediaStreamRef.current.addTrack(event.track);
        localAudioRef.current.srcObject = mediaStreamRef.current;
      }
    };
  };

  interface ICanvasData {
    canvasJSON: string;
    viewport: number[];
    eventTime: number;
    width: number;
    height: number;
  }
  let canvasData: ICanvasData = {
    canvasJSON: "",
    viewport: [1, 0, 0, 1, 0, 0],
    eventTime: 0,
    width: 0,
    height: 0
  };
  //{ newData }: { newData: any }
  const renderCanvas = (newData: ICanvasData) => {
    if (!fabricCanvasRef) return;
    const isCanvasDataChanged = canvasData.canvasJSON !== newData.canvasJSON;
    const isViewportChanged = JSON.stringify(canvasData.viewport) !== JSON.stringify(newData.viewport);
    const isSizeChanged = canvasData.width !== newData.width || canvasData.height !== newData.width;

    // 캔버스 데이터 업데이트
    if (isCanvasDataChanged) fabricCanvasRef.loadFromJSON(newData.canvasJSON, () => {});
    // 캔버스 뷰포트 업데이트
    if (isViewportChanged) fabricCanvasRef.setViewportTransform(newData.viewport);
    // 캔버스 크기 업데이트
    if (isSizeChanged) {
      // 발표자 화이트보드 비율에 맞춰서 캔버스 크기 조정
      const HEADER_HEIGHT = 80;
      const newHegiht = window.innerWidth * (newData.height / newData.width);
      if (newHegiht > window.innerHeight - HEADER_HEIGHT) {
        const newWidth = (window.innerHeight - HEADER_HEIGHT) * (newData.width / newData.height);
        fabricCanvasRef.setDimensions({
          width: newWidth,
          height: window.innerHeight - HEADER_HEIGHT
        });
      } else {
        fabricCanvasRef.setDimensions({
          width: window.innerWidth,
          height: newHegiht
        });
      }
      // 화이트보드 내용을 캔버스 크기에 맞춰서 재조정
      fabricCanvasRef.setDimensions(
        {
          width: newData.width,
          height: newData.height
        },
        { backstoreOnly: true }
      );
    }
  };

  const leaveLecture = () => {
    setElapsedTime(0);

    if (!socketRef2.current) return;
    socketRef2.current.emit("leave", {
      type: "lecture",
      roomId: roomid
    });

    if (localAudioRef.current) localAudioRef.current.srcObject = null;

    if (timerIdRef.current) clearInterval(timerIdRef.current); // 경과 시간 표시 타이머 중지
    if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current); // 마이크 볼륨 측정 중지
    if (socketRef.current) socketRef.current.disconnect(); // 소켓 연결 해제
    if (socketRef2.current) socketRef2.current.disconnect(); // 소켓 연결 해제
    if (pcRef.current) pcRef.current.close(); // RTCPeerConnection 해제
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // 미디어 트랙 중지

    setIsModalOpen(false);
  };

  const initConnection = async () => {
    try {
      managerRef.current = new Manager(import.meta.env.VITE_MEDIA_SERVER_URL);
      socketRef.current = managerRef.current.socket("/enter-room", {
        auth: {
          accessToken: sampleAccessToken,
          refreshToken: "test"
        }
      });
      socketRef.current.on("connect_error", (err) => {
        console.error(err.message);
        showToast({ message: "서버 연결에 실패했습니다", type: "alert" });
      });

      pcRef.current = new RTCPeerConnection(pc_config);
      const stream = new MediaStream();
      mediaStreamRef.current = stream;

      console.log("initConnection");
    } catch (e) {
      console.error("연결 에러", e);
    }
  };

  async function createStudentOffer() {
    try {
      if (!pcRef.current || !socketRef.current) return;
      const SDP = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      socketRef.current.emit("studentOffer", {
        socketId: socketRef.current.id,
        roomId: roomid,
        SDP: SDP
      });

      pcRef.current.setLocalDescription(SDP);
      getStudentCandidate();
    } catch (e) {
      console.error(e);
    }
  }

  function getStudentCandidate() {
    if (!pcRef.current) return;
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        if (!socketRef.current) return;
        socketRef.current.emit("clientCandidate", {
          candidate: e.candidate,
          studentSocketId: socketRef.current.id
        });
      }
    };
  }

  async function setServerAnswer() {
    if (!socketRef.current) return;
    socketRef.current.on(`serverAnswer`, (data) => {
      if (!pcRef.current) return;

      const startTime = new Date(data.startTime).getTime();

      const updateElapsedTime = () => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsedTime);
      };
      const timer = setInterval(updateElapsedTime, 1000);
      timerIdRef.current = timer;
      renderCanvas(data.whiteboard);

      pcRef.current.setRemoteDescription(data.SDP);
    });
    socketRef.current.on(`serverCandidate`, (data) => {
      if (!pcRef.current) return;
      pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }

  const startAnalyse = () => {
    if (!mediaStreamRef.current) return;
    audioContextRef.current = new AudioContext();
    const analyser = audioContextRef.current.createAnalyser();
    const destination = audioContextRef.current.destination;
    const mediaStreamAudioSourceNode = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);

    const gainNode = audioContextRef.current.createGain();
    mediaStreamAudioSourceNode.connect(gainNode);
    gainNode.connect(analyser);
    gainNode.connect(destination);

    const pcmData = new Float32Array(analyser.fftSize);

    const onFrame = () => {
      gainNode.gain.value = speakerVolumeRef.current;
      analyser.getFloatTimeDomainData(pcmData);
      let sum = 0.0;
      for (const amplitude of pcmData) {
        sum += amplitude * amplitude;
      }
      const rms = Math.sqrt(sum / pcmData.length);
      const normalizedVolume = Math.min(1, rms / 0.5);
      setMicVolumeState(normalizedVolume);
      onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    };
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
  };

  const mute = () => {
    if (!onFrameIdRef.current) {
      // 최초 연결 후 음소거 해제
      startAnalyse();
      setisSpeakerOn(true);
      showToast({ message: "음소거가 해제되었습니다.", type: "success" });
    } else if (isSpeakerOn) {
      prevSpeakerVolumeRef.current = speakerVolumeRef.current;
      setSpeakerVolume(0);
      setisSpeakerOn(false);
      showToast({ message: "음소거 되었습니다.", type: "alert" });
    } else {
      setSpeakerVolume(prevSpeakerVolumeRef.current);
      setisSpeakerOn(true);
      showToast({ message: "음소거가 해제되었습니다.", type: "success" });
    }
  };

  return (
    <>
      <div className="gap-2 hidden sm:flex home:fixed home:left-1/2 home:-translate-x-1/2">
        <VolumeMeter />
        <p className="semibold-20 text-boarlog-100">
          {Math.floor(elapsedTime / 60)
            .toString()
            .padStart(2, "0")}
          :{(elapsedTime % 60).toString().padStart(2, "0")}
        </p>
      </div>

      <SmallButton className={`text-grayscale-white bg-alert-100`} onClick={() => setIsModalOpen(true)}>
        <StopIcon className="w-5 h-5 fill-grayscale-white" />
        <p className="hidden home:block">강의 나가기</p>
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
        confirmClick={() => {
          leaveLecture();
          navigate("/");
        }}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <audio id="localAudio" playsInline autoPlay muted ref={localAudioRef}></audio>
    </>
  );
};

export default HeaderParticipantControls;
