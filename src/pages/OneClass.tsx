import Header from "../components/Header";
import ClassUsers from "../features/classes/oneClass/ClassUsers";
import EditClassData from "../features/classes/oneClass/EditClassData";

function OneClass() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <ClassUsers />
      <EditClassData />
    </div>
  );
}

export default OneClass;
