import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../services/userAPI";
import Spinner from "../../components/Spinner";
import UserListCard from "./UserListCard";
import { useState } from "react";

const roleList = ["user", "employee", "coach", "admin"];

function UserList() {
  const [lastName, setLastName] = useState("");
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["users", page, lastName, roles],
    queryFn: () => getAllUsers({ page, lastName, roles }),
  });

  function handleClick(role: string) {
    if (roles.includes(role)) {
      setRoles(roles.filter((roleEl) => roleEl !== role));
    } else setRoles((roles) => [...roles, role]);
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-8">
      <div className="relative grid grid-cols-[3fr_1fr] gap-x-5">
        <div className="drop-shadow-input border-gray/75 flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <MagnifyingGlassIcon className="h-4 stroke-3" />
          <input
            placeholder="Išči po uporabnikih"
            className="w-full outline-none"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="drop-shadow-input border-gray/75 flex items-center justify-between gap-3 rounded-lg border bg-white px-6 py-2">
          <p>Vloga:</p>
          {roles.length === 0 ? (
            <p className="outline-gray flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-sm font-medium capitalize shadow-xs outline">
              <span className={`h-2 w-2 rounded-full bg-black`}></span>
              Vsi
            </p>
          ) : (
            roles.map((role: string, i: number) => (
              <p
                key={(i + 2) * 1000}
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
            ))
          )}

          <ChevronDownIcon
            className={`w-4 cursor-pointer stroke-2 ${isOpen ? "rotate-180" : ""}`}
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          />
          {isOpen && (
            <div className="outline-gray absolute top-[110%] right-0 flex w-full flex-col gap-4 rounded-md bg-white px-6 py-2 text-sm font-medium capitalize shadow-xs outline">
              {roleList.map((role: string, i: number) => (
                <p key={(i + 1) * 100} className="flex items-center gap-2">
                  <span
                    className={`outline-gray h-5 w-5 cursor-pointer rounded-lg outline ${roles.includes(role) ? "bg-primary" : ""}`}
                    onClick={() => handleClick(role)}
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
          )}
        </div>
      </div>
      <div>
        <NameBar />
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {data.users.map(
              (
                user: {
                  _id: string;
                  fullName: string;
                  birthDate: string;
                  email: string;
                  role: string[];
                },
                i: number,
              ) => (
                <UserListCard key={user._id} user={user} i={i} />
              ),
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        {page === 1 ? (
          <div />
        ) : (
          <button
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-2 font-semibold"
            onClick={() => setPage((page) => page - 1)}
          >
            <ChevronLeftIcon className="h-4 stroke-3" /> Prejšna stran
          </button>
        )}
        {!isPending && data.results === 30 ? (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-2 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
            onClick={() => setPage((page) => page + 1)}
          >
            Naslednja stran <ChevronRightIcon className="h-4 stroke-3" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function NameBar() {
  return (
    <div className="bg-primary grid grid-cols-[3fr_3fr_4fr] items-center justify-items-start rounded-xl p-3 font-semibold">
      <p className="justify-self-start text-black/75">Uporabniški profil</p>
      <p className="justify-self-start text-black/75">Elektronski naslov</p>
      <p className="justify-self-start text-black/75">
        Vloga uporabniškega profila
      </p>
    </div>
  );
}

export default UserList;
