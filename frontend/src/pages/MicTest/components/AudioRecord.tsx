import { useState, useEffect } from "react";

const AudioRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(null);

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

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
        }, 3000); // 녹음 시간 (3초)
      })
      .catch((error) => {
        console.error("마이크 권한 획득 실패", error);
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
    </div>
  );
};

export default AudioRecord;
