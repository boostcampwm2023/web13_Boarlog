import MouseIcon from "@/assets/svgs/whiteboard/mouse.svg?react";
import PenIcon from "@/assets/svgs/whiteboard/pen.svg?react";
import StickyNoteIcon from "@/assets/svgs/whiteboard/stickyNote.svg?react";
import ImageIcon from "@/assets/svgs/whiteboard/image.svg?react";
import EraserIcon from "@/assets/svgs/whiteboard/eraser.svg?react";
import HandIcon from "@/assets/svgs/whiteboard/hand.svg?react";
import AddStickyNoteCursor from "@/assets/svgs/addStickyMemoCursor.svg";
import EraserCursor from "@/assets/svgs/eraserMouseCursor.svg";

import { fabricObjectWithAddWithUpdate, fabricObjectWithItem } from "./stateStickyNoteInstance";

import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { fabric } from "fabric";
import { getStickyNoteInstance } from "./getStickyNoteInstance";

import ToolButton from "./ToolButton";
import ColorPanel from "./ColorPanel";

import canvasInstanceState from "./stateCanvasInstance";
import stickyNoteInstance from "./stateStickyNoteInstance";
import stickyNoteEditPanelVisibilityState from "./stateStickyNoteEditPanelVisible";
import QuestionButton from "./QuestionButton";

export type ToolType = "select" | "pen" | "stickyNote" | "image" | "eraser" | "hand";

