import { useRef } from "react";
import { io, Socket } from "socket.io-client";

const VideoCall = () => {
  const socketRef = useRef<Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();

  const startButtonRef = useRef<HTMLButtonElement>(null);
  const stopButtonRef = useRef<HTMLButtonElement>(null);

  const startLecture = async () => {
    if (startButtonRef.current) startButtonRef.current.disabled = true;
    if (stopButtonRef.current) stopButtonRef.current.disabled = false;

    await initConnection();
    await createPresenterOffer();
    listenForServerAnswer();
  };

  const stopLecture = () => {
    if (startButtonRef.current) startButtonRef.current.disabled = false;
    if (stopButtonRef.current) stopButtonRef.current.disabled = true;

    if (socketRef.current) socketRef.current.disconnect();
    if (pcRef.current) pcRef.current.close();

    // 카메라 및 비디오 중지
    const stream = myVideoRef.current?.srcObject as MediaStream;
    if (stream && myVideoRef.current) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      myVideoRef.current.srcObject = null;
    }
  };

  const initConnection = async () => {
    try {
      // 0. 소켓 연결
      socketRef.current = io("http://localhost:3000/create-room");

      // 1. 로컬 stream 생성 (발표자 브라우저에서 미디어 track 설정) + 화면에 영상 출력
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      console.log("1. 로컬 stream 생성 완료");

      // 2. 로컬 RTCPeerConnection 생성
      pcRef.current = new RTCPeerConnection();
      console.log("2. 로컬 RTCPeerConnection 생성 완료");

      // 3. 로컬 stream에 track 추가, 발표자의 미디어 트랙을 로컬 RTCPeerConnection에 추가
      if (stream) {
        console.log(stream);
        console.log("3.track 추가");
        stream.getTracks().forEach((track) => {
          console.log("track:", track);
          if (!pcRef.current) return;
          pcRef.current.addTrack(track, stream);
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
      console.log("발표자 localDescription 설정 완료");
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
        console.log("발표자 candidate 수집");
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
      console.log("remoteDescription 설정완료");
      pcRef.current.setRemoteDescription(data.SDP);
    });
    socketRef.current.on(`${socketRef.current.id}-serverCandidate`, (data) => {
      if (!pcRef.current) return;
      console.log("서버로부터 candidate 받음");
      pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
  }

  return (
    <div>
      <video
        id="remotevideo"
        style={{
          width: 240,
          height: 240,
          backgroundColor: "black"
        }}
        ref={myVideoRef}
        autoPlay
        muted
      />

      <div>
        <button className="border disabled:bg-slate-200" onClick={startLecture} ref={startButtonRef}>
          강의 시작
        </button>
        <button className="border disabled:bg-slate-200" onClick={stopLecture} ref={stopButtonRef}>
          강의 종료
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
