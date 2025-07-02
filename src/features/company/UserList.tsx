import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { useState, type Dispatch, type SetStateAction } from "react";
import { companyTicketsUse, removeUser } from "../../services/companiesAPI";
import { useLocation, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import LinkBtn from "../../components/LinkBtn";

function UserList({
  users,
}: {
  users: { fullName: string; birthDate: string; _id: string; email: string }[];
}) {
  const { pathname } = useLocation();

  const [lastName, setLastName] = useState("");
  const [isMultiple, setIsMultiple] = useState(false);
  const [visitors, setVisitors] = useState<string[]>([]);
  const [confirm, setConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  return (
    <div>
      <p className="text-sm font-medium text-black/75">
        Seznam aktivnih uporabnikov
      </p>{" "}
      <div className="flex flex-col gap-5 rounded-xl bg-white p-8">
        <div className="flex items-center justify-between gap-5">
          <LinkBtn type="primary" to={`${pathname}/add`}>
            <p className="flex items-center gap-4">
              <PlusCircleIcon className="h-5 stroke-2" />
              <span>Dodaj uporabnika</span>
            </p>
          </LinkBtn>{" "}
          <button
            className="bg-neutral drop-shadow-btn hover:bg-neutral/80 flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 font-semibold transition-colors duration-300"
            onClick={() => setIsRemoving((isRemoving) => !isRemoving)}
          >
            <MinusCircleIcon className="h-5 stroke-2" />
            <span>{isRemoving ? "Prekliči" : "Odstrani uporabnika"}</span>
          </button>
          <div className="drop-shadow-input border-gray/75 flex grow items-center gap-2 rounded-lg border bg-white px-3 py-2">
            <MagnifyingGlassIcon className="h-4 stroke-3" />
            <input
              placeholder="Išči po uporabnikih"
              className="w-full outline-none"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          {users
            .filter((user) =>
              user.fullName.toLowerCase().includes(lastName.toLowerCase()),
            )
            .map((user, i) => (
              <UserListCard
                key={user._id}
                user={user}
                i={i}
                isMultiple={isMultiple}
                visitors={visitors}
                setVisitors={setVisitors}
                isRemoving={isRemoving}
              />
            ))}
        </div>
      </div>
      <div className="relative">
        {isMultiple ? (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary mt-8 cursor-pointer rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300"
            onClick={() => setConfirm(true)}
          >
            Prijavi obisk več uporabnikov
          </button>
        ) : (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary mt-8 cursor-pointer rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300"
            onClick={() => setIsMultiple(true)}
          >
            Označi več uporabnikov
          </button>
        )}
        {confirm && (
          <ConfirmUseTicket setIsOpenConfirm={setConfirm} usersId={visitors} />
        )}
      </div>
    </div>
  );
}

function UserListCard({
  user,
  isMultiple,
  i,
  visitors,
  setVisitors,
  isRemoving,
}: {
  user: { fullName: string; birthDate: string; email: string; _id: string };
  isMultiple: boolean;
  i: number;
  visitors: string[];
  setVisitors: Dispatch<SetStateAction<string[]>>;
  isRemoving: boolean;
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleChange() {
    if (visitors.includes(user._id)) {
      setVisitors(visitors.filter((id) => id !== user._id));
    } else {
      setVisitors([...visitors, user._id]);
    }
  }

  async function handleClick() {
    try {
      setIsDeleting(true);

      if (id) {
        await removeUser(id, user._id);

        queryClient.invalidateQueries({ queryKey: ["company", id] });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={`border-gray/75 relative grid grid-cols-3 items-center justify-items-center border-b px-3 py-4 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
    >
      <div className="flex items-center gap-3 justify-self-start">
        {isMultiple && (
          <label className="cursor-pointer">
            <input
              type="checkbox"
              className="peer hidden"
              checked={visitors.includes(user._id)}
              onChange={handleChange}
            />
            <div className="border-gray flex h-6 w-6 items-center justify-center rounded-lg border bg-white transition-all duration-75">
              <span
                className={`${visitors.includes(user._id) ? "bg-primary border-gray border" : ""} h-4 w-4 rounded-full`}
              />
            </div>
          </label>
        )}
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-black/75">
            {new Date(user.birthDate).toLocaleDateString("sl-SI", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <p className="text-black/50">{user.email}</p>
      {!isMultiple && !isSuccess && !isRemoving && (
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300"
          onClick={() => setIsOpenConfirm(true)}
        >
          Prijavi obisk na podjetje
        </button>
      )}
      {isRemoving && (
        <button
          className="bg-neutral drop-shadow-btn hover:bg-neutral/80 cursor-pointer rounded-lg px-4 py-3 font-semibold transition-colors duration-300"
          onClick={handleClick}
        >
          {isDeleting ? "..." : "Odstrani uporabnika iz podjetja"}
        </button>
      )}
      {isSuccess && <p className="font-semibold">Obisk je bil prijavljen.</p>}
      {isOpenConfirm && (
        <ConfirmUseTicket
          setIsOpenConfirm={setIsOpenConfirm}
          usersId={[user._id]}
          setIsSuccess={setIsSuccess}
        />
      )}
    </div>
  );
}

function ConfirmUseTicket({
  setIsOpenConfirm,
  setIsSuccess,
  usersId,
}: {
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
  setIsSuccess?: Dispatch<SetStateAction<boolean>>;
  usersId: string[];
}) {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  async function handleUseTicket() {
    try {
      setIsLoading(true);

      await companyTicketsUse(id!, usersId);

      if (setIsSuccess) setIsSuccess(true);

      setIsOpenConfirm(false);
      queryClient.invalidateQueries({ queryKey: ["company", id] });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`bg-neutral/95 border-gray/80 absolute top-0 z-50 flex w-93 flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5 ${setIsSuccess ? "right-0" : "left-0"}`}
    >
      <p className="font-medium">
        Ali ste prepričani, da želite prijaviti obisk?
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpenConfirm(false)}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
        >
          <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
        </button>
        <button
          onClick={handleUseTicket}
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          disabled={isLoading}
        >
          Prijavi <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default UserList;
