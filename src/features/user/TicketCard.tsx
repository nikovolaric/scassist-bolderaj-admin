import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useParams } from "react-router";
import {
  deleteTicket,
  updateTicket,
  validateTicket,
} from "../../services/ticketAPI";

function TicketCard({
  ticket,
}: {
  ticket: {
    name: { sl: string };
    validUntil: string;
    visits: number;
    visitsLeft: number;
    duration: number;
    _id: string;
    type: string;
    used: boolean;
  };
}) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditVisits, setIsEditVisits] = useState(false);
  const [isEditValid, setIsEditValid] = useState(false);
  const [newVisits, setNewVisits] = useState("");
  const [newValidUntil, setNewValidUntil] = useState("");

  const { name, validUntil, visits, visitsLeft, duration, type, used, _id } =
    ticket;

  const startDate = new Date();
  const endDate = new Date(validUntil);

  const diffInMs = endDate.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  useEffect(
    function () {
      if (isSuccess) {
        setTimeout(function () {
          setIsSuccess(false);
          queryClient.invalidateQueries({ queryKey: ["userTickets", id] });
          queryClient.invalidateQueries({ queryKey: ["userVisits", id] });
        }, 2000);
      }
    },
    [isSuccess, id, queryClient],
  );

  async function handleEdit() {
    const data: { visitsLeft?: string; validUntil?: string } = {};

    if (newVisits) {
      data.visitsLeft = newVisits;
    }

    if (newValidUntil) {
      data.validUntil = newValidUntil;
    }

    await updateTicket(_id, data);

    setNewVisits("");
    setNewValidUntil("");
    setIsEditVisits(false);
    setIsEditValid(false);
    queryClient.invalidateQueries({ queryKey: ["userTickets"] });
  }

  async function handleDelete() {
    await deleteTicket(_id);
    queryClient.invalidateQueries({ queryKey: ["userTickets"] });
  }

  return (
    <div
      className="border-gray/80 bg-neutral relative flex cursor-pointer flex-col rounded-xl border p-4"
      onClick={() => {
        setIsOpen((isOpen) => !isOpen);
        setIsEditVisits(false);
        setIsEditValid(false);
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">{name.sl}</p>
        {isSuccess ? (
          <p className="itmes-center flex gap-4 font-semibold">
            <span className="from-primary to-secondary drop-shadow-btn flex items-center gap-4 rounded-lg bg-gradient-to-r p-1">
              <CheckIcon className="h-4 stroke-3" />
            </span>{" "}
            Zabeleženo.
          </p>
        ) : (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-1 font-semibold transition-colors duration-300"
            onClick={() => setIsOpenConfirm(true)}
          >
            Prijava <ChevronRightIcon className="h-4 stroke-3" />
          </button>
        )}
      </div>
      {isOpen && (
        <>
          <div className="mt-6 mb-2 flex flex-col">
            <progress
              max={visits ?? duration ?? 1}
              value={
                visitsLeft
                  ? visits - visitsLeft
                  : type === "dnevna" || !used
                    ? 0
                    : duration - diffInDays
              }
            />
            <p className="relative self-end text-sm">
              {type === "dnevna" ? (
                "Preostane še 1 vstopnica"
              ) : type === "paket" ? (
                <span className="flex items-center gap-2">
                  {`${visitsLeft === 1 ? "Preostane" : visitsLeft === 2 ? "Preostaneta" : "Preostane"} še ${visitsLeft} ${visitsLeft === 1 ? "vstopnica" : visitsLeft === 2 ? "vstopnici" : "vstopnic"}.`}{" "}
                  <PencilIcon
                    className="h-3 stroke-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditVisits(true);
                    }}
                  />
                  {isEditVisits && (
                    <span
                      className="absolute flex items-center gap-2 rounded-xl bg-white p-4 shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="number"
                        className="w-10 outline-none"
                        onChange={(e) => setNewVisits(e.target.value)}
                        defaultValue={visitsLeft}
                      />
                      <button
                        className="bg-gray cursor-pointer rounded-lg px-2 font-semibold shadow-xs"
                        onClick={handleEdit}
                      >
                        Shrani
                      </button>
                    </span>
                  )}
                </span>
              ) : used ? (
                `Preostane še ${diffInDays} ${diffInDays === 1 ? "dan" : "dni"}.`
              ) : (
                "Vstopnica še ni aktivirana."
              )}
            </p>
          </div>
          <p className="border-gray/80 relative flex items-center gap-2 self-start rounded-lg border bg-white px-2 py-0.5 text-sm font-medium text-black/75 shadow-xs">
            Velja do{" "}
            {new Date(validUntil).toLocaleDateString("sl-SI", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            <PencilIcon
              className="h-3 stroke-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditValid(true);
              }}
            />
            {isEditValid && (
              <span
                className="absolute flex items-center gap-2 rounded-xl bg-white p-4 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="date"
                  className="w-fit outline-none"
                  onChange={(e) => setNewValidUntil(e.target.value)}
                  defaultValue={new Date(validUntil).toLocaleDateString(
                    "sv-SE",
                    { day: "2-digit", month: "2-digit", year: "numeric" },
                  )}
                />
                <button
                  className="bg-gray cursor-pointer rounded-lg px-2 font-semibold shadow-xs"
                  onClick={handleEdit}
                >
                  Shrani
                </button>
              </span>
            )}
          </p>
          <TrashIcon
            className="h-6 self-end stroke-3"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />
        </>
      )}
      {isOpenConfirm && (
        <ConfirmUseTicket
          name={name.sl}
          setIsOpenConfirm={setIsOpenConfirm}
          setIsSuccess={setIsSuccess}
          id={_id}
        />
      )}
    </div>
  );
}

function ConfirmUseTicket({
  name,
  setIsOpenConfirm,
  setIsSuccess,
  id,
}: {
  name: string;
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  id: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUseTicket() {
    try {
      setIsLoading(true);

      await validateTicket(id);

      setIsSuccess(true);
      setIsOpenConfirm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral/95 border-gray/80 absolute top-0 left-0 z-50 flex w-full flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5">
      <p className="font-medium">
        Ali ste prepričani, da želite prijaviti obisk na <br />{" "}
        <span className="font-bold">{name}</span>
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
          Prijava obiska <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
