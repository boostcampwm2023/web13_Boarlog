import CheckSVG from "@/assets/svgs/check.svg?react";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import { fabric } from "fabric";
import cavasInstanceState from "./stateCanvasInstance";

interface ColorPannelInterface {
  className: string;
}
type PenColorTypes = "red" | "yellow" | "forsythia" | "lightGreen" | "blue" | "black";

const colorCode = {
  red: "#DF5536",
  yellow: "#F2C947",
  forsythia: "#FCF467",
  lightGreen: "#D3E660",
  blue: "#5099E9",
  black: "#000000"
};

const ColorPanel = ({ className }: ColorPannelInterface) => {
  const canvas = useRecoilValue(cavasInstanceState);
  const [penColor, setPenColor] = useState<PenColorTypes>("black");

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.freeDrawingBrush.color = colorCode[penColor];
  }, [penColor]);

  return (
    <div
      className={
        className + ` flex flex-col gap-2 p-2 rounded-[0.625rem] bg-grayscale-lightgray absolute top-0 left-[3.875rem] `
      }
    >
      <button
        className="w-6  h-6 block rounded-[0.625rem] bg-[#DF5536] border border-[#BB452A] flex justify-center items-center	"
        type="button"
        aria-label="빨간색 펜"
        onClick={() => {
          setPenColor("red");
        }}
      >
        <CheckSVG className={`${penColor === "red" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#F2C947] border border-[#C5A339] flex justify-center items-center"
        type="button"
        aria-label="노란색 펜"
        onClick={() => {
          setPenColor("yellow");
        }}
      >
        <CheckSVG className={`${penColor === "yellow" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#FCF467] border border-[#BDB74D] flex justify-center items-center"
        type="button"
        aria-label="개나리색 펜"
        onClick={() => {
          setPenColor("forsythia");
        }}
      >
        <CheckSVG className={`${penColor === "forsythia" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#D3E660] border border-[#A1AF4B] flex justify-center items-center"
        type="button"
        aria-label="연두색 펜"
        onClick={() => {
          setPenColor("lightGreen");
        }}
      >
        <CheckSVG className={`${penColor === "lightGreen" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#5099E9] border border-[#3D76B5] flex justify-center items-center"
        type="button"
        aria-label="파란색 펜"
        onClick={() => {
          setPenColor("blue");
        }}
      >
        <CheckSVG className={`${penColor === "blue" ? "" : "hidden"}`} />
      </button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-grayscale-black border border-grayscale-black  flex justify-center items-center"
        type="button"
        aria-label="검은색 펜"
        onClick={() => {
          setPenColor("black");
        }}
      >
        <CheckSVG className={`${penColor === "black" ? "" : "hidden"}`} />
      </button>
    </div>
  );
};

export default ColorPanel;
