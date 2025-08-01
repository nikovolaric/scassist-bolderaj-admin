import { Trash2 } from "lucide-react";
import LinkBtn from "../../components/LinkBtn";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { deleteClass } from "../../services/classAPI";

function ClassListCard({
  classData,
  i,
}: {
  classData: {
    teacher: { fullName: string };
    dates: string[];
    className: { sl: string };
    hours: number[];
    _id: string;
  };
  i: number;
}) {
  const { teacher, dates, className, hours, _id } = classData;

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  async function handleDelete() {
    setIsOpenConfirm(true);
  }

  return (
    <div
      className={`relative grid grid-cols-[2fr_3fr_4fr_3fr_3fr] items-center rounded-lg px-4 py-5 shadow-xs ${i % 2 === 0 ? "bg-white" : "bg-primary/25"}`}
    >
      <p className="text-black/75">
        {dates.length > 1
          ? new Date(dates[0])
              .toLocaleDateString("sl-SI", { weekday: "long" })
              .toUpperCase()
          : new Date(dates[0])
              .toLocaleDateString("sl-SI", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .toUpperCase()}
      </p>
      <p className="text-black/75">{`${hours[0]} - ${hours[1]}`}</p>
      <p className="font-semibold">{className.sl}</p>
      <p className="font-semibold text-black/75">{teacher.fullName}</p>
      <div className="flex items-center gap-4">
        <LinkBtn type="primary" to={`/dashboard/classes/${_id}`}>
          Prikaži skupino
        </LinkBtn>
        <button
          className="bg-primary hover:bg-primary/80 flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
          onClick={handleDelete}
        >
          <Trash2 height={20} />
        </button>
      </div>
      {isOpenConfirm && (
        <ConfirmDelete id={_id} setIsOpenConfirm={setIsOpenConfirm} />
      )}
    </div>
  );
}

function ConfirmDelete({
  id,
  setIsOpenConfirm,
}: {
  id: string;
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    try {
      setIsLoading(true);

      await deleteClass(id);

      queryClient.invalidateQueries({ queryKey: ["singleDates"] });
      queryClient.invalidateQueries({ queryKey: ["multipleDates"] });
      setIsOpenConfirm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral/95 border-gray/80 absolute top-0 right-0 z-50 flex w-[400px] flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5">
      <p className="font-medium">
        Ali ste prepričani, da želite izbrisati izbrano skupino?
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpenConfirm(false)}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
        >
          <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
        </button>
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleDelete}
          disabled={isLoading}
        >
          Izbriši skupino <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default ClassListCard;
