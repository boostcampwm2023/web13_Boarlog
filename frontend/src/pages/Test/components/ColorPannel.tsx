interface ColorPannelInterface {
  selectedTool: string;
}

const ColorPanel = ({ selectedTool }: ColorPannelInterface) => {
  if (!selectedTool) return;

  return (
    <div
      className={`${
        selectedTool === "pen" ? "block" : "hidden"
      } flex flex-col gap-2 p-2 rounded-[0.625rem] bg-grayscale-lightgray absolute top-0 left-[3.875rem] `}
    >
      <button
        box-content
        className="w-6  h-6 block rounded-[0.625rem] bg-[#DF5536] border border-[#BB452A] "
        type="button"
        aria-label="빨간색 펜"
      ></button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#C5A339] border border-[#C5A339]"
        type="button"
        aria-label="노란색 펜"
      ></button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#FCF467] border border-[#BDB74D] "
        type="button"
        aria-label="개나리색 펜"
      ></button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#D3E660] border border-[#A1AF4B] "
        type="button"
        aria-label="연두색 펜"
      ></button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-[#5099E9] border border-[#3D76B5] "
        type="button"
        aria-label="파란색 펜"
      ></button>
      <button
        className="w-6 h-6 block rounded-[0.625rem] bg-grayscale-black border border-grayscale-black  "
        type="button"
        aria-label="검은색 펜"
      ></button>
    </div>
  );
};
export default ColorPanel;
