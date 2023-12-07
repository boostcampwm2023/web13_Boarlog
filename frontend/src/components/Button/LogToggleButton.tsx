import isQuestionLogOpenState from "@/stores/stateIsQuestionLogOpen";

import { useRecoilState } from "recoil";

const LogToggleButton = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [isQuestionLogOpen, setIsQuestionLogOpen] = useRecoilState(isQuestionLogOpenState);

  return (
    <button
      type="button"
      className={`${className} w-12 h-12 flex justify-center items-center rounded-xl mb-3 ${
        isQuestionLogOpen ? "transparent" : "bg-grayscale-lightgray  shadow-md"
      }`}
      aria-label="채팅, 프롬프트"
      aria-pressed={isQuestionLogOpen}
      onClick={() => {
        setIsQuestionLogOpen(!isQuestionLogOpen);
      }}
    >
      {children}
    </button>
  );
};
export default LogToggleButton;
