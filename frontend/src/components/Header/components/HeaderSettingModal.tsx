interface HeaderSettingModalProps {
  isSettingClicked: boolean;
  setIsSettingClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderSettingModal = ({ isSettingClicked, setIsSettingClicked }: HeaderSettingModalProps) => {
  return (
    <>
      <div
        className={`w-screen h-screen fixed top-0 left-0 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSettingClicked(!isSettingClicked)}
      />
      <div
        className={`flex flex-col absolute top-24 right-4 items-center gap-4 px-6 py-4 w-96 h-fit bg-grayscale-white rounded-xl border-default duration-500 ${
          isSettingClicked ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-row gap-3 w-full h-14 justify-start">
          <p className="semibold-18">입력 장치 설정</p>
        </div>
        <div className="flex flex-row gap-4 w-full"></div>
      </div>
    </>
  );
};

export default HeaderSettingModal;
