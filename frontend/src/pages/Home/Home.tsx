import Header from "@/components/Header/Header";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

const Home = () => {
  return (
    <>
      <Header type="login" />
      <Header type="main" />
      <Header type="instructor" />
      <Dialog
        dialogText="강의를 종료하시겠습니까?"
        cancelText="취소"
        confirmText="강의 종료하기"
        cancelButtonClass="bg-grayscale-black text-grayscale-white"
        confirmButtonClass="bg-alert-100 text-grayscale-white"
        cancelClick={() => console.log("취소 버튼 클릭")}
        confirmClick={() => console.log("확인 버튼 클릭")}
      />
      <div>
        <Button type="fit" className="bg-grayscale-black text-grayscale-white">
          내부 요소 기준 맞춤 버튼
        </Button>
        <Button type="full" className="bg-alert-100 text-grayscale-white">
          상위 컴포넌트 요소 맞춤 버튼
        </Button>
        <div className="w-[700px] flex flex-row">
          <Button type="grow" className="bg-grayscale-black text-grayscale-white">
            1
          </Button>
          <Button type="grow" className="bg-boarlog-100 text-grayscale-white">
            2
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
