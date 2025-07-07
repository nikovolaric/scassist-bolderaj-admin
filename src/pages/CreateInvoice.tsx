import Header from "../components/Header";
import CreateInvoiceForm from "../features/invoices/CreateInvoiceForm";

function CreateInvoice() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CreateInvoiceForm />
    </div>
  );
}

export default CreateInvoice;
