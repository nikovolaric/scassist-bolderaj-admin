import Header from "../components/Header";
import UserList from "../features/company/addUser/UserList";

function AddUserToCompany() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <UserList />
    </div>
  );
}

export default AddUserToCompany;
