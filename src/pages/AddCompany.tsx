import Header from "../components/Header";
import AddCompanyForm from "../features/company/addCompany/AddCompanyForm";

function AddCompany() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <AddCompanyForm />
    </div>
  );
}

export default AddCompany;
