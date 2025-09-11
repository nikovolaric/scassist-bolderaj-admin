import {
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  FileX2,
  FolderDown,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  createInvoiceFromPreInvoice,
  deletePreInvoice,
  openPreInvoice,
} from "../../services/preInvoicesAPI";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function PreInvoicesList({
  preinvoices,
  page,
  setPage,
  notPayed,
  setNotPayed,
}: {
  preinvoices: {
    preInvoiceNumber: string;
    date: string;
    reference: string;
    company: { name: string };
    recepient: { name: string };
    buyer: { fullName: string };
    totalAmount: number;
    payed: boolean;
    _id: string;
  }[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  notPayed: boolean;
  setNotPayed: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col rounded-xl bg-white px-12.5 pt-6 pb-12">
      <div className="mb-6 flex w-100 items-center self-end rounded-lg bg-white px-2 py-1 shadow-xs">
        <button
          className={`w-1/2 flex-none cursor-pointer py-1 text-center ${!notPayed ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
          onClick={() => {
            setNotPayed(false);
          }}
        >
          Vsi
        </button>
        <button
          className={`w-1/2 flex-none cursor-pointer py-1 text-center ${notPayed ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
          onClick={() => {
            setNotPayed(true);
          }}
        >
          Neplačani
        </button>
      </div>
      <Namebar />
      {preinvoices.map(
        (
          preinvoice: {
            preInvoiceNumber: string;
            date: string;
            reference: string;
            company: { name: string };
            recepient: { name: string };
            buyer: { fullName: string };
            totalAmount: number;
            payed: boolean;
            _id: string;
          },
          i: number,
        ) => (
          <PreInvoiceCard key={preinvoice._id} preinvoice={preinvoice} i={i} />
        ),
      )}
      <div className="mt-4 flex items-center justify-between">
        {page !== 1 && (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-3 py-1 font-semibold transition-colors duration-300"
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft height={20} /> Nazaj
          </button>
        )}
        {page === 1 && <div />}
        {preinvoices.length === 30 && (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-3 py-1 font-semibold transition-colors duration-300"
            onClick={() => setPage(page + 1)}
          >
            Naprej <ChevronRight height={20} />{" "}
          </button>
        )}
      </div>
    </div>
  );
}

function Namebar() {
  return (
    <div className="bg-primary grid grid-cols-[3fr_4fr_4fr_3fr_3fr_3fr] rounded-xl p-3">
      <p className="font-semibold text-black/75">Številka predračuna</p>
      <p className="font-semibold text-black/75">Datum in čas izdaje</p>
      <p className="font-semibold text-black/75">Referenca</p>
      <p className="font-semibold text-black/75">Ime in priimek</p>
      <p className="font-semibold text-black/75">Znesek</p>
    </div>
  );
}

function PreInvoiceCard({
  preinvoice,
  i,
}: {
  preinvoice: {
    preInvoiceNumber: string;
    date: string;
    reference: string;
    company: { name: string };
    recepient: { name: string };
    buyer: { fullName: string };
    totalAmount: number;
    payed: boolean;
    _id: string;
  };
  i: number;
}) {
  const {
    preInvoiceNumber,
    date,
    reference,
    company,
    recepient,
    buyer,
    totalAmount,
    payed,
    _id,
  } = preinvoice;

  const queryClient = useQueryClient();

  const [isOpenConvert, setIsOpenConvert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);

  async function handleOpen() {
    try {
      setIsLoadingOpen(true);

      await openPreInvoice(_id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOpen(false);
    }
  }

  async function handleOpenCofirmConver() {
    setIsOpenConvert(true);
  }

  async function handleDeletePreInvoice() {
    await deletePreInvoice(_id);

    queryClient.invalidateQueries({ queryKey: ["preinvoices"] });
  }

  return (
    <div
      className={`grid grid-cols-[3fr_4fr_4fr_3fr_3fr_3fr] items-center border-b border-black/20 px-3 py-6 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
    >
      <p className="font-medium">{`${preInvoiceNumber}-${new Date(date).getFullYear()}`}</p>
      <p className="text-black/75">
        {new Date(date).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-black/75">{reference}</p>
      <p className="text-black/75">
        {company && company.name !== ""
          ? company.name
          : buyer
            ? buyer.fullName
            : recepient.name}
      </p>
      <p className="text-black/75">
        {new Intl.NumberFormat("sl-SI", {
          style: "currency",
          currency: "EUR",
        }).format(totalAmount)}
      </p>
      {isSuccess ? (
        <p className="font-semibold">Račun uspešno pretvorjen.</p>
      ) : (
        <div className="relative grid grid-cols-3 justify-items-center gap-4">
          {payed ? (
            <div />
          ) : (
            <div
              className="from-primary to-secondary drop-shadow-btn hover:to-primary duraton-150 cursor-pointer rounded-lg bg-gradient-to-r p-2 transition-colors aria-disabled:cursor-not-allowed aria-disabled:from-gray-400 aria-disabled:to-gray-400"
              onClick={handleOpenCofirmConver}
            >
              <FileCheck2 />
            </div>
          )}
          {isOpenConvert && (
            <ConfirmConvert
              setIsOpenConvert={setIsOpenConvert}
              setIsSuccess={setIsSuccess}
              invoiceNo={`${preInvoiceNumber}-${new Date(date).getFullYear()}`}
              id={_id}
            />
          )}
          <div
            className="from-primary to-secondary drop-shadow-btn hover:to-primary duraton-150 cursor-pointer rounded-lg bg-gradient-to-r p-2 transition-colors aria-disabled:cursor-not-allowed aria-disabled:from-gray-400 aria-disabled:to-gray-400"
            onClick={handleOpen}
            aria-disabled={isLoadingOpen}
          >
            <FolderDown />
          </div>
          <div
            className="drop-shadow-btn hover:bg-gray/40 duraton-150 bg-gray/80 cursor-pointer rounded-lg p-2 transition-colors"
            onClick={handleDeletePreInvoice}
          >
            <FileX2 />
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmConvert({
  id,
  invoiceNo,
  setIsOpenConvert,
  setIsSuccess,
}: {
  id: string;
  invoiceNo: string;
  setIsOpenConvert: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleConvert() {
    try {
      setIsLoading(true);

      const data = await createInvoiceFromPreInvoice({ id });

      if (!(data instanceof Error)) {
        queryClient.invalidateQueries({ queryKey: ["preinvoices"] });
        setIsSuccess(true);
        setIsOpenConvert(false);

        setTimeout(() => {
          setIsSuccess(false);
        }, 1000);
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

export default PreInvoicesList;
