import PlayIcon from "@/assets/svgs/progressPlay.svg?react";
import PauseIcon from "@/assets/svgs/progressPause.svg?react";

import { useEffect, useState } from "react";

import progressMsTimeState from "@/stores/stateProgressMsTime";
import { useRecoilState } from "recoil";

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

const ProgressBar = ({ className, totalTime }: { className: string; totalTime: number }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressMsTime, setProgressMsTime] = useRecoilState(progressMsTimeState);

  const handleProgressBarMouseUp = (event: React.MouseEvent) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const mouseClickedX = event.clientX;
    const percent = (mouseClickedX - left) / width;
    setProgressMsTime(Math.round(totalTime * percent));
  };

  useEffect(() => {
    console.log(progressMsTime);
  }, [progressMsTime]);

  return (
    <div
      className={`${className} flex gap-4 justify-between items-center w-[70vw] h-12 min-w-[400px] bg-grayscale-white rounded-lg border border-grayscale-lightgray shadow-md p-4`}
    >
      <button
        type="button"
        className="medium-12 w-8 p-2"
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div
        className="relative grow h-[6px]   bg-grayscale-lightgray"
        onMouseUp={(event) => {
          handleProgressBarMouseUp(event);
        }}
      >
        <div
          className={`absolute top-0 left-0 h-[6px] w-[0%] bg-boarlog-100`}
          style={{ width: `${getPercentOfProgress(progressMsTime, totalTime)}` }}
        ></div>
      </div>
      <span className="medium-12">00:00:00</span>
    </div>
  );
};

export default ProgressBar;