const Toolbar = () => {
  const [activeTool, setActiveTool] = useState<ToolType>("pen");
  const canvas = useRecoilValue(canvasInstanceState);
  const setVisibilityEditPanel = useSetRecoilState(stickyNoteEditPanelVisibilityState);
  const setStickyNoteInstance = useSetRecoilState(stickyNoteInstance);

  /**
   * @description 화이트 보드에 그려져 있는 요소들을 클릭을 통해 선택 가능한지 여부를 제어하기 위한 함수입니다.
   */
  const setIsObjectSelectable = (isSelectable: boolean) => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.forEachObject((object) => (object.selectable = isSelectable));
  };

  /**
   * @description 캔버스의 옵션을 리셋하는 함수입니다.
   * @description 그래픽 요소 선택 기능: off, 드로잉 모드: off, 드래그 블럭지정모드: off, 커서: 디폴트 포인터
   */
  const resetCanvasOption = () => {
    if (!(canvas instanceof fabric.Canvas)) return;
    setIsObjectSelectable(false);
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = "default";
  };

  const handleSelect = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    setIsObjectSelectable(true);
    canvas.selection = true;
    canvas.defaultCursor = "default";
  };

  const handlePen = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.freeDrawingBrush.width = 10;
    canvas.isDrawingMode = true;
  };

  const handleStickyNoteTool = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.defaultCursor = `url("${AddStickyNoteCursor}"), auto`;

    canvas.on("mouse:down", ({ absolutePointer }: fabric.IEvent<MouseEvent>) => {
      if (!absolutePointer) return;
      const [mousePositionX, mousePositionY] = [absolutePointer.x, absolutePointer.y];

      const stickyMemo = getStickyNoteInstance(mousePositionX, mousePositionY);

      canvas.add(stickyMemo);

      const handleClear = () => {
        canvas.fire("visiOff");
      };

      const handleUpdate = ({ selected }: fabric.IEvent<Event>) => {
        if (!selected) return;
        const selectedObjectName = selected[0].name;
        if (selectedObjectName !== "stickyMemo") {
          canvas.fire("visiOff");
        }
      };

      const handleEditEnd = (
        dummyTextBox: fabric.Textbox,
        prevTextBox: fabric.Textbox,
        memoGroup: fabricObjectWithAddWithUpdate
      ) => {
        let newTextContents = dummyTextBox.text;

        // 만약 텍스트 박스를 비운채로 편집을 마쳤다면 메모의 내용을 다시 디폴트 상태로 돌려줍니다.
        if (newTextContents?.length === 0) newTextContents = "더블 클릭해 메모 내용을 편집하세요...";

        // 더미 텍스트를 보여주기 전 숨겼던 텍스트 박스를 보여주고 새로운 내용으로 텍스트를 갱신합니다.
        prevTextBox.set({
          text: newTextContents,
          visible: true
        });

        memoGroup.addWithUpdate();

        dummyTextBox.visible = false;
        canvas.remove(dummyTextBox);
        canvas.setActiveObject(memoGroup);
      };

      const handleEditText = ({ target }: fabric.IEvent<MouseEvent>) => {
        if (!target) return;
        const textBox = (target as fabricObjectWithItem).item(1);

        // @ts-ignore
        const { left: memoLeft, top: memoTop, ...rest } = target;
        if (!memoLeft || !memoTop) return;

        // 더미 텍스트박스를 생성합니다.
        const dummyTextBox = new fabric.Textbox(textBox.text, {
          textAlign: textBox.textAlign,
          fontSize: textBox.fontSize,
          width: textBox.width,
          fill: textBox.fill,
          left: memoLeft + 10,
          top: memoTop + 10,
          splitByGrapheme: true
        });

        // 그룹에 존재하는 텍스트 박스를 숨긴 후 재 랜더링한다.
        textBox.visible = false;
        // @ts-ignore
        target.addWithUpdate();
        dummyTextBox.hasControls = false;

        // 더미 텍스트 박스를 캔버스에 추가한다.
        canvas.add(dummyTextBox);

        // 더미 텍스트 박스를 선택하고 텍스트 수정 모드로 바꾸고 텍스트 박스 내 모든 텍스트를 선택한다.
        canvas.setActiveObject(dummyTextBox);
        dummyTextBox.enterEditing();
        dummyTextBox.selectAll();

        // 텍스트의 수정을 마치는 이벤트 처리
        dummyTextBox.on("editing:exited", () => {
          handleEditEnd(dummyTextBox, textBox, target as fabricObjectWithAddWithUpdate);
        });
      };

      stickyMemo.on("selected", ({ target }) => {
        if (!target) return;
        setVisibilityEditPanel(true);
        setStickyNoteInstance(target as fabricObjectWithItem);
        canvas.on("selection:cleared", handleClear);
        canvas.on("selection:updated", handleUpdate);
      });

      stickyMemo.on("mousedblclick", handleEditText);

      canvas.on("visiOff", () => {
        setVisibilityEditPanel(false);
        canvas.off("selection:updated", handleUpdate);
        canvas.off("selection:cleared", handleClear);
      });

      setActiveTool("select");
    });
  };

  const handleEraser = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    setIsObjectSelectable(true);
    canvas.selection = true;

    canvas.defaultCursor = `url("${EraserCursor}"), auto`;

    canvas.on("mouse:up", ({ target }) => {
      if (!target) return;
      canvas.remove(target);
    });

    canvas.on("selection:created", ({ selected }) => {
      console.log(selected);
      if (activeTool === "eraser") {
        selected?.forEach((object) => canvas.remove(object));
      }
      canvas.discardActiveObject().renderAll();
    });
  };

  const handleHand = () => {
    if (!(canvas instanceof fabric.Canvas)) return;

    canvas.defaultCursor = "move";

    let panning = false;
    const handleMouseDown = () => {
      panning = true;
    };
    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (panning) {
        const delta = new fabric.Point(event.e.movementX, event.e.movementY);
        canvas.relativePan(delta);
      }
    };
    const handleMouseUp = () => {
      panning = false;
    };
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
  };

  useEffect(() => {
    if (!(canvas instanceof fabric.Canvas)) return;
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    resetCanvasOption();

    switch (activeTool) {
      case "select":
        handleSelect();
        break;

      case "pen":
        handlePen();
        break;

      case "stickyNote":
        handleStickyNoteTool();
        break;

      case "image":
        break;

      case "eraser":
        handleEraser();
        break;

      case "hand":
        handleHand();
        break;
    }
  }, [activeTool]);

  return (
    <div className="absolute top-2.5 left-2.5">
      <QuestionButton setTool={setActiveTool} />
      <div className="flex flex-col items-center justify-center p-2 w-12 gap-1 rounded-xl bg-grayscale-lightgray border border-grayscale-lightgray shadow-md ">
        <ToolButton
          icon={MouseIcon}
          onClick={() => setActiveTool("select")}
          disabled={activeTool === "select"}
          title="Select Tool"
        />
        <ToolButton
          icon={PenIcon}
          onClick={() => setActiveTool("pen")}
          disabled={activeTool === "pen"}
          title="Pen Tool"
        />
        <ToolButton
          icon={StickyNoteIcon}
          onClick={() => setActiveTool("stickyNote")}
          disabled={activeTool === "stickyNote"}
          title="Add Stikynote (포스트잇 추가)"
        />
        <ColorPanel className={`${activeTool === "pen" ? "block" : "hidden"}`} />
        <ToolButton
          icon={ImageIcon}
          onClick={() => setActiveTool("image")}
          disabled={activeTool === "image"}
          title="Image Tool"
        />
        <ToolButton
          icon={EraserIcon}
          onClick={() => setActiveTool("eraser")}
          disabled={activeTool === "eraser"}
          title="Eraser Tool"
        />
        <ToolButton
          icon={HandIcon}
          onClick={() => setActiveTool("hand")}
          disabled={activeTool === "hand"}
          title="Hand Tool"
        />
      </div>
    </div>
  );
};

export default Toolbar;
