import Header from "../components/Header";
import SearchInvoices from "../features/invoices/SearchInvoices";

function Invoices() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <SearchInvoices />
    </div>
  );
}

export default Invoices;
