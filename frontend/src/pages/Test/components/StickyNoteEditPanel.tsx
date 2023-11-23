import SSVG from "@/assets/svgs/S.svg?react";
import MSVG from "@/assets/svgs/M.svg?react";
import LSVG from "@/assets/svgs/L.svg?react";
import XLSVG from "@/assets/svgs/XL.svg?react";
import AlignLeftSVG from "@/assets/svgs/formatAlignLeft.svg?react";
import AlignCenterSVG from "@/assets/svgs/formatAlignCenter.svg?react";
import AlignRightSVG from "@/assets/svgs/formatAlignRight.svg?react";
import PalletteSVG from "@/assets/svgs/palette.svg?react";
import DeleteMemoSVG from "@/assets/svgs/deleteMemo.svg?react";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import StickyNoteColorPanel from "./StickyNoteColorPanel";

import stickyNoteInstance from "./stateStickyNoteInstance";
import cavasInstanceState from "./stateCanvasInstance";

type FontSize = "s" | "m" | "l" | "xl";
type FontSizePixel = 12 | 18 | 24 | 30;
type FormatAlign = "left" | "center" | "right";

const ACTIVE_COLOR = "#7272fc";

const getFontSizeByPixel = (pixel: FontSizePixel): FontSize => {
  switch (pixel) {
    case 12:
      return "s";
    case 18:
      return "m";
    case 24:
      return "l";
    case 30:
      return "xl";
  }
};

const getFontSizePixelByCode = (code: FontSize): FontSizePixel => {
  switch (code) {
    case "s":
      return 12;
    case "m":
      return 18;
    case "l":
      return 24;
    case "xl":
      return 30;
  }
};

const StickyNoteEditPanel = () => {
  const [isPalletteActive, setIsPalletteActive] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("m");
  const [formatAlign, setFormatAlign] = useState<FormatAlign>("left");
  const noteInstance = useRecoilValue(stickyNoteInstance);
  const canvas = useRecoilValue(cavasInstanceState);

  const handlePalletteButtonClick = () => {
    setIsPalletteActive(!isPalletteActive);
  };

  const handleFontSizeButtonClick = (fontsize: FontSize) => {
    setFontSize(fontsize);
  };

  const handleFormatAlignButtonClick = (align: FormatAlign) => {
    if (!noteInstance || !canvas) return;

    // @ts-ignore
    const textBox = noteInstance.item(1);
    setFormatAlign(align);
  };

  const handleDeleteNote = () => {
    if (!noteInstance || !canvas) return;

    // @ts-ignore
    canvas.remove(noteInstance);
    canvas.renderAll();
  };

  useEffect(() => {
    if (!noteInstance || !canvas) return;

    // @ts-ignore
    const textBox = noteInstance.item(1);

    const fontPixel = getFontSizePixelByCode(fontSize);

    textBox.set({ fontSize: fontPixel });
    canvas.renderAll();
  }, [fontSize]);

  useEffect(() => {
    if (!noteInstance || !canvas) return;

    // @ts-ignore
    const textBox = noteInstance.item(1);
    textBox.set({ textAlign: formatAlign });

    canvas.renderAll();
  }, [formatAlign]);

  useEffect(() => {
    if (!noteInstance) return;

    // @ts-ignore
    const textBox = noteInstance.item(1);
    const textAlign: FormatAlign = textBox.get("textAlign");
    const textFontSize = textBox.get("fontSize");

    setFontSize(getFontSizeByPixel(textFontSize));
    setFormatAlign(textAlign);
  }, [noteInstance]);

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
            onClick={() => {
              handleDeleteNote();
            }}
          >
            <DeleteMemoSVG />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyNoteEditPanel;
