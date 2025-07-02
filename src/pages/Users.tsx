import Header from "../components/Header";
import UserList from "../features/users/UserList";

function Users() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <UserList />
    </div>
  );
}

export default Users;
