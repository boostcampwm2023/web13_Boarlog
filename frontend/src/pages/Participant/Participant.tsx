import Header from "@/components/Header/Header";

const Participant = () => {
  return (
    <>
      <Header type="participant" />
      <div className="relative w-[100vw] h-[calc(100vh-6rem)]">
        <canvas />
      </div>
    </>
  );
};

export default Participant;
