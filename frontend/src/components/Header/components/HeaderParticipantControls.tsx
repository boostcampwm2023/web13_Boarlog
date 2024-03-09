import { useState, useRef, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Socket, Manager } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import VolumeMeter from "./VolumeMeter";

import StopIcon from "@/assets/svgs/stop.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";
import Modal from "@/components/Modal/Modal";

import { useToast } from "@/components/Toast/useToast";
import { ICanvasData, loadCanvasData, updateCanvasSize } from "@/utils/fabricCanvasUtil";
import { convertMsTohhmm } from "@/utils/convertMsToTimeString";
import calcNormalizedVolume from "@/utils/calcNormalizedVolume";

import selectedSpeakerState from "@/stores/stateSelectedSpeaker";
import speakerVolumeState from "@/stores/stateSpeakerVolume";
import micVolumeState from "@/stores/stateMicVolume";
import participantCavasInstanceState from "@/stores/stateParticipantCanvasInstance";
import participantSocketRefState from "@/stores/stateParticipantSocketRef";

interface HeaderParticipantControlsProps {
  setLectureCode: React.Dispatch<React.SetStateAction<string>>;
  setLectureTitle: React.Dispatch<React.SetStateAction<string>>;
}

const HeaderParticipantControls = ({ setLectureCode, setLectureTitle }: HeaderParticipantControlsProps) => {
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [didMount, setDidMount] = useState(false);

  const selectedSpeaker = useRecoilValue(selectedSpeakerState);
  const speakerVolume = useRecoilValue(speakerVolumeState);
  const fabricCanvasRef = useRecoilValue(participantCavasInstanceState);
  const setSpeakerVolume = useSetRecoilState(speakerVolumeState);
  const setMicVolumeState = useSetRecoilState(micVolumeState);
  const setParticipantSocket = useSetRecoilState(participantSocketRefState);

  const timerIdRef = useRef<number | null>(null); // 경과 시간 표시 타이머 id
  const onFrameIdRef = useRef<number | null>(null); // 마이크 볼륨 측정 타이머 id
  const managerRef = useRef<Manager>();
  const socketRef = useRef<Socket>();
  const lectureSocketRef = useRef<Socket>();
  const pcRef = useRef<RTCPeerConnection>();
  const mediaStreamRef = useRef<MediaStream>();
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const speakerVolumeRef = useRef<number>(0);
  const prevSpeakerVolumeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  const navigate = useNavigate();
  const showToast = useToast();

  const roomid = new URLSearchParams(useLocation().search).get("roomid") || "999999";
  const pc_config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  };
  let accessToken = localStorage.getItem("token");

  useEffect(() => {
    setDidMount(true);
    const backToMain = () => {
      leaveLecture({ isLectureEnd: false });
      window.removeEventListener("popstate", backToMain);
    };
    window.addEventListener("popstate", backToMain);
    return () => {
      window.removeEventListener("popstate", backToMain);
      window.addEventListener("resize", handleResize);
    };
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

  /* ------------------------------------------------------------------------------- */
  // 화이트보드 지연 시간 체크를 위해 임시로 추가한 코드입니다. 추후 삭제될 예정입니다.
  let startTime = Date.now();
  /* ------------------------------------------------------------------------------- */

  const enterLecture = async () => {
    await checkAuth();
    await initConnection();
    await createStudentOffer();
    window.addEventListener("resize", handleResize);

    // 서버와 webRTC 연결이 성공했을 때의 동작
    if (!pcRef.current) return;
    pcRef.current.oniceconnectionstatechange = () => {
      if (!pcRef.current) return;
      if (pcRef.current.iceConnectionState === "connected") {
        handleConnected();
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

  let canvasData: ICanvasData = {
    objects: [],
    viewport: [1, 0, 0, 1, 0, 0],
    eventTime: 0,
    width: 0,
    height: 0
  };

  const leaveLecture = ({ isLectureEnd }: { isLectureEnd: boolean }) => {
    if (!lectureSocketRef.current) return;
    lectureSocketRef.current.emit("leave", {
      type: "lecture",
      roomId: roomid
    });

    if (localAudioRef.current) localAudioRef.current.srcObject = null;
    if (timerIdRef.current) clearInterval(timerIdRef.current); // 경과 시간 표시 타이머 중지
    if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current); // 마이크 볼륨 측정 중지
    if (socketRef.current) socketRef.current.disconnect(); // 소켓 연결 해제
    if (lectureSocketRef.current) lectureSocketRef.current.disconnect(); // 소켓 연결 해제
    if (pcRef.current) pcRef.current.close(); // RTCPeerConnection 해제
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((track) => track.stop()); // 미디어 트랙 중지

    setMicVolumeState(0);
    setIsModalOpen(false);
    isLectureEnd ? navigate("/lecture-end") : navigate("/");
  };

  const checkAuth = async () => {
    axios
      .get(`${import.meta.env.VITE_API_SERVER_URL}/lecture?code=${roomid}`)
      .then((result) => {
        const lectureTitle = result.data.title;
        setLectureTitle(lectureTitle);
      })
      .catch(() => {
        showToast({ message: "존재하지 않는 강의실입니다.", type: "alert" });
        navigate("/");
      });
    if (accessToken) {
      await axios
        .get(`${import.meta.env.VITE_API_SERVER_URL}/profile`, {
          headers: {
            Authorization: accessToken
          }
        })
        .then(() => {})
        .catch((error) => {
          if (error.response?.status === 401) {
            accessToken = "";
            showToast({ message: "로그인이 만료되어 guest로 입장합니다.", type: "alert" });
          } else showToast({ message: "유저 정보를 불러오는데 문제가 발생했어요", type: "alert" });
        });
    }
  };
  const initConnection = async () => {
    try {
      managerRef.current = new Manager(import.meta.env.VITE_MEDIA_SERVER_URL);
      // guest 판별 로직 추가 예정
      socketRef.current = managerRef.current.socket("/enter-room", {
        auth: {
          accessToken: accessToken ? accessToken : "",
          refreshToken: "test"
        }
      });

      if (!socketRef.current) return;
      socketRef.current.on(`serverAnswer`, (data) => handleServerAnswer(data));
      socketRef.current.on(`serverCandidate`, (data) => handleServerCandidate(data));
      socketRef.current.on("connect_error", (err) => handleServerError(err));

      pcRef.current = new RTCPeerConnection(pc_config);
      const stream = new MediaStream();
      mediaStreamRef.current = stream;
    } catch (e) {
      console.error("연결 에러", e);
    }
  };

  const createStudentOffer = async () => {
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
  };

  const getStudentCandidate = () => {
    if (!pcRef.current) return;
    pcRef.current.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("clientCandidate", {
          candidate: e.candidate,
          studentSocketId: socketRef.current.id
        });
      }
    };
  };

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

    const onFrame = () => {
      gainNode.gain.value = speakerVolumeRef.current;
      setMicVolumeState(calcNormalizedVolume(analyser));
      onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    };
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
  };

  const mute = () => {
    if (!onFrameIdRef.current) {
      // 최초 연결 후 음소거 해제
      startAnalyse();
      setIsSpeakerOn(true);
      showToast({ message: "음소거가 해제되었습니다.", type: "success" });
    } else if (isSpeakerOn) {
      prevSpeakerVolumeRef.current = speakerVolumeRef.current;
      setSpeakerVolume(0);
      setIsSpeakerOn(false);
      showToast({ message: "음소거 되었습니다.", type: "alert" });
    } else {
      setSpeakerVolume(prevSpeakerVolumeRef.current);
      setIsSpeakerOn(true);
      showToast({ message: "음소거가 해제되었습니다.", type: "success" });
    }
  };

  const handleServerAnswer = (data: any) => {
    if (!pcRef.current) return;
    // const startTime = new Date(data.startTime).getTime();
    startTime = new Date(data.startTime).getTime();
    const updateElapsedTime = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsedTime);
    };
    const timer = setInterval(updateElapsedTime, 1000);
    timerIdRef.current = timer;

    loadCanvasData({
      fabricCanvas: fabricCanvasRef!,
      currentData: canvasData,
      newData: data.whiteboard,
      debugData: {}
    });
    canvasData = data.whiteboard;
    pcRef.current.setRemoteDescription(data.SDP);
  };
  const handleServerCandidate = (data: any) => {
    if (!pcRef.current) return;
    pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
  };
  const handleServerError = (err: any) => {
    console.error(err.message);
    showToast({ message: "서버 연결에 실패했습니다", type: "alert" });
  };
  const handleWhiteboardUpdate = (data: any) => {
    const debugData = { startTime: startTime, arriveTime: Date.now() };
    loadCanvasData({
      fabricCanvas: fabricCanvasRef!,
      currentData: canvasData,
      newData: data.content,
      debugData: debugData
    });
    canvasData = data.content;
  };
  const handleLectureEnd = () => {
    showToast({ message: "강의가 종료되었습니다.", type: "alert" });
    leaveLecture({ isLectureEnd: true });
  };
  const handleConnected = () => {
    showToast({ message: "강의가 시작되었습니다.", type: "success" });
    showToast({ message: "우측 상단 음소거 버튼을 눌러 음소거를 해제 할 수 있습니다.", type: "alert" });
    if (!managerRef.current) return;
    lectureSocketRef.current = managerRef.current.socket("/lecture", {
      auth: {
        accessToken: accessToken ? accessToken : socketRef.current!.id,
        refreshToken: "sample"
      }
    });
    setParticipantSocket(lectureSocketRef.current);
    lectureSocketRef.current.on("ended", () => handleLectureEnd());
    lectureSocketRef.current.on("update", (data) => handleWhiteboardUpdate(data));
  };
  const handleResize = () => {
    if (!fabricCanvasRef) return;
    updateCanvasSize({
      fabricCanvas: fabricCanvasRef,
      whiteboardData: canvasData
    });
  };

  return (
    <>
      <div className="gap-2 hidden sm:flex home:fixed home:left-1/2 home:-translate-x-1/2">
        <VolumeMeter />
        <p className="semibold-20 text-boarlog-100">{convertMsTohhmm(elapsedTime)}</p>
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
          leaveLecture({ isLectureEnd: false });
        }}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <audio playsInline autoPlay muted ref={localAudioRef}></audio>
    </>
  );
};

export default HeaderParticipantControls;
