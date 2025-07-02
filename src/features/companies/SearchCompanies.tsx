import { PlusCircleIcon } from "@heroicons/react/24/outline";
import LinkBtn from "../../components/LinkBtn";
import CompaniesList from "./CompaniesList";

function SearchCompanies() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">Podjetja in klubi</p>
        <LinkBtn type="primary" to="/dashboard/companies/add">
          <p className="flex items-center gap-2">
            <PlusCircleIcon className="h-5 stroke-2" />
            Ustvari podjetje
          </p>
        </LinkBtn>
      </div>
      <CompaniesList />
    </div>
  );
}

export default SearchCompanies;
