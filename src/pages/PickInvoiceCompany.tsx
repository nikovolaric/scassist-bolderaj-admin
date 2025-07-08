import Header from "../components/Header";
import CompaniesList from "../features/invoices/pickCompany/CompaniesList";

function PickInvoiceCompany() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CompaniesList />
    </div>
  );
}

export default PickInvoiceCompany;
