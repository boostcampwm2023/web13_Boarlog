import { fabric } from "fabric";

export interface ICanvasData {
  canvasJSON: string;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
}

export interface ICanvasData2 {
  canvasJSON: string;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
  objects?: fabric.Object[];
}

export const saveCanvasData = async (fabricCanvas: fabric.Canvas, currentData: ICanvasData, startTime: number) => {
  if (!fabricCanvas.viewportTransform) return [false, false, false];
  const startTime2 = Date.now();

  const newJSONData = JSON.stringify(fabricCanvas);
  const newViewport = fabricCanvas.viewportTransform;
  const newWidth = fabricCanvas.getWidth();
  const newHeight = fabricCanvas.getHeight();

  const isCanvasDataChanged = currentData.canvasJSON !== newJSONData;
  const isViewportChanged = JSON.stringify(currentData.viewport) !== JSON.stringify(newViewport);
  const isSizeChanged = currentData.width !== newWidth || currentData.height !== newHeight;

  if (isCanvasDataChanged || isViewportChanged || isSizeChanged) {
    currentData.canvasJSON = newJSONData;
    currentData.viewport = newViewport;
    currentData.eventTime = startTime === 0 ? 0 : Date.now() - startTime;
    currentData.width = newWidth;
    currentData.height = newHeight;
    console.log("저장 지연: ", Date.now() - startTime2);
  }

  return [isCanvasDataChanged, isViewportChanged, isSizeChanged];
};

export const loadCanvasData = ({
  fabricCanvas, // 현재 참여자 페이지의 fabric.Canvas
  currentData, // 현재 참여자 페이지의 캔버스 데이터
  newData, // 발표자 페이지에게 받은 캔버스 데이터
  debugData, // 지연 시간 체크용 데이터
  canvasObjects
}: {
  fabricCanvas: fabric.Canvas;
  currentData: ICanvasData;
  newData: ICanvasData;
  debugData: any;
  canvasObjects: fabric.Object[];
}) => {
  const isCanvasDataChanged = currentData.canvasJSON !== newData.canvasJSON && newData.canvasJSON !== "";
  const isViewportChanged = JSON.stringify(currentData.viewport) !== JSON.stringify(newData.viewport);
  const isSizeChanged = currentData.width !== newData.width || currentData.height !== newData.height;

  //console.log(isCanvasDataChanged, isViewportChanged, isSizeChanged);
  // [1] 캔버스 데이터 업데이트
  if (isCanvasDataChanged) {
    //fabricCanvas.loadFromJSON(newData.canvasJSON, () => {});

    console.log("지연1", Date.now() - debugData.arriveTime);

    // 20ms
    const receiveObjects = newData.canvasJSON === "" ? [] : JSON.parse(newData.canvasJSON).objects;
    let myObjects = fabricCanvas.getObjects();
    console.log("지연2", Date.now() - debugData.arriveTime);

    // 50ms
    const deletedObjects = myObjects.filter((item) => !newData.canvasJSON.includes(JSON.stringify(item)));
    const newObjects = receiveObjects.filter(
      (item: fabric.Object) => !currentData.canvasJSON.includes(JSON.stringify(item))
    );
    console.log("지연3", Date.now() - debugData.arriveTime);

    for (var i = 0; i < deletedObjects.length; i++) {
      fabricCanvas.remove(deletedObjects[i]);
    }
    console.log("지연4", Date.now() - debugData.arriveTime);
    fabric.util.enlivenObjects(
      newObjects,
      (objs: fabric.Object[]) => {
        objs.forEach((item) => {
          fabricCanvas.add(item);
        });
      },
      ""
    );
    console.log("지연5", Date.now() - debugData.arriveTime);
    fabricCanvas.renderAll(); // Make sure to call once we're ready!
    console.log("지연6", Date.now() - debugData.arriveTime);
  }
  // [2] 캔버스 뷰포트 업데이트
  if (isViewportChanged) fabricCanvas.setViewportTransform(newData.viewport);
  // [3] 캔버스 크기 업데이트
  if (isSizeChanged) updateCanvasSize({ fabricCanvas, whiteboardData: newData });

  /* 실시간 데이터 전송 딜레이 체크 용도, 디버깅 끝나면 삭제 */
  const transmissionDelay = debugData.arriveTime - debugData.startTime - newData.eventTime;
  const renderingDelay = Date.now() - debugData.arriveTime;
  const dataSizeInBytes = new Blob([JSON.stringify(newData)]).size;

  console.log(`json 크기: ${dataSizeInBytes}\n전송 지연: ${transmissionDelay}\n불러오기 지연: ${renderingDelay}`);
  /* ------------------------------------------------------- */
};

export const updateCanvasSize = ({
  fabricCanvas,
  whiteboardData
}: {
  fabricCanvas: fabric.Canvas;
  whiteboardData: ICanvasData;
}) => {
  // 발표자 화이트보드 비율에 맞춰서 캔버스 크기 조정
  const HEADER_HEIGHT = 80;
  const newHeight = window.innerWidth * (whiteboardData.height / whiteboardData.width);
  if (newHeight > window.innerHeight - HEADER_HEIGHT) {
    const newWidth = (window.innerHeight - HEADER_HEIGHT) * (whiteboardData.width / whiteboardData.height);
    fabricCanvas.setDimensions({
      width: newWidth,
      height: window.innerHeight - HEADER_HEIGHT
    });
  } else {
    fabricCanvas.setDimensions({
      width: window.innerWidth,
      height: newHeight
    });
  }
  // 화이트보드 내용을 캔버스 크기에 맞춰서 재조정
  fabricCanvas.setDimensions(
    {
      width: whiteboardData.width,
      height: whiteboardData.height
    },
    { backstoreOnly: true }
  );
};
