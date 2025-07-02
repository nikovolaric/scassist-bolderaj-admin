import Header from "../components/Header";
import SearchCompanies from "../features/companies/SearchCompanies";

function Companies() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <SearchCompanies />
    </div>
  );
}

export default Companies;
