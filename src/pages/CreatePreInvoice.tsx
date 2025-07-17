import Header from "../components/Header";
import CreatePreInvoiceForm from "../features/invoices/CreatePreInvoiceForm";

function CreatePreInvoice() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CreatePreInvoiceForm />
    </div>
  );
}

export default CreatePreInvoice;
