import CheckIcon from "@/assets/svgs/check.svg?react";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";

import stickyNoteInstance from "./stateStickyNoteInstance";
import cavasInstanceState from "./stateCanvasInstance";

type StickyNoteColor = "red" | "yellow" | "forsythia" | "lightgreen" | "blue";

const MEMO_COLOR = {
  "memo-red": "#FB9B86",
  "memo-yellow": "#FEE490",
  "memo-forsythia": "#FEFAAC",
  "memo-lightgreen": "#EBFA8E",
  "memo-blue": "#AAD3FF",
  "memo-border-red": "#DF5536",
  "memo-border-yellow": "#F2C947",
  "memo-border-forsythia": "#FCF467",
  "memo-border-lightgreen": "#D3E660",
  "memo-border-blue": "#5099E9"
};

const getColorNameByCode = (colorCode: "#FB9B86" | "#FEE490" | "#FEFAAC" | "#EBFA8E" | "#AAD3FF"): StickyNoteColor => {
  switch (colorCode) {
    case "#FB9B86":
      return "red";
    case "#FEE490":
      return "yellow";
    case "#FEFAAC":
      return "forsythia";
    case "#EBFA8E":
      return "lightgreen";
    case "#AAD3FF":
      return "blue";
  }
};

const StickyNoteColorPanel = () => {
  const [stickyNoteColor, setStickyNoteColor] = useState<StickyNoteColor>("yellow");
  const noteInstance = useRecoilValue(stickyNoteInstance);
  const canvas = useRecoilValue(cavasInstanceState);

  const handleColorButtonClick = (color: StickyNoteColor) => {
    if (!noteInstance || !canvas) return;

    // @ts-ignore
    const memoBackground = noteInstance.item(0);
    memoBackground.set({
      fill: MEMO_COLOR[`memo-${color}`],
      stroke: MEMO_COLOR[`memo-border-${color}`]
    });

    canvas.renderAll();

    setStickyNoteColor(color);
  };

  useEffect(() => {
    if (!noteInstance) return;

    // @ts-ignore
    const memoBackground = noteInstance.item(0);
    const memoFill = memoBackground.get("fill");
    setStickyNoteColor(getColorNameByCode(memoFill));
  }, [stickyNoteColor]);

  return (
    <div className="w-[9.5rem] h-[2.5rem] p-2 rounded-xl flex items-center gap-1 bg-grayscale-lightgray right-[2.75rem] bottom-[-3.125rem] absolute shadow-md">
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-red bg-memo-red"
        aria-label="빨간색"
        onClick={() => {
          handleColorButtonClick("red");
        }}
      >
        {stickyNoteColor === "red" && <CheckIcon />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-yellow bg-memo-yellow"
        aria-label="노란색"
        onClick={() => {
          handleColorButtonClick("yellow");
        }}
      >
        {stickyNoteColor === "yellow" && <CheckIcon />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-forsythia bg-memo-forsythia"
        aria-label="개나리색"
        onClick={() => {
          handleColorButtonClick("forsythia");
        }}
      >
        {stickyNoteColor === "forsythia" && <CheckIcon />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-lightgreen bg-memo-lightgreen"
        aria-label="연녹색"
        onClick={() => {
          handleColorButtonClick("lightgreen");
        }}
      >
        {stickyNoteColor === "lightgreen" && <CheckIcon />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-blue bg-memo-blue"
        aria-label="파란색"
        onClick={() => {
          handleColorButtonClick("blue");
        }}
      >
        {stickyNoteColor === "blue" && <CheckIcon />}
      </button>
    </div>
  );
};

export default StickyNoteColorPanel;
