import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { getAllUsers } from "../../../../services/userAPI";
import Spinner from "../../../../components/Spinner";
import UserListCard from "./UserListCard";
import { useParams } from "react-router";
import { getOneClass } from "../../../../services/classAPI";

function UserList() {
  const { classId } = useParams();
  const [lastName, setLastName] = useState("");
  const [page, setPage] = useState(1);

  const [
    { data: userData, isPending: userPending },
    { data: classData, isPending: classPending },
  ] = useQueries({
    queries: [
      {
        queryKey: ["users", page, lastName],
        queryFn: () => getAllUsers({ page, lastName }),
      },
      {
        queryKey: ["class", classId],
        queryFn: () => getOneClass(classId!),
        enabled: !!classId,
      },
    ],
  });

  return (
    <div className="flex flex-col gap-10">
      <p className="text-3xl font-semibold">
        Izberi uporabnike: {classPending ? "..." : classData.class.className.sl}
      </p>
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
        </div>
        <div>
          <NameBar />
          {userPending || classPending ? (
            <Spinner />
          ) : (
            <>
              {userData.users.map(
                (
                  user: {
                    _id: string;
                    fullName: string;
                    birthDate: string;
                    email: string;
                  },
                  i: number,
                ) => (
                  <UserListCard
                    key={user._id}
                    user={user}
                    i={i}
                    classUsers={classData.class.students.map(
                      (el: {
                        student: {
                          _id: string;
                        };
                      }) => el.student,
                    )}
                  />
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
          {!userPending && userData.results === 30 ? (
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
    </div>
  );
}

function NameBar() {
  return (
    <div className="bg-primary grid grid-cols-[3fr_3fr_4fr] items-center justify-items-start rounded-xl p-3 font-semibold">
      <p className="justify-self-start text-black/75">Uporabniški profil</p>
      <p className="justify-self-start text-black/75">Elektronski naslov</p>
    </div>
  );
}

export default UserList;
