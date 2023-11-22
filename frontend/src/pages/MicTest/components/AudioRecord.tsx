// 비디오,오디오 전송을 테스트하기 위한 프로토타입 컴포넌트입니다.

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const onFrameIdRef = useRef<number | null>(null);
  const volumeMeterRef = useRef<HTMLDivElement>(null);
  const volumeMeterRef2 = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>();

  const startButtonRef = useRef<HTMLButtonElement>(null);
  const stopButtonRef = useRef<HTMLButtonElement>(null);

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

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current);
    }
  };

  const initConnection = async () => {
    try {
      // 0. 소켓 연결
      socketRef.current = io("http://localhost:3000/create-room");

      // 1. 로컬 stream 생성 (발표자 브라우저에서 미디어 track 설정) + 화면에 영상 출력
      if (!selectedMicrophone) throw new Error("마이크를 먼저 선택해주세요");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicrophone },
        video: true
      });

      handleRecordingStart(stream);

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

  //----------------------------------------------------------------------------------

  const handleRecordingStart = (stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
      const blob = new Blob(chunks, { type: "audio/wav" });
      setAudioURL(URL.createObjectURL(blob));
    };

    mediaRecorder.start();
    setIsRecording(true);

    setupAudioAnalysis(stream);
    startRecordingTimer();
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const mediaStreamAudioSourceNode = context.createMediaStreamSource(stream);
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
      colorVolumeMeter(normalizedVolume * 2);
      colorVolumeMeter2(normalizedVolume * 2);
      onFrameIdRef.current = window.requestAnimationFrame(onFrame);
    };
    onFrameIdRef.current = window.requestAnimationFrame(onFrame);
  };

  const startRecordingTimer = () => {
    let startTime = Date.now();
    const updateRecordingTime = () => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setRecordingTime(elapsedTime);
    };
    const recordingTimer = setInterval(updateRecordingTime, 1000);
    recordingTimerRef.current = recordingTimer;
  };

  const normalizeToInteger = (volume: number, min: number, max: number) => {
    const scaledValue = Math.min(max, Math.max(min, volume * (max - min) + min));
    return Math.round(scaledValue);
  };

  const colorVolumeMeter = (vol: number) => {
    if (!volumeMeterRef.current) return;
    const VOL_METER_MAX = 6; // 표시할 볼륨 미터 개수
    const childrens = volumeMeterRef.current.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
    const numberOfChildToColor = normalizeToInteger(vol, 0, VOL_METER_MAX);
    const coloredChild = Array.from(childrens).slice(0, numberOfChildToColor);
    childrens.forEach((pid) => {
      pid.style.backgroundColor = "#e6e6e6";
    });
    coloredChild.forEach((pid) => {
      pid.style.backgroundColor = "#4F4FFB";
    });
  };
  const colorVolumeMeter2 = (vol: number) => {
    if (!volumeMeterRef2.current) return;
    const VOL_METER_MAX = 10; // 표시할 볼륨 미터 개수
    const childrens = volumeMeterRef2.current.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
    const numberOfChildToColor = normalizeToInteger(vol, 1, VOL_METER_MAX);
    const coloredChild = Array.from(childrens).slice(0, numberOfChildToColor);
    childrens.forEach((pid) => {
      pid.style.backgroundColor = "#e6e6e6";
    });
    coloredChild.forEach((pid) => {
      pid.style.backgroundColor = "#69ce2b";
    });
  };

  return (
    <div className="flex flex-col justify-center items-center m-4 gap-2">
      <select className="border" onChange={(e) => setSelectedMicrophone(e.target.value)}>
        <option value="">입력 장치(마이크)를 선택하세요</option>
        {microphoneDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `마이크 ${microphoneDevices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>
      <br></br>

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

      <div className="volume-meter2 w-[150px] h-[20px] flex gap-1" ref={volumeMeterRef2}>
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="w-[8%] rounded"></div>
        ))}
      </div>

      <br></br>

      <div className="flex gap-2">
        <div className="volume-meter flex w-[40px] h-[28px] gap-1 justify-center items-center" ref={volumeMeterRef}>
          <div className="w-[10%] h-[35%] rounded bg-grayscale-lightgray"></div>
          <div className="w-[10%] h-[100%] rounded bg-grayscale-lightgray"></div>
          <div className="w-[10%] h-[60%] rounded bg-grayscale-lightgray"></div>
          <div className="w-[10%] h-[70%] rounded bg-grayscale-lightgray"></div>
          <div className="w-[10%] h-[45%] rounded bg-grayscale-lightgray"></div>
          <div className="w-[10%] h-[50%] rounded bg-grayscale-lightgray"></div>
        </div>
        <p className="semibold-20 text-boarlog-100">
          {Math.floor(recordingTime / 60)
            .toString()
            .padStart(2, "0")}
          :{(recordingTime % 60).toString().padStart(2, "0")}
        </p>
      </div>

      {audioURL && (
        <div>
          <p>녹음된 음성:</p>
          <audio controls>
            <source src={audioURL} type="audio/wav" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecord;
