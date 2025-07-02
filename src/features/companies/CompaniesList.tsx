import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllCompanies } from "../../services/companiesAPI";
import Spinner from "../../components/Spinner";
import { Link } from "react-router";

function CompaniesList() {
  const [companyName, setCompanyName] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["companies", companyName],
    queryFn: () => getAllCompanies(companyName),
  });

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-white p-8">
      <div className="drop-shadow-input border-gray/75 flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
        <MagnifyingGlassIcon className="h-4 stroke-3" />
        <input
          placeholder="Išči po podjetjih"
          className="w-full outline-none"
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div>
        <NameBar />
        {isPending ? (
          <Spinner />
        ) : (
          <div>
            {data.companies.map(
              (
                company: {
                  companyName: string;
                  _id: string;
                  unusedTickets: string[];
                  users: unknown[];
                },
                i: number,
              ) => (
                <CompanyListCard key={company._id} company={company} i={i} />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NameBar() {
  return (
    <div className="bg-primary grid grid-cols-3 items-center justify-items-center rounded-xl p-3 font-semibold">
      <p className="justify-self-start text-black/75">Ime podjetja</p>
      <p className="text-black/75">Število preostalih vstopnic</p>
      <p className="text-black/75">Število aktivnih uporabnikov</p>
    </div>
  );
}

function CompanyListCard({
  company,
  i,
}: {
  company: {
    companyName: string;
    _id: string;
    unusedTickets: string[];
    users: unknown[];
  };
  i: number;
}) {
  return (
    <Link
      to={`/dashboard/companies/${company._id}`}
      className={`border-gray/75 grid grid-cols-3 items-center justify-items-center border-b px-3 py-4 ${i % 2 === 0 ? "" : "bg-primary/10"}`}
    >
      <p className="justify-self-start font-medium">{company.companyName}</p>
      <p className="text-black/50">{company.unusedTickets.length}</p>
      <p className="text-black/50">{company.users.length}</p>
    </Link>
  );
}

export default CompaniesList;
