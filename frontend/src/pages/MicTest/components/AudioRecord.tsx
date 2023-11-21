import { useState, useEffect, useRef } from "react";

const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);

  const volumeMeterRef = useRef<HTMLDivElement>(null);

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

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
        // 2048: FFT의 크기 1: 입력 채널 수 1: 출력 채널 수

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          console.log(`음량 :`, average);
          colorVolumeMeter(average);
        };

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 3000); // 녹음 시간 (3초)
      })
      .catch((error) => {
        console.error("마이크 권한 획득 실패", error);
      });
  };

  // Your existing colorPids function
  const colorVolumeMeter = (vol: number) => {
    if (!volumeMeterRef.current) return;
    const childrens = volumeMeterRef.current.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
    const numberOfChildToColor = Math.round(vol / 10);
    const coloredChild = Array.from(childrens).slice(0, numberOfChildToColor);
    console.log(`numberOfChildToColor :`, coloredChild);

    childrens.forEach((pid) => {
      pid.style.backgroundColor = "#e6e7e8";
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

      <div className="volume-meter w-[150px] h-[20px] flex gap-1" ref={volumeMeterRef}>
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="w-[8%] rounded"></div>
        ))}
      </div>
    </div>
  );
};

export default AudioRecord;
