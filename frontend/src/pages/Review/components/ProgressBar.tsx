import PlayIcon from "@/assets/svgs/progressPlay.svg?react";
import PauseIcon from "@/assets/svgs/progressPause.svg?react";

import { useRecoilValue } from "recoil";
import { useEffect, useRef } from "react";
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
  progressBarState: "disabled" | "playing" | "paused";
  play: () => void;
  pause: () => void;
  updateProgressMsTime: (time: number) => void;
}

const ProgressBar = ({
  className,
  totalTime,
  progressBarState,
  play,
  pause,
  updateProgressMsTime
}: ProgressBarProps) => {
  const [isProgressBarDrag, setIsProgressBarDrag] = useState(false);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);
  const timerRef = useRef<any>();
  const progressBarRef = useRef<any>();
  const progressInnerBar = useRef<any>();
  const [throttle, setThrottle] = useState(false);
  const timerRef = useRef<any>();

  const setMsTimeAndProgressBarWidth = (event: React.MouseEvent) => {
    const { left, width } = progressBarRef.current.getBoundingClientRect();
    const mouseClickedX = event.clientX;
    let percent = (mouseClickedX - left) / width;
    if (percent <= 0) percent = 0;
    updateProgressMsTime(Math.round(totalTime * percent));
    setProgressMsTime(Math.round(totalTime * percent));
  };

  const handleProgressBarDrag = (event: React.MouseEvent) => {
    setMsTimeAndProgressBarWidth(event);
  };

  const handleProgressBarMouseDown = (event: React.MouseEvent) => {
    if (progressBarState === "playing") {
      pause();
    }
    setMsTimeAndProgressBarWidth(event);
    setIsProgressBarDrag(true);
  };

  const handleProgressBarMouseMove = (event: React.MouseEvent) => {
    if (isProgressBarDrag) {
      const { left } = progressBarRef.current.getBoundingClientRect();
      const mouseClientX = event.clientX;
      progressInnerBar.current.style.width = `${mouseClientX - left}px`;

      if (throttle) return;
      else {
        setThrottle(true);
        setTimeout(() => {
          handleProgressBarDrag(event);

          setThrottle(false);
        }, 250);
      }
    }
  };

  const handleProgressBarMouseUp = (event: React.MouseEvent) => {
    setMsTimeAndProgressBarWidth(event);

    setIsProgressBarDrag(false);
  };

  const handleProgressBarMouseLeave = () => {
    setIsProgressBarDrag(false);
  };

  useEffect(() => {
    if (progressMsTime >= totalTime) {
      progressBarState = "disabled";
      setProgressMsTime(totalTime);
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
          progressBarState === "playing" ? pause() : play();
        }}
        disabled={progressBarState === "disabled"}
      >
        {progressBarState === "disabled" ? (
          <PlayIcon fill="gray" />
        ) : progressBarState === "playing" ? (
          <PauseIcon />
        ) : (
          <PlayIcon />
        )}
      </button>
      <div
        className="flex h-4 grow items-center"
        onMouseUp={(event) => {
          handleProgressBarMouseUp(event);
        }}
        onMouseDown={(event) => {
          handleProgressBarMouseDown(event);
        }}
        onMouseMove={(event) => {
          handleProgressBarMouseMove(event);
        }}
        onMouseLeave={() => {
          handleProgressBarMouseLeave();
        }}
        ref={progressBarRef}
      >
        <div className="relative grow h-[6px] bg-grayscale-lightgray">
          <div
            className={`absolute top-0 left-0 h-[6px] w-[0%] bg-boarlog-100`}
            style={{ width: isProgressBarDrag ? "" : `${getPercentOfProgress(progressMsTime, totalTime)}` }}
            ref={progressInnerBar}
          ></div>
        </div>
      </div>
      <span className="medium-12">{convertMsToTimeString(progressMsTime)}</span>
    </div>
  );
};

export default ProgressBar;
