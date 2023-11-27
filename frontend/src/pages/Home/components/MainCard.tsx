import NewLectureBack from "./NewLectureBack";
import NewLectureFront from "./NewLectureFront";

const MainCard = () => {
  return (
    <div className="w-11/12 hm:w-[25rem] h-[31rem] relative flipcard-wrapper">
      <div className="w-full h-full relative flipcard">
        <NewLectureFront />
        <NewLectureBack />
      </div>
    </div>
  );
};

export default MainCard;
