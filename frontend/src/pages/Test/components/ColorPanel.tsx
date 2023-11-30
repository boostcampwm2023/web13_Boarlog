import CheckIcon from "@/assets/svgs/check.svg?react";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { fabric } from "fabric";
import cavasInstanceState from "./stateCanvasInstance";

type PenColorTypes = "red" | "yellow" | "forsythia" | "lightGreen" | "blue" | "black";

const COLOR_CODE = {
  red: "#DF5536",
  yellow: "#F2C947",
  forsythia: "#FCF467",
  lightGreen: "#D3E660",
  blue: "#5099E9",
  black: "#000000"
};

const ColorPanel = ({ className }: { className: string }) => {
  const canvas = useRecoilValue(cavasInstanceState);
  const [penColor, setPenColor] = useState<PenColorTypes>("black");

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.freeDrawingBrush.color = COLOR_CODE[penColor];
  }, [penColor]);

  return (
    <div
      className={`${className} shadow-md flex flex-col gap-2 p-2 rounded-xl bg-grayscale-lightgray absolute top-0 left-[3.875rem] `}
    >
      <button
        className="w-6  h-6  rounded-[0.625rem] bg-pen-red border border-pen-border-red flex justify-center items-center	"
        type="button"
        aria-label="빨간색 펜"
        onClick={() => {
          setPenColor("red");
        }}
      >
        <CheckIcon className={`${penColor === "red" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6  rounded-[0.625rem] bg-pen-yellow border border-pen-border-yellow flex justify-center items-center"
        type="button"
        aria-label="노란색 펜"
        onClick={() => {
          setPenColor("yellow");
        }}
      >
        <CheckIcon className={`${penColor === "yellow" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6  rounded-[0.625rem] bg-pen-forsythia border border-pen-border-forsythia flex justify-center items-center"
        type="button"
        aria-label="개나리색 펜"
        onClick={() => {
          setPenColor("forsythia");
        }}
      >
        <CheckIcon className={`${penColor === "forsythia" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6  rounded-[0.625rem] bg-pen-lightgreen border border-pen-border-lightgreen flex justify-center items-center"
        type="button"
        aria-label="연두색 펜"
        onClick={() => {
          setPenColor("lightGreen");
        }}
      >
        <CheckIcon className={`${penColor === "lightGreen" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6  rounded-[0.625rem] bg-pen-blue border border-pen-border-blue flex justify-center items-center"
        type="button"
        aria-label="파란색 펜"
        onClick={() => {
          setPenColor("blue");
        }}
      >
        <CheckIcon className={`${penColor === "blue" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6  rounded-[0.625rem] bg-grayscale-black border border-grayscale-black  flex justify-center items-center"
        type="button"
        aria-label="검은색 펜"
        onClick={() => {
          setPenColor("black");
        }}
      >
        <CheckIcon className={`${penColor === "black" ? "" : "hidden"}`} />
      </button>
    </div>
  );
};

export default ColorPanel;
