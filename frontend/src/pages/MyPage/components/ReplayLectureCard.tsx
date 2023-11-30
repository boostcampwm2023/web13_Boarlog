import ProfileMedium from "@/assets/imgs/profileMedium.png";
import UserIcon from "@/assets/svgs/user.svg?react";
import CalendarIcon from "@/assets/svgs/calendar.svg?react";
import PlayIcon from "@/assets/svgs/play.svg?react";

const ReplayLectureCard = () => {
  return (
    <div className="flex flex-col w-full p-6 gap-4 justify-between bg-grayscale-white border-default rounded-xl hover:shadow-xl duration-500 cursor-pointer break-keep">
      <div className="flex flex-row gap-3 w-full items-center">
        <img src={ProfileMedium} alt="강의 진행자 프로필" className="w-12 h-12" />
        <div className="flex flex-col w-full gap-1 justify-center items-left semibold-20">
          React Hooks 알아보기
          <div className="flex flex-row gap-1 items-center medium-16 text-grayscale-darkgray">
            <UserIcon className="w-4 h-4 fill-grayscale-darkgray" />
            볼록이
          </div>
        </div>
      </div>
      <p className="medium-16 text-grayscale-darkgray">
        앞으로 그룹 프로젝트에서 활용할 React Hooks에 대해 간단히 알아봅시다. useEffect와 useState에 대해서 학습합니다.
      </p>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row gap-1 items-center semibold-16 text-boarlog-100">
          <CalendarIcon className="w-4 h-4 fill-boarlog-100" />
          2023.00.00 00:00
        </div>{" "}
        <div className="flex flex-row gap-1 items-center semibold-16 text-alert-100">
          <PlayIcon className="w-4 h-4 fill-alert-100" />
          00:00
        </div>
      </div>
    </div>
  );
};

export default ReplayLectureCard;
