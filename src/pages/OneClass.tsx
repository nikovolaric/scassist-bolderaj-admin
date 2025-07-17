import Header from "../components/Header";
import ClassUsers from "../features/classes/oneClass/ClassUsers";

function OneClass() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <ClassUsers />
    </div>
  );
}

export default OneClass;
