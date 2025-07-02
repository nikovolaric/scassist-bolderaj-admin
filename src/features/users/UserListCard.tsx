import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

function UserListCard({
  user,
  i,
}: {
  user: {
    fullName: string;
    birthDate: string;
    email: string;
    _id: string;
    role: string[];
  };
  i: number;
}) {
  return (
    <Link
      to={`/dashboard/users/${user._id}`}
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
      <div className="flex items-center gap-2">
        {user.role.map((role: string, i: number) => (
          <p
            key={i}
            className="outline-gray flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-sm font-medium capitalize shadow-xs outline"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                role === "employee"
                  ? "bg-blue-700"
                  : role === "admin"
                    ? "bg-red-700"
                    : role === "coach"
                      ? "bg-green-700"
                      : "bg-primary"
              }`}
            ></span>
            {role === "employee"
              ? "zaposleni"
              : role === "admin"
                ? "admin"
                : role === "coach"
                  ? "trener"
                  : "uporabnik"}
          </p>
        ))}
      </div>
    </Link>
  );
}

export default UserListCard;
