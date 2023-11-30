import { fabric } from "fabric";

const MEMO_COLOR = {
  "memo-yellow": "#FEE490",
  "memo-border-yellow": "#F2C947"
};

export const getStickyNoteInstance = (
  mousePositionX: number,
  mousePositionY: number,
  content = "더블 클릭해 메모 내용을 편집하세요..."
) => {
  const note = new fabric.Rect({
    left: mousePositionX,
    top: mousePositionY,
    width: 200,
    height: 150,
    fill: MEMO_COLOR["memo-yellow"],
    stroke: MEMO_COLOR["memo-border-yellow"],
    strokeWidth: 1
  });

  const text = new fabric.Textbox(content, {
    left: mousePositionX + 10,
    top: mousePositionY + 10,
    width: 180,
    fill: "black",
    fontSize: 18,
    splitByGrapheme: true
  });

  const stickyMemo = new fabric.Group([note, text]);

  stickyMemo.set("name", "stickyMemo");

  return stickyMemo;
};
