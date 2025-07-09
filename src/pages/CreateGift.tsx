import Header from "../components/Header";
import CreateGiftForm from "../features/gifts/create/CreateGiftForm";

function CreateGift() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CreateGiftForm />
    </div>
  );
}

export default CreateGift;
