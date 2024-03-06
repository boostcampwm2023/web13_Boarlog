export interface ICanvasData {
  canvasJSON: string;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
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
  fabricCanvas,
  currentData,
  newData,
  debugData
}: {
  fabricCanvas: fabric.Canvas;
  currentData: ICanvasData;
  newData: ICanvasData;
  debugData: any;
}) => {
  const isCanvasDataChanged = currentData.canvasJSON !== newData.canvasJSON;
  const isViewportChanged = JSON.stringify(currentData.viewport) !== JSON.stringify(newData.viewport);
  const isSizeChanged = currentData.width !== newData.width || currentData.height !== newData.height;
  //console.log(isCanvasDataChanged, isViewportChanged, isSizeChanged);

  // 캔버스 데이터 업데이트
  if (isCanvasDataChanged) fabricCanvas.loadFromJSON(newData.canvasJSON, () => {});
  // 캔버스 뷰포트 업데이트
  if (isViewportChanged) fabricCanvas.setViewportTransform(newData.viewport);
  // 캔버스 크기 업데이트
  if (isSizeChanged) updateCanvasSize({ fabricCanvas, whiteboardData: newData });

  /* 실시간 데이터 전송 딜레이 체크 용도, 디버깅 끝나면 삭제 */
  let jsonString = JSON.stringify(newData);
  let sizeInBytes = new Blob([jsonString]).size;

  const transmissionDelay = debugData.arriveTime - debugData.startTime - newData.eventTime;
  const renderingDelay = Date.now() - debugData.arriveTime;

  console.log(`json 크기: ${sizeInBytes}\n전송 지연: ${transmissionDelay}\n불러오기 지연: ${renderingDelay}`);
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
