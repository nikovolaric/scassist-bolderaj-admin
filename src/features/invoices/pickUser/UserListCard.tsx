import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

function UserListCard({
  user,
  i,
}: {
  user: {
    fullName: string;
    birthDate: string;
    email: string;
    _id: string;
  };
  i: number;
}) {
  const navigate = useNavigate();

  function handleClick() {
    localStorage.setItem("buyer", user._id);

    navigate("/dashboard/invoices/create");
  }

  return (
    <div
      className={`border-gray/75 grid grid-cols-[3fr_3fr_4fr] items-center justify-items-start border-b px-3 py-4 ${i % 2 === 0 ? "bg-primary/10" : ""}`}
    >
      <div className="flex items-center gap-3">
        <UserCircleIcon className="w-10 flex-none text-black/50" />
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-black/50">
            {new Date(user.birthDate).toLocaleDateString("sl-SI", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-black/50">{user.email}</p>
      <button
        className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-10 py-2 font-semibold transition-colors duration-300"
        onClick={handleClick}
      >
        Dodaj uporabnika na račun.
      </button>
    </div>
  );
}

export default UserListCard;
