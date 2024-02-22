import { fabric } from "fabric";

const MEMO_COLOR = {
  "memo-yellow": "#FEE490",
  "memo-border-yellow": "#F2C947"
};

const INITIAL_BOTTOM_PADDING = 100;
const INITIAL_X_PADDING = 20;
const INITIAL_TOP_AND_LEFT_PADDING = 10;
const INITIAL_TEXT_WIDTH = 180;

export const getStickyNoteInstance = (
  mousePositionX: number,
  mousePositionY: number,
  content = "더블 클릭해 메모 내용을 편집하세요..."
) => {
  const text = new fabric.Textbox(content, {
    fontFamily: "Pretendard Variable",
    left: mousePositionX + INITIAL_TOP_AND_LEFT_PADDING,
    top: mousePositionY + INITIAL_TOP_AND_LEFT_PADDING,
    width: INITIAL_TEXT_WIDTH,
    fill: "black",
    fontSize: 18,
    splitByGrapheme: true
  });

  if (!text.height) text.height = 150;
  if (!text.width) text.width = 180;

  const note = new fabric.Rect({
    left: mousePositionX,
    top: mousePositionY,
    width: text.width + INITIAL_X_PADDING,
    height: text.height + INITIAL_BOTTOM_PADDING,
    fill: MEMO_COLOR["memo-yellow"],
    stroke: MEMO_COLOR["memo-border-yellow"],
    strokeWidth: 1
  });

  const stickyMemo = new fabric.Group([note, text], { hasControls: false });

  stickyMemo.set("name", "stickyMemo");

  return stickyMemo;
};
