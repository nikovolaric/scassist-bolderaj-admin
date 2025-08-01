import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  createInvoiceFromPreInvoice,
  deletePreInvoice,
  getUserUnpaidPreinvoices,
  openPreInvoice,
} from "../../services/preInvoicesAPI";
import Spinner from "../../components/Spinner";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { FileCheck2 } from "lucide-react";

function UserPreInvoices() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["preInvoices", id],
    queryFn: () => getUserUnpaidPreinvoices(id!),
    enabled: !!id,
  });

  if (isPending) {
    return <Spinner />;
  }

  if (data.results > 0) {
    return (
      <div>
        <p className="text-sm font-medium">Predračuni</p>
        <div className="rounded-xl bg-white px-9 py-9.5">
          <Namebar />
          {data.preInvoices.map(
            (preInvoice: {
              date: string;
              preInvoiceNumber: number;
              _id: string;
            }) => (
              <UserPreinvoicesCard
                key={preInvoice._id}
                preInvoice={preInvoice}
              />
            ),
          )}
        </div>
      </div>
    );
  }
}

function Namebar() {
  return (
    <div className="bg-primary/50 grid grid-cols-[4fr_3fr_4fr] rounded-xl p-3">
      <p className="font-semibold text-black/50">Številka predračuna</p>
      <p className="font-semibold text-black/50">Datum in ura izdaje</p>
      <p className="font-semibold text-black/50" />
    </div>
  );
}

function UserPreinvoicesCard({
  preInvoice,
}: {
  preInvoice: { date: string; preInvoiceNumber: number; _id: string };
}) {
  const { date, preInvoiceNumber, _id } = preInvoice;
  const queryClient = useQueryClient();

  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpenConvert, setIsOpenConvert] = useState(false);

  async function handleOpenPreInvoice() {
    try {
      setIsLoadingOpen(true);

      await openPreInvoice(_id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOpen(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await deletePreInvoice(_id);

      queryClient.invalidateQueries({ queryKey: ["preInvoices"] });
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleOpenCofirmConver() {
    setIsOpenConvert(true);
  }

  return (
    <div className="border-gray grid grid-cols-[4fr_3fr_4fr] rounded-xl border-b p-3">
      <p className="font-medium">
        {preInvoiceNumber}-{new Date(date).getFullYear()}
      </p>
      <p className="text-black/75 capitalize">
        {new Date(date).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="relative flex items-center gap-4">
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary duraton-150 cursor-pointer rounded-lg bg-gradient-to-r p-2 transition-colors aria-disabled:cursor-not-allowed aria-disabled:from-gray-400 aria-disabled:to-gray-400"
          onClick={handleOpenCofirmConver}
        >
          <FileCheck2 />
        </button>
        {isOpenConvert && (
          <ConfirmConvert
            setIsOpenConvert={setIsOpenConvert}
            invoiceNo={`${preInvoiceNumber}-${new Date(date).getFullYear()}`}
            id={_id}
          />
        )}
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-8 py-1 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleOpenPreInvoice}
          disabled={isLoadingOpen}
        >
          {isLoadingOpen ? "..." : "Odpri datoteko"}
        </button>{" "}
        <button
          className="border-gray flex cursor-pointer items-center gap-4 rounded-lg border px-8 py-1 font-semibold text-black/50 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-black/5 disabled:cursor-not-allowed disabled:bg-gray-400"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "..." : "Izbriši predračun"}
        </button>
      </div>
    </div>
  );
}

function ConfirmConvert({
  id,
  invoiceNo,
  setIsOpenConvert,
}: {
  id: string;
  invoiceNo: string;
  setIsOpenConvert: Dispatch<SetStateAction<boolean>>;
}) {
  const { id: userId } = useParams();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleConvert() {
    try {
      setIsLoading(true);

      const data = await createInvoiceFromPreInvoice({ id });

      if (!(data instanceof Error)) {
        queryClient.invalidateQueries({ queryKey: ["preinvoices", userId] });
        setIsOpenConvert(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral/95 border-gray/80 absolute top-0 right-0 z-[100] flex w-[400px] flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5">
      <p className="font-medium">
        Ali ste prepričani, da želite v račun pretvoriti predračun{" "}
        <span className="font-bold">{invoiceNo}</span>.
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpenConvert(false)}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
        >
          <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
        </button>
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleConvert}
          disabled={isLoading}
        >
          Pretvori v račun <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default UserPreInvoices;
