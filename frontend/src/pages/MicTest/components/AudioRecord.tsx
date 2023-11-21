import { useState, useEffect, useRef } from "react";

const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);

  const volumeMeterRef = useRef<HTMLDivElement>(null);
  const volumeMeterRef2 = useRef<HTMLDivElement>(null);

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

  const startRecording = () => {
    if (!selectedMicrophone) return;
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: selectedMicrophone } }) // 오디오 엑세스 요청
      .then((stream) => {
        // 요청이 승인되면 실행
        const mediaRecorder = new MediaRecorder(stream);
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
          const normalizedVolume = Math.min(1, rms / 0.5); // 볼륨 값 정규화 (0~1)
          colorVolumeMeter(normalizedVolume);
          colorVolumeMeter2(normalizedVolume);
          window.requestAnimationFrame(onFrame);
        };
        window.requestAnimationFrame(onFrame);

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 3000); // 녹음 시간 (3초)
      })
      .catch((error) => {
        console.error("마이크 권한 획득 실패", error);
      });
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
    console.log(`vol :`, vol, numberOfChildToColor);
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
    console.log(`vol :`, vol, numberOfChildToColor);
    const coloredChild = Array.from(childrens).slice(0, numberOfChildToColor);
    childrens.forEach((pid) => {
      pid.style.backgroundColor = "#e6e6e6";
    });
    coloredChild.forEach((pid) => {
      pid.style.backgroundColor = "#69ce2b";
    });
  };

  return (
    <div>
      <select className="border" onChange={(e) => setSelectedMicrophone(e.target.value)}>
        <option value="">입력 장치(마이크)를 선택하세요</option>
        {microphoneDevices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `마이크 ${microphoneDevices.indexOf(device) + 1}`}
          </option>
        ))}
      </select>
      <br></br>

      <button className="border" onClick={startRecording} disabled={isRecording || !selectedMicrophone}>
        {isRecording ? "녹음 중..." : "녹음 시작"}
      </button>

      {audioURL && (
        <div>
          <p>녹음된 음성:</p>
          <audio controls>
            <source src={audioURL} type="audio/wav" />
          </audio>
        </div>
      )}

      <div className="volume-meter2 w-[150px] h-[20px] flex gap-1" ref={volumeMeterRef2}>
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="w-[8%] rounded"></div>
        ))}
      </div>

      <br></br>

      <div className="volume-meter flex w-[40px] h-[28px] gap-1 justify-center items-center" ref={volumeMeterRef}>
        <div className="w-[10%] h-[35%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[100%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[60%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[70%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[45%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[50%] rounded bg-grayscale-lightgray"></div>
      </div>
    </div>
  );
};

export default AudioRecord;
