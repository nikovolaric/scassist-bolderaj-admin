import {
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import LinkBtn from "../../components/LinkBtn";
import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeUserRole,
  getOneUser,
  removeUserRole,
} from "../../services/userAPI";
import { getUserUnpaidPreinvoices } from "../../services/preInvoicesAPI";
import { useState, type Dispatch, type SetStateAction } from "react";

function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getOneUser(id!),
    enabled: !!id,
  });
  const { data: preInvoiceData, isPending: isPendingPreInvoice } = useQuery({
    queryKey: ["preInvoices", id],
    queryFn: () => getUserUnpaidPreinvoices(id!),
    enabled: !!id,
  });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-end gap-5">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-black/75">
            Uporabniški profil
          </p>
          {isPending ? (
            <p>...</p>
          ) : (
            <div className="drop-shadow-input flex w-103 items-center justify-between rounded-lg bg-white px-5 py-2.5">
              <p className="text-lg font-semibold">{data.data.fullName}</p>
              <p className="text-black/50">
                {new Date(data.data.birthDate).toLocaleDateString("sl-SI", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium text-black/75">
            Vloga uporabniškega profila
          </p>
          {isPending ? (
            <p>...</p>
          ) : (
            <div className="drop-shadow-input flex w-103 items-center gap-4 rounded-lg bg-white px-5 py-2.5">
              {data.data.role.map((role: string, i: number) => (
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
          )}
        </div>
      </div>
      <div className="relative flex items-center gap-4 self-end">
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300"
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        >
          {isOpen ? (
            <p className="flex items-center gap-2">
              {" "}
              Zapri seznam
              <MinusIcon className="h-4 stroke-3" />
            </p>
          ) : (
            <p className="flex items-center gap-2">
              {" "}
              Dodeli vlogo
              <PlusIcon className="h-4 stroke-3" />
            </p>
          )}
        </button>
        {isOpen && (
          <ChangeRole
            userId={data.data.id}
            roles={data.data.role}
            setIsOpen={setIsOpen}
          />
        )}
        <LinkBtn to={`/dashboard/users/${id}/articles`} type="primary">
          <p className="flex items-center gap-2">
            {" "}
            Prodaja artikla
            <PlusIcon className="h-4 stroke-3" />
          </p>
        </LinkBtn>
        {!isPendingPreInvoice && preInvoiceData.results > 0 && (
          <div className="drop-shadow-input absolute -top-[110%] right-0 flex w-103 items-center gap-5 rounded-lg border border-red-700 bg-white px-5 py-2.5">
            <p className="from-primary to-secondary drop-shdaow-btn flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r">
              i
            </p>
            <p className="font-semibold text-red-700">
              Uporabnik ima neporavnane obveznosti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChangeRole({
  userId,
  roles,
  setIsOpen,
}: {
  userId: string;
  roles: string[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [taxNo, setTaxNo] = useState("");
  const [invoiceNickname, setInvoiceNickname] = useState("");

  const roleList = ["admin", "employee", "coach"];

  async function handleClick() {
    try {
      setIsLoading(true);

      await changeUserRole(userId, newRole, taxNo, invoiceNickname);

      queryClient.invalidateQueries({ queryKey: ["user", userId] });

      setIsOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddRole(role: string) {
    if (newRole) {
      setNewRole("");
    }

    if (!newRole && !roles.includes(role)) {
      setNewRole(role);
    }

    if (roles.includes(role)) {
      await removeUserRole(userId, role);
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    }
  }

  return (
    <div className="outline-gray absolute top-[110%] right-0 z-40 flex w-full flex-col gap-4 rounded-md bg-white px-6 py-3 text-sm font-medium capitalize shadow-xs outline">
      {roleList.map((role: string, i: number) => (
        <div
          key={i}
          className="bg-gray/50 flex flex-col gap-4 rounded-lg px-4 py-2"
        >
          <p className="flex items-center gap-2">
            <span
              className={`h-5 w-5 cursor-pointer rounded-lg outline outline-black ${roles.includes(role) || newRole === role ? "bg-primary" : ""}`}
              onClick={() => handleAddRole(role)}
            ></span>
            {role === "employee"
              ? "zaposleni"
              : role === "admin"
                ? "admin"
                : role === "coach"
                  ? "trener"
                  : "uporabnik"}
          </p>
          <div className="flex flex-col gap-2">
            {(newRole === "employee" || newRole === "admin") &&
              newRole === role && (
                <>
                  <input
                    className="w-full rounded-lg bg-white px-2 py-0.5 outline-none"
                    placeholder="Vnesite ime za izdajo računov"
                    onChange={(e) => setInvoiceNickname(e.target.value)}
                  />
                  <input
                    className="w-full rounded-lg bg-white px-2 py-0.5 outline-none"
                    placeholder="Vnesite davčno številko zaposlenega"
                    onChange={(e) => setTaxNo(e.target.value)}
                  />
                </>
              )}
            {newRole === role && (
              <button
                className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 self-end rounded-lg bg-gradient-to-r px-3 py-1 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-400"
                onClick={handleClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  "..."
                ) : (
                  <>
                    Potrdi in shrani{" "}
                    <ChevronRightIcon className="w-4 stroke-3" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserInfo;
