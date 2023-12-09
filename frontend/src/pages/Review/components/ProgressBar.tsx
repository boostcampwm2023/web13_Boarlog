import PlayIcon from "@/assets/svgs/progressPlay.svg?react";
import PauseIcon from "@/assets/svgs/progressPause.svg?react";

import { useState } from "react";

const ProgressBar = ({ className }: { className: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
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
      <div className="relative grow h-1  bg-grayscale-lightgray">
        <div className="absolute top-0 left-0 h-1 w-1/2 bg-boarlog-100"></div>
      </div>
      <span className="medium-12">00:00:00</span>
    </div>
  );
};

export default ProgressBar;
