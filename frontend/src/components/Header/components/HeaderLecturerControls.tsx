import { useState, useRef } from "react";
import { useRecoilValue } from "recoil";

import VolumeMeter from "./VolumeMeter";

import PlayIcon from "@/assets/svgs/play.svg?react";
import StopIcon from "@/assets/svgs/stop.svg?react";
import MicOnIcon from "@/assets/svgs/micOn.svg?react";
import MicOffIcon from "@/assets/svgs/micOff.svg?react";
import SmallButton from "@/components/SmallButton/SmallButton";

import selectedMicrophoneState from "./MicState";

const HeaderLecturerControls = () => {
  const [isLectureStart, setIsLectureStart] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);

  const [micVolume, setMicVolume] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const onFrameIdRef = useRef<number | null>(null);

  const selectedMicrophone = useRecoilValue(selectedMicrophoneState);

  const startRecording = () => {
    if (!selectedMicrophone) return;

    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: selectedMicrophone } }) // 오디오 엑세스 요청
      .then((stream) => {
        // 요청이 승인되면 실행
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder; // mediaRecorder 상태 업데이트

        mediaRecorder.start();
        setIsLectureStart(true);

        // 향후 녹음된 오디오 데이터 전송을 위한 부분입니다-----------
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
        //-------------------------------------------------------------

        // 마이크 볼륨 측정을 위한 부분입니다
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
          setMicVolume(normalizedVolume);
          onFrameIdRef.current = window.requestAnimationFrame(onFrame);
        };
        onFrameIdRef.current = window.requestAnimationFrame(onFrame);

        // 경과 시간을 표시하기 위한 부분입니다
        let startTime: number = Date.now();
        const updateRecordingTime = () => {
          const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
          setRecordingTime(elapsedTime);
        };
        const recordingTimer = setInterval(updateRecordingTime, 1000);
        recordingTimerRef.current = recordingTimer;
      })
      .catch((error) => {
        console.error("마이크 권한 획득 실패", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isLectureStart) {
      mediaRecorderRef.current.stop();
      setIsLectureStart(false);
      setRecordingTime(0);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (onFrameIdRef.current) window.cancelAnimationFrame(onFrameIdRef.current);
    }
  };

  return (
    <>
      <div className="flex gap-2">
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
        onClick={!isLectureStart ? startRecording : stopRecording}
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
    </>
  );
};

export default HeaderLecturerControls;
