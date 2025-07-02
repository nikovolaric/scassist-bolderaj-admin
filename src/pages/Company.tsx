import { useParams } from "react-router";
import Header from "../components/Header";
import { useQuery } from "@tanstack/react-query";
import { getOneCompany } from "../services/companiesAPI";
import Spinner from "../components/Spinner";
import CompanyInfo from "../features/company/CompanyInfo";
import { TrashIcon } from "@heroicons/react/24/outline";

function Company() {
  const { id } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getOneCompany(id!),
    enabled: !!id,
  });

  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      {isPending ? <Spinner /> : <CompanyInfo company={data.data} />}
      <button className="flex cursor-pointer items-center gap-4 self-end rounded-lg bg-white px-8 py-1 font-semibold text-black/50 shadow-xs transition-colors duration-300 hover:bg-black/5">
        <TrashIcon className="h-5 stroke-2" />
        Odstrani profil podjetja
      </button>
    </div>
  );
}

export default Company;
