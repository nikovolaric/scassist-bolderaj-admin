import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import { useState } from "react";
import { getUserInvoices, openInvoice } from "../../services/invoicesAPI";

function UserInvoices() {
  const { id } = useParams();
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const { data, isPending } = useQuery({
    queryKey: ["invoices", id, year],
    queryFn: () => getUserInvoices(id!, year),
    enabled: !!id,
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Računi</p>
        <select
          className="cursor-pointer font-semibold"
          onChange={(e) => setYear(e.target.value)}
        >
          {Array.from({ length: new Date().getFullYear() - 2024 }).map(
            (_, i: number) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ),
          )}
        </select>
      </div>
      {isPending ? (
        <Spinner />
      ) : (
        <div className="rounded-xl bg-white px-9 py-9.5">
          <Namebar />
          {data.results > 0 && (
            <>
              {data.invoices.map(
                (invoice: {
                  invoiceDate: string;
                  invoiceData: {
                    businessPremises: string;
                    deviceNo: string;
                    year: number;
                    invoiceNo: number;
                  };
                  storno: boolean;
                  _id: string;
                }) => (
                  <UserInvoicesCard key={invoice._id} invoice={invoice} />
                ),
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Namebar() {
  return (
    <div className="bg-primary/50 grid grid-cols-[4fr_3fr_4fr] rounded-xl p-3">
      <p className="font-semibold text-black/50">Številka računa</p>
      <p className="font-semibold text-black/50">Datum in ura izdaje</p>
      <p className="font-semibold text-black/50" />
    </div>
  );
}

function UserInvoicesCard({
  invoice,
}: {
  invoice: {
    invoiceDate: string;
    invoiceData: {
      businessPremises: string;
      deviceNo: string;
      year: number;
      invoiceNo: number;
    };
    storno: boolean;
    _id: string;
  };
}) {
  const { invoiceDate, invoiceData, _id, storno } = invoice;

  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);

  async function handleOpenPreInvoice() {
    try {
      setIsLoadingOpen(true);

      await openInvoice(_id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingOpen(false);
    }
  }

  // async function handleDelete() {
  //   try {
  //     setIsDeleting(true);

  //     await deletePreInvoice(_id);

  //     queryClient.invalidateQueries({ queryKey: ["preInvoices"] });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // }

  return (
    <div className="border-gray grid grid-cols-[4fr_3fr_4fr] rounded-xl border-b p-3">
      <p className="font-medium">
        {`${invoiceData.businessPremises}-${invoiceData.deviceNo}-${invoiceData.invoiceNo}-${invoiceData.year}`}
      </p>
      <p className="text-black/75 capitalize">
        {new Date(invoiceDate).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <div className="flex items-center gap-4">
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-8 py-1 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          onClick={handleOpenPreInvoice}
          disabled={isLoadingOpen}
        >
          {isLoadingOpen ? "..." : "Odpri datoteko"}
        </button>{" "}
        {storno ? (
          <div />
        ) : (
          <button className="border-gray flex cursor-pointer items-center gap-4 rounded-lg border px-8 py-1 font-semibold text-black/50 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:bg-black/5 disabled:cursor-not-allowed disabled:bg-gray-400">
            {/* {isDeleting ? "..." : "Storniraj"} */}
            Storniraj
          </button>
        )}
      </div>
    </div>
  );
}

export default UserInvoices;
