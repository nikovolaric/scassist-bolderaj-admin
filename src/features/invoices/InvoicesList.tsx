import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

function InvoicesList({
  invoices,
  page,
  setPage,
}: {
  invoices: {
    invoiceData: {
      businessPremises: string;
      deviceNo: string;
      invoiceNo: number;
      year: number;
    };
    invoiceDate: string;
    buyer: { fullName: string };
    company: { name: string };
    recepient: { name: string };
    paymentMethod: string;
    totalAmount: number;
    _id: string;
  }[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="rounded-xl bg-white px-12.5 py-12">
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
            buyer: { fullName: string };
            company: { name: string };
            recepient: { name: string };
            paymentMethod: string;
            totalAmount: number;
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
    buyer: { fullName: string };
    recepient: { name: string };
    company: { name: string };
    paymentMethod: string;
    totalAmount: number;
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
  } = invoice;

  return (
    <div
      className={`grid grid-cols-[3fr_4fr_4fr_3fr_3fr_2fr] border-b border-black/20 px-3 py-6 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
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
      <p className="text-black/75">
        {company?.name ? company.name : buyer ? buyer.fullName : recepient.name}
      </p>
      <p className="text-black/75">{paymentMethod}</p>
      <p className="text-black/75">
        {new Intl.NumberFormat("sl-SI", {
          style: "currency",
          currency: "EUR",
        }).format(totalAmount)}
      </p>
    </div>
  );
}

export default InvoicesList;
