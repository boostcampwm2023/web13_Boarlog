import PlayIcon from "@/assets/svgs/progressPlay.svg?react";
import PauseIcon from "@/assets/svgs/progressPause.svg?react";

import { useRecoilState } from "recoil";
import { useEffect, useRef, useState } from "react";
import { convertMsToTimeString } from "@/utils/convertMsToTimeString";

import progressMsTimeState from "@/stores/stateProgressMsTime";

const getPercentOfProgress = (progressTime: number, totalTime: number) => {
  const percent = (progressTime / totalTime) * 100;
  let result;

  if (percent < 0) {
    result = 0;
  } else if (percent > 100) {
    result = 100;
  } else {
    result = percent;
  }

  return result.toFixed(1) + "%";
};

interface ProgressBarProps {
  className: string;
  totalTime: number;
  prograssBarState: "disabled" | "playing" | "paused";
  play: () => void;
  pause: () => void;
  updateProgressMsTime: (time: number) => void;
}

const ProgressBar = ({
  className,
  totalTime,
  prograssBarState,
  play,
  pause,
  updateProgressMsTime
}: ProgressBarProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);
  const timerRef = useRef<any>();
  const lastUpdatedTime = useRef<any>();
  const UPDATE_INTERVAL_MS = 150;

  const handleProgressBarMouseDown = (event: React.MouseEvent) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const mouseClickedX = event.clientX;
    const percent = (mouseClickedX - left) / width;
    updateProgressMsTime(Math.round(totalTime * percent));
  };

  useEffect(() => {
    if (isPlaying) {
      lastUpdatedTime.current = new Date().getTime();

      timerRef.current = setInterval(() => {
        const dateNow = new Date().getTime();
        const diffTime = dateNow - lastUpdatedTime.current;
        setProgressMsTime((progressMsTime) => progressMsTime + diffTime);

        lastUpdatedTime.current = dateNow;
      }, UPDATE_INTERVAL_MS);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (progressMsTime >= totalTime) {
      //prograssBarState = "disabled";
      setProgressMsTime(totalTime);
      //setIsPlaying(false);
      clearInterval(timerRef.current);
    }
  }, [progressMsTime]);

  return (
    <div
      className={`${className} flex gap-4 justify-between items-center w-[70vw] h-12 min-w-[400px] bg-grayscale-white rounded-lg border border-grayscale-lightgray shadow-md p-4`}
    >
      <button
        type="button"
        className="medium-12 w-8 p-2"
        onClick={() => {
          prograssBarState === "playing" ? pause() : play();
        }}
        disabled={prograssBarState === "disabled"}
      >
        {prograssBarState === "disabled" ? (
          <PlayIcon fill="gray" />
        ) : prograssBarState === "playing" ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>
      <div
        className="flex h-4 grow items-center"
        onMouseDown={(event) => {
          handleProgressBarMouseDown(event);
        }}
      >
        <div className="relative grow h-[6px] bg-grayscale-lightgray">
          <div
            className={`absolute top-0 left-0 h-[6px] w-[0%] bg-boarlog-100`}
            style={{ width: `${getPercentOfProgress(progressMsTime, totalTime)}` }}
          ></div>
        </div>
      </div>
      <span className="medium-12">{convertMsToTimeString(progressMsTime)}</span>
    </div>
  );
};

export default ProgressBar;
