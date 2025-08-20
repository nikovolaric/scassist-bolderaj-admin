import Header from "../components/Header";
import UserList from "../features/classes/oneClass/addUser/UserList";

function AddUserToClass() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <UserList />
    </div>
  );
}

export default AddUserToClass;
