import {
  ChevronLeft,
  ChevronRight,
  FileX2,
  FolderDown,
  SaveIcon,
} from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  checkConnection,
  checkNotConfirmed,
  openInvoice,
  stornoInvoice,
  updateInvoice,
} from "../../services/invoicesAPI";
import { Link } from "react-router";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useQueries, useQueryClient } from "@tanstack/react-query";

function InvoicesList({
  invoices,
  page,
  setPage,
  totalFilterSum,
}: {
  invoices: {
    invoiceData: {
      businessPremises: string;
      deviceNo: string;
      invoiceNo: number;
      year: number;
    };
    invoiceDate: string;
    buyer: { fullName: string; _id: string };
    company: { name: string };
    recepient: { name: string };
    paymentMethod: string;
    totalAmount: number;
    storno: boolean;
    _id: string;
  }[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalFilterSum?: number;
}) {
  const [{ data, isPending }] = useQueries({
    queries: [
      { queryKey: ["furs"], queryFn: checkConnection },
      // { queryKey: ["notconfirmed"], queryFn: checkNotConfirmed },
    ],
  });

  return (
    <div>
      <div className="flex justify-between">
        {!isPending && data.data.EchoResponse !== "furs" && (
          <p className="font-medium text-red-600">
            Povezava s FURS ni vzpostavljena
          </p>
        )}
      </div>
      <div className="rounded-xl bg-white px-12.5 py-12">
        <div className="flex items-center justify-between">
          <div>
            {totalFilterSum ? (
              <p>
                Skupni znesek filtra:{" "}
                <span className="font-bold">
                  {new Intl.NumberFormat("sl-SI", {
                    style: "currency",
                    currency: "EUR",
                  }).format(totalFilterSum)}
                </span>
              </p>
            ) : (
              ""
            )}
          </div>
          <p className="mb-2 text-right">
            Skupni znesek na strani:{" "}
            <span className="font-bold">
              {new Intl.NumberFormat("sl-SI", {
                style: "currency",
                currency: "EUR",
              }).format(
                invoices.reduce(
                  (c: number, a: { totalAmount: number }) => c + a.totalAmount,
                  0,
                ),
              )}
            </span>
          </p>
        </div>
        <Namebar />
        {invoices.map(
          (
            invoice: {
              invoiceData: {
                businessPremises: string;
                deviceNo: string;
                invoiceNo: number;
                year: number;
              };
              invoiceDate: string;
              buyer: { fullName: string; _id: string };
              company: { name: string };
              recepient: { name: string };
              paymentMethod: string;
              totalAmount: number;
              storno: boolean;
              _id: string;
            },
            i: number,
          ) => (
            <InvoiceCard key={invoice._id} invoice={invoice} i={i} />
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
          {invoices.length === 30 && (
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-3 py-1 font-semibold transition-colors duration-300"
              onClick={() => setPage(page + 1)}
            >
              Naprej <ChevronRight height={20} />{" "}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Namebar() {
  return (
    <div className="bg-primary grid grid-cols-[3fr_4fr_4fr_3fr_3fr_2fr] rounded-xl p-3">
      <p className="font-semibold text-black/75">Številka računa</p>
      <p className="font-semibold text-black/75">Datum in čas izdaje</p>
      <p className="font-semibold text-black/75">Ime in priimek</p>
      <p className="font-semibold text-black/75">Način plačila</p>
      <p className="font-semibold text-black/75">Znesek</p>
    </div>
  );
}

function InvoiceCard({
  invoice,
  i,
}: {
  invoice: {
    invoiceData: {
      businessPremises: string;
      deviceNo: string;
      invoiceNo: number;
      year: number;
    };
    invoiceDate: string;
    buyer: { fullName: string; _id: string };
    recepient: { name: string };
    company: { name: string };
    paymentMethod: string;
    totalAmount: number;
    storno: boolean;
    _id: string;
  };
  i: number;
}) {
  const {
    invoiceData,
    invoiceDate,
    buyer,
    company,
    recepient,
    paymentMethod,
    totalAmount,
    storno,
    _id,
  } = invoice;

  const queryClient = useQueryClient();

  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const [isOpenConfirmStorno, setIsOpenConfirmSotrno] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [editPayment, setEditPayment] = useState(false);

  async function handleOpen() {
    try {
      setIsLoadingOpen(true);

      await openInvoice(_id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOpen(false);
    }
  }

  function handleStorno() {
    setIsOpenConfirmSotrno(true);
  }

  async function changePayment(formData: FormData) {
    try {
      const paymentMethod = formData.get("paymentMethod");

      await updateInvoice(_id, { paymentMethod });

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setEditPayment(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className={`relative grid grid-cols-[3fr_4fr_4fr_3fr_3fr_2fr] items-center border-b border-black/20 px-3 py-6 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
    >
      <p className="font-medium">{`${invoiceData.businessPremises}-${invoiceData.deviceNo}-${invoiceData.invoiceNo}-${invoiceData.year}`}</p>
      <p className="text-black/75">
        {new Date(invoiceDate).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <Link
        to={`/dashboard${buyer ? `/users/${buyer._id}` : ""}`}
        className="text-black/75"
      >
        {company?.name
          ? company.name
          : buyer
            ? buyer.fullName
            : recepient
              ? recepient.name
              : ""}
      </Link>
      {editPayment ? (
        <form className="flex items-center gap-2" action={changePayment}>
          <select
            className="w-3/4 cursor-pointer rounded-lg border border-gray-300 px-2 py-1 shadow-xs"
            name="paymentMethod"
            defaultValue={paymentMethod}
          >
            <option value="">Izberi način plačila</option>
            <option value="gotovina">Gotovina</option>
            <option value="card">Kartica</option>
            <option value="online">Spletno plačilo</option>
            <option value="paypal">Paypal</option>
            <option value="nakazilo">Nakazilo</option>
          </select>
          <button>
            <SaveIcon height={16} className="cursor-pointer text-black/50" />
          </button>
        </form>
      ) : (
        <p className="flex items-center gap-2 text-black/75">
          {paymentMethod}{" "}
          <PencilIcon
            className="h-4 cursor-pointer text-black/50"
            onClick={() => setEditPayment(true)}
          />
        </p>
      )}
      <p className="text-black/75">
        {new Intl.NumberFormat("sl-SI", {
          style: "currency",
          currency: "EUR",
        }).format(totalAmount)}
      </p>
      {isSuccess ? (
        <p className="font-semibold">Račun uspešno storniran.</p>
      ) : (
        <div className="flex items-center gap-4">
          <div
            className="from-primary to-secondary drop-shadow-btn hover:to-primary duraton-150 cursor-pointer rounded-lg bg-gradient-to-r p-2 transition-colors aria-disabled:cursor-not-allowed aria-disabled:from-gray-400 aria-disabled:to-gray-400"
            onClick={handleOpen}
            aria-disabled={isLoadingOpen}
          >
            <FolderDown />
          </div>
          {storno || totalAmount < 0 ? (
            <div />
          ) : (
            <div
              className="drop-shadow-btn hover:bg-gray/40 duraton-150 bg-gray/80 cursor-pointer rounded-lg p-2 transition-colors"
              onClick={handleStorno}
            >
              <FileX2 />
            </div>
          )}
        </div>
      )}
      {isOpenConfirmStorno && (
        <ConfirmStorno
          id={_id}
          invoiceNo={`${invoiceData.businessPremises}-${invoiceData.deviceNo}-${invoiceData.invoiceNo}-${invoiceData.year}`}
          setIsOpenStorno={setIsOpenConfirmSotrno}
          setIsSuccess={setIsSuccess}
        />
      )}
    </div>
  );
}

function ConfirmStorno({
  id,
  invoiceNo,
  setIsOpenStorno,
  setIsSuccess,
}: {
  id: string;
  invoiceNo: string;
  setIsOpenStorno: Dispatch<SetStateAction<boolean>>;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function handleStorno() {
    try {
      setIsLoading(true);

      const data = await stornoInvoice(id);

      if (!(data instanceof Error)) {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        setIsSuccess(true);
        setIsOpenStorno(false);

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
    <div className="bg-neutral/95 border-gray/80 absolute top-0 right-0 z-50 flex w-[400px] flex-col gap-15 rounded-xl border px-6 pt-16 pb-5.5">
      <p className="font-medium">
        Ali ste prepričani, da želite strornirati račun <br />{" "}
        <span className="font-bold">{invoiceNo}</span>
      </p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpenStorno(false)}
          className="flex cursor-pointer items-center gap-4 rounded-xl border border-black px-4 py-3 font-semibold"
        >
          <ChevronLeftIcon className="h-4 stroke-3" /> Prekliči
        </button>
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleStorno}
          disabled={isLoading}
        >
          Storniraj račun <ChevronRightIcon className="h-4 stroke-3" />
        </button>
      </div>
    </div>
  );
}

export default InvoicesList;
