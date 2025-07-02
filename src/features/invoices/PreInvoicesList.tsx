import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

function PreInvoicesList({
  preinvoices,
  page,
  setPage,
}: {
  preinvoices: {
    preInvoiceNumber: string;
    date: string;
    reference: string;
    company: { name: string };
    recepient: { name: string };
    totalAmount: number;
    _id: string;
  }[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="rounded-xl bg-white px-12.5 py-12">
      <Namebar />
      {preinvoices.map(
        (
          preinvoice: {
            preInvoiceNumber: string;
            date: string;
            reference: string;
            company: { name: string };
            recepient: { name: string };
            totalAmount: number;
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
    <div className="bg-primary grid grid-cols-[3fr_4fr_4fr_3fr_3fr_2fr] rounded-xl p-3">
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
    totalAmount: number;
    _id: string;
  };
  i: number;
}) {
  const { preInvoiceNumber, date, reference, company, recepient, totalAmount } =
    preinvoice;

  return (
    <div
      className={`grid grid-cols-[3fr_4fr_4fr_3fr_3fr_2fr] border-b border-black/20 px-3 py-6 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
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
        {company && company.name !== "" ? company.name : recepient.name}
      </p>
      <p className="text-black/75">
        {new Intl.NumberFormat("sl-SI", {
          style: "currency",
          currency: "EUR",
        }).format(totalAmount)}
      </p>
    </div>
  );
}

export default PreInvoicesList;
