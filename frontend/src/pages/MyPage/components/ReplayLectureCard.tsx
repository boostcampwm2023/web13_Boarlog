import ProfileMedium from "@/assets/imgs/profileMedium.png";
import UserIcon from "@/assets/svgs/user.svg?react";
import CalendarIcon from "@/assets/svgs/calendar.svg?react";
import PlayIcon from "@/assets/svgs/play.svg?react";

interface ReplayLectureCardProps {
  user: string;
  title: string;
  description: string;
  onClick: () => void;
}

const ReplayLectureCard = ({ user, title, description, onClick }: ReplayLectureCardProps) => {
  return (
    <div
      className="flex flex-col w-full p-6 gap-4 justify-between bg-grayscale-white border-default rounded-xl hover:shadow-xl duration-500 cursor-pointer break-keep"
      onClick={onClick}
    >
      <div className="flex flex-row gap-3 w-full items-center">
        <img src={ProfileMedium} alt="강의 진행자 프로필" className="w-12 h-12" />
        <div className="flex flex-col w-full gap-1 justify-center items-left semibold-20">
          {title}
          <div className="flex flex-row gap-1 items-center medium-16 text-grayscale-darkgray">
            <UserIcon className="w-4 h-4 fill-grayscale-darkgray" />
            {user}
          </div>
        </div>
      </div>

      <p className="medium-16 text-grayscale-darkgray">{description}</p>
    </div>
  );
};

export default ReplayLectureCard;

/*
<div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row gap-1 items-center semibold-16 text-boarlog-100">
          <CalendarIcon className="w-4 h-4 fill-boarlog-100" />
          {date}
        </div>{" "}
        <div className="flex flex-row gap-1 items-center semibold-16 text-alert-100">
          <PlayIcon className="w-4 h-4 fill-alert-100" />
          {duration}
        </div>
      </div>
*/
