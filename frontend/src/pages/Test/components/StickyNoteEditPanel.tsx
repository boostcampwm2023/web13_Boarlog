import SSVG from "@/assets/svgs/S.svg?react";
import MSVG from "@/assets/svgs/M.svg?react";
import LSVG from "@/assets/svgs/L.svg?react";
import XLSVG from "@/assets/svgs/XL.svg?react";
import AlignLeftSVG from "@/assets/svgs/formatAlignLeft.svg?react";
import AlignCenterSVG from "@/assets/svgs/formatAlignCenter.svg?react";
import AlignRightSVG from "@/assets/svgs/formatAlignRight.svg?react";
import PalletteSVG from "@/assets/svgs/palette.svg?react";
import DeleteMemoSVG from "@/assets/svgs/deleteMemo.svg?react";
import CheckSVG from "@/assets/svgs/check.svg?react";
import { MouseEventHandler, useState } from "react";

type FontSize = "s" | "m" | "l" | "xl";
type FormatAlign = "left" | "center" | "right";

const ACTIVE_COLOR = "#7272fc";

const StickyNoteEditPanel = () => {
  const [isPalletteActive, setIsPalletteActive] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("s");
  const [formatAlign, setFormatAlign] = useState<FormatAlign>("left");

  const handlePalletteButton = () => {
    setIsPalletteActive(!isPalletteActive);
  };

  const handleFontSizeButton = (fontsize: FontSize) => {
    setFontSize(fontsize);
  };

  const handleFormatAlignButton = (align: FormatAlign) => {
    setFormatAlign(align);
  };

  return (
    <div className="">
      <div className="w-[22.25rem] h-[2.875rem] px-4 bg-grayscale-lightgray rounded-xl flex items-center relative">
        {isPalletteActive && <StickyNoteColorPanel />}
        <div className="flex items-center gap-3 after:content-[''] after:block after:w-px after:h-[20px] after:bg-grayscale-gray">
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 크기 S"
            aria-pressed={fontSize === "s" ? true : false}
            onClick={() => {
              handleFontSizeButton("s");
            }}
          >
            <SSVG style={fontSize === "s" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center "
            aria-label="텍스트 크기 M"
            aria-pressed={fontSize === "m" ? true : false}
            onClick={() => {
              handleFontSizeButton("m");
            }}
          >
            <MSVG style={fontSize === "m" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 크기 L"
            aria-pressed={fontSize === "l" ? true : false}
            onClick={() => {
              handleFontSizeButton("l");
            }}
          >
            <LSVG style={fontSize === "l" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 크기 XL"
            aria-pressed={fontSize === "xl" ? true : false}
            onClick={() => {
              handleFontSizeButton("xl");
            }}
          >
            <XLSVG style={fontSize === "xl" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
        </div>
        <div className="flex items-center mx-3 gap-2">
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 좌측 정렬"
            aria-pressed={formatAlign === "left" ? true : false}
            onClick={() => {
              handleFormatAlignButton("left");
            }}
          >
            <AlignLeftSVG style={formatAlign === "left" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 중앙 정렬"
            aria-pressed={formatAlign === "center" ? true : false}
            onClick={() => {
              handleFormatAlignButton("center");
            }}
          >
            <AlignCenterSVG style={formatAlign === "center" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 우측 정렬"
            aria-pressed={formatAlign === "right" ? true : false}
            onClick={() => {
              handleFormatAlignButton("right");
            }}
          >
            <AlignRightSVG style={formatAlign === "right" ? { fill: ACTIVE_COLOR } : undefined} />
          </button>
        </div>
        <div className="flex items-center gap-2 before:content-[''] before:block before:w-px before:h-[20px] before:bg-grayscale-gray">
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="메모지 컬러 팔레트 켜고 닫기"
            aria-pressed={isPalletteActive}
            aria-aria-expanded={isPalletteActive}
            onClick={() => {
              handlePalletteButton();
            }}
          >
            <PalletteSVG />
          </button>
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="메모지 제거"
          >
            <DeleteMemoSVG />
          </button>
        </div>
      </div>
    </div>
  );
};

const StickyNoteColorPanel = () => {
  return (
    <div className="w-[9.5rem] h-[2.5rem] p-2 rounded-xl flex items-center gap-1 bg-grayscale-lightgray right-[2.75rem] top-[-3.125rem] absolute ">
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-red bg-memo-red"
        aria-label="빨간색"
      >
        <CheckSVG />
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-yellow bg-memo-yellow"
        aria-label="노란색"
      >
        <CheckSVG />
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-forsythia bg-memo-forsythia"
        aria-label="개나리색"
      >
        <CheckSVG />
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-lightgreen bg-memo-lightgreen"
        aria-label="연녹색"
      >
        <CheckSVG />
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-blue bg-memo-blue"
        aria-label="파란색"
      >
        <CheckSVG />
      </button>
    </div>
  );
};

export default StickyNoteEditPanel;
