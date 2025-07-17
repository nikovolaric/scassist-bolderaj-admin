import Header from "../components/Header";
import CreateClassForm from "../features/classes/CreateClassForm";

function CreateClass() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CreateClassForm />
    </div>
  );
}

export default CreateClass;
