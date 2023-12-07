import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import micVolumeState from "@/stores/stateMicVolume";

const VolumeMeter = () => {
  const volumeMeterRef = useRef<HTMLDivElement>(null);
  const micVolume = useRecoilValue(micVolumeState);

  useEffect(() => {
    colorVolumeMeter(micVolume);
  }, [micVolume]);

  const normalizeToInteger = (volume: number, min: number, max: number) => {
    const scaledValue = Math.min(max, Math.max(min, volume * (max - min) + min));
    return Math.round(scaledValue);
  };

  const colorVolumeMeter = (vol: number) => {
    if (!volumeMeterRef.current) return;
    const VOL_METER_MAX = 6; // 표시할 볼륨 미터 개수
    const childrens = volumeMeterRef.current.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
    const numberOfChildToColor = normalizeToInteger(vol, 0, VOL_METER_MAX);
    const coloredChild = Array.from(childrens).slice(0, numberOfChildToColor);
    childrens.forEach((pid) => {
      pid.style.backgroundColor = "#e6e6e6";
    });
    coloredChild.forEach((pid) => {
      pid.style.backgroundColor = "#4F4FFB";
    });
  };

  return (
    <>
      <div className="flex w-[40px] h-[28px] gap-1 justify-center items-center" ref={volumeMeterRef}>
        <div className="w-[10%] h-[35%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[100%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[60%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[70%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[45%] rounded bg-grayscale-lightgray"></div>
        <div className="w-[10%] h-[50%] rounded bg-grayscale-lightgray"></div>
      </div>
    </>
  );
};

export default VolumeMeter;
