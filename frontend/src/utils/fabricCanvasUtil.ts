import { fabric } from "fabric";
import pako from "pako";

export interface ICanvasData {
  objects: Uint8Array;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
  canvasJSON?: string;
}

export const saveCanvasData = async (fabricCanvas: fabric.Canvas, currentData: ICanvasData, startTime: number) => {
  if (!fabricCanvas.viewportTransform) return [false, false, false];
  const startTime2 = Date.now();

  const newObjects = fabricCanvas.getObjects();
  const newViewport = fabricCanvas.viewportTransform;
  const newWidth = fabricCanvas.getWidth();
  const newHeight = fabricCanvas.getHeight();

  const isCanvasDataChanged = currentData.canvasJSON !== JSON.stringify(fabricCanvas);
  const isViewportChanged = JSON.stringify(currentData.viewport) !== JSON.stringify(newViewport);
  const isSizeChanged = currentData.width !== newWidth || currentData.height !== newHeight;

  if (isCanvasDataChanged || isViewportChanged || isSizeChanged) {
    console.log(isCanvasDataChanged, isViewportChanged, isSizeChanged);
    currentData.objects = pako.gzip(JSON.stringify(newObjects));
    currentData.viewport = newViewport;
    currentData.eventTime = startTime === 0 ? 0 : Date.now() - startTime;
    currentData.width = newWidth;
    currentData.height = newHeight;
    console.log("저장 지연: ", Date.now() - startTime2);
    currentData.canvasJSON = JSON.stringify(fabricCanvas);
  }

  return [isCanvasDataChanged, isViewportChanged, isSizeChanged];
};

export const loadCanvasData = ({
  fabricCanvas, // 현재 참여자 페이지의 fabric.Canvas
  currentData, // 현재 참여자 페이지의 캔버스 데이터
  newData, // 발표자 페이지에게 받은 캔버스 데이터
  debugData // 지연 시간 체크용 데이터
}: {
  fabricCanvas: fabric.Canvas;
  currentData: ICanvasData;
  newData: ICanvasData;
  debugData?: any;
}) => {
  console.log("길이", newData.objects, newData.objects.byteLength);
  const isCanvasDataChanged = newData.objects?.byteLength !== 0 && newData.objects?.byteLength !== undefined;
  //  const isCanvasDataChanged =  JSON.stringify(currentData.objects) !== JSON.stringify(newData.objects) && newData.objects.length !== 0;
  const isViewportChanged = JSON.stringify(currentData.viewport) !== JSON.stringify(newData.viewport);
  const isSizeChanged = currentData.width !== newData.width || currentData.height !== newData.height;

  // [1] 캔버스 데이터 업데이트
  if (isCanvasDataChanged) {
    //fabricCanvas.loadFromJSON(newData.canvasJSON, () => {});

    const receiveObjects = JSON.parse(pako.inflate(newData.objects, { to: "string" }));
    const currentObjects = fabricCanvas.getObjects();

    const findUniqueObjects = (a: any[], b: fabric.Object[]) => {
      const aSet = new Set(a.map((item) => JSON.stringify(item)));
      const bSet = new Set(b.map((item) => JSON.stringify(item)));

      const uniqueInA = a.filter((obj) => !bSet.has(JSON.stringify(obj)));
      const uniqueInB = b.filter((obj) => !aSet.has(JSON.stringify(obj)));

      return [uniqueInA, uniqueInB];
    };
    const [deletedObjects, newObjects] = findUniqueObjects(currentObjects, receiveObjects);

    const deleteObject = () => {
      for (var i = 0; i < deletedObjects.length; i++) {
        fabricCanvas.remove(deletedObjects[i]);
      }
    };
    const addObject = () => {
      fabric.util.enlivenObjects(
        newObjects,
        (objs: fabric.Object[]) => {
          objs.forEach((item) => {
            fabricCanvas.add(item);
          });
        },
        ""
      );
    };
    deleteObject();
    addObject();

    fabricCanvas.renderAll();
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
