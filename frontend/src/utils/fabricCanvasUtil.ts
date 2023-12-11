export interface ICanvasData {
  canvasJSON: string;
  viewport: number[];
  eventTime: number;
  width: number;
  height: number;
}

export const saveCanvasData = async (fabricCanvas: fabric.Canvas, currentData: ICanvasData, startTime: number) => {
  if (!fabricCanvas.viewportTransform) return;

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
    currentData.eventTime = Date.now() - startTime;
    console.log(currentData.eventTime);
    currentData.width = newWidth;
    currentData.height = newHeight;
    return true;
  } else {
    return false;
  }
};

export const loadCanvasData = ({
  fabricCanvas,
  currentData,
  newData
}: {
  fabricCanvas: fabric.Canvas;
  currentData: ICanvasData;
  newData: ICanvasData;
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
  const newHegiht = window.innerWidth * (whiteboardData.height / whiteboardData.width);
  if (newHegiht > window.innerHeight - HEADER_HEIGHT) {
    const newWidth = (window.innerHeight - HEADER_HEIGHT) * (whiteboardData.width / whiteboardData.height);
    fabricCanvas.setDimensions({
      width: newWidth,
      height: window.innerHeight - HEADER_HEIGHT
    });
  } else {
    fabricCanvas.setDimensions({
      width: window.innerWidth,
      height: newHegiht
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
