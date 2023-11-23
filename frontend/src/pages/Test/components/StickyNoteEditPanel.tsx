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
import { useState } from "react";

type FontSize = "s" | "m" | "l" | "xl";
type FormatAlign = "left" | "center" | "right";
type StickyNoteColor = "red" | "yellow" | "forsythia" | "lightgreen" | "blue";

const ACTIVE_COLOR = "#7272fc";

const StickyNoteEditPanel = () => {
  const [isPalletteActive, setIsPalletteActive] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("s");
  const [formatAlign, setFormatAlign] = useState<FormatAlign>("left");

  const handlePalletteButtonClick = () => {
    setIsPalletteActive(!isPalletteActive);
  };

  const handleFontSizeButtonClick = (fontsize: FontSize) => {
    setFontSize(fontsize);
  };

  const handleFormatAlignButtonClick = (align: FormatAlign) => {
    setFormatAlign(align);
  };

  return (
    <div className="absolute top-2.5 left-1/2 translate-x-[-50%] ">
      <div className="w-[22.25rem] h-[2.875rem] px-4 bg-grayscale-lightgray rounded-xl flex items-center relative shadow-md">
        {isPalletteActive && <StickyNoteColorPanel />}
        <div className="flex items-center gap-3 after:content-[''] after:block after:w-px after:h-[20px] after:bg-grayscale-gray">
          <button
            type="button"
            className="h-6 w-6 bg-transparent flex justify-center items-center"
            aria-label="텍스트 크기 S"
            aria-pressed={fontSize === "s" ? true : false}
            onClick={() => {
              handleFontSizeButtonClick("s");
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
              handleFontSizeButtonClick("m");
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
              handleFontSizeButtonClick("l");
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
              handleFontSizeButtonClick("xl");
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
              handleFormatAlignButtonClick("left");
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
              handleFormatAlignButtonClick("center");
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
              handleFormatAlignButtonClick("right");
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
            aria-expanded={isPalletteActive}
            onClick={() => {
              handlePalletteButtonClick();
            }}
          >
            <PalletteSVG style={isPalletteActive ? { fill: ACTIVE_COLOR } : undefined} />
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
  const [stickyNoteColor, setStickyNoteColor] = useState<StickyNoteColor>("yellow");

  const handleColorButtonClick = (color: StickyNoteColor) => {
    setStickyNoteColor(color);
  };

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
        {stickyNoteColor === "red" && <CheckSVG />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-yellow bg-memo-yellow"
        aria-label="노란색"
        onClick={() => {
          handleColorButtonClick("yellow");
        }}
      >
        {stickyNoteColor === "yellow" && <CheckSVG />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-forsythia bg-memo-forsythia"
        aria-label="개나리색"
        onClick={() => {
          handleColorButtonClick("forsythia");
        }}
      >
        {stickyNoteColor === "forsythia" && <CheckSVG />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-lightgreen bg-memo-lightgreen"
        aria-label="연녹색"
        onClick={() => {
          handleColorButtonClick("lightgreen");
        }}
      >
        {stickyNoteColor === "lightgreen" && <CheckSVG />}
      </button>
      <button
        type="button"
        className="rounded-[10px] h-6 w-6 border flex justify-center items-center border-memo-border-blue bg-memo-blue"
        aria-label="파란색"
        onClick={() => {
          handleColorButtonClick("blue");
        }}
      >
        {stickyNoteColor === "blue" && <CheckSVG />}
      </button>
    </div>
  );
};

export default StickyNoteEditPanel;
