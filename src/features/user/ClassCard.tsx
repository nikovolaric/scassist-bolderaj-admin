import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import {
  createInvoiceFromPreInvoice,
  openPreInvoice,
} from "../../services/preInvoicesAPI";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

function ClassCard({
  classData,
}: {
  classData: {
    className: { sl: string };
    dates: string[];
    hours: string[];
    _id: string;
  };
}) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { className, dates, hours, _id } = classData;
  const data = queryClient.getQueryData<{
    preInvoices: { classes: string[]; _id: string }[];
  }>(["preInvoices", id]);

  async function handleClick() {
    try {
      setIsLoading(true);

      if (data) {
        const preInvoice = data.preInvoices.filter(
          (preInvoice) => preInvoice.classes[0] === _id,
        )[0];

        await openPreInvoice(preInvoice._id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-gray/80 bg-neutral relative flex flex-col rounded-xl border p-4">
      <p className="text-lg font-semibold">{className.sl}</p>
      <p className="text-lg text-black/50 capitalize">
        {new Date(dates[0]).toLocaleDateString("sl-SI", { weekday: "long" })},{" "}
        {`${hours[0]}-${hours[1]}`}
      </p>
      {data &&
      data.preInvoices.filter((preInvoice) => preInvoice.classes[0] === _id)
        .length > 0 ? (
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 self-end rounded-lg bg-gradient-to-r px-4 py-1 font-semibold transition-colors duration-300"
          onClick={() => setIsOpenConfirm(true)}
        >
          Poravnaj
        </button>
      ) : (
        <Link
          to={`/dashboard/classes/${_id}`}
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 self-end rounded-lg bg-gradient-to-r px-4 py-1 font-semibold transition-colors duration-300"
        >
          Prisotnost <ChevronRightIcon className="h-4 stroke-3" />
        </Link>
      )}
      {data &&
        data.preInvoices.filter((preInvoice) => preInvoice.classes[0] === _id)
          .length > 0 && (
          <p
            className="mt-4 cursor-pointer self-end font-semibold text-red-700"
            onClick={handleClick}
          >
            {isLoading ? "..." : "Uporabnik ima neporavnane obveznosti."}
          </p>
        )}
      {isOpenConfirm && (
        <ConfirmUseTicket
          id={
            data?.preInvoices.filter(
              (preInvoice) => preInvoice.classes[0] === _id,
            )[0]._id
          }
          setIsOpenConfirm={setIsOpenConfirm}
        />
      )}
    </div>
  );
}

function ConfirmUseTicket({
  setIsOpenConfirm,
  id,
}: {
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
  id?: string;
}) {
  const queryClient = useQueryClient();
  const { id: userId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (id) {
        await createInvoiceFromPreInvoice({ id });
      }

      queryClient.invalidateQueries({ queryKey: ["preInvoices", userId] });
      setIsOpenConfirm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setChecked(e.target.value);
  }

  return (
    <div className="bg-neutral/95 border-gray/80 absolute top-0 left-0 z-50 flex w-full flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5">
      <p className="font-medium">Predračun želim poravnati:</p>
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex items-center justify-around">
          <label className="flex cursor-pointer items-center gap-4">
            <input
              type="checkbox"
              className="peer hidden"
              checked={checked === "card"}
              value="card"
              onChange={handleChange}
            />
            <div className="border-gray flex h-6 w-6 items-center justify-center rounded-lg border transition-all duration-75">
              <span
                className={`${checked === "card" ? "bg-primary border-gray border" : ""} h-4 w-4 rounded-full`}
              />
            </div>
            <p className="font-medium">s kartico</p>
          </label>{" "}
          <label className="flex cursor-pointer items-center gap-4">
            <input
              type="checkbox"
              className="peer hidden"
              checked={checked === "gotovina"}
              value="gotovina"
              onChange={handleChange}
            />
            <div className="border-gray flex h-6 w-6 items-center justify-center rounded-lg border transition-all duration-75">
              <span
                className={`${checked === "gotovina" ? "bg-primary border-gray border" : ""} h-4 w-4 rounded-full`}
              />
            </div>
            <p className="font-medium">z gotovino</p>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpenConfirm(false);
            }}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
          >
            <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
          </button>
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
            disabled={isLoading}
          >
            Poravnaj znesek <ChevronRightIcon className="h-4 stroke-3" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClassCard;
