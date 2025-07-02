import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getUserCompanies } from "../../services/userAPI";
import Spinner from "../../components/Spinner";
import LinkBtn from "../../components/LinkBtn";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

function Companies() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["userCompanies", id],
    queryFn: () => getUserCompanies(id!),
  });

  return (
    <div className="col-span-2 flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">Podjetje</p>
      <div className="drop-shadow-input flex h-full flex-col justify-center gap-5 rounded-xl bg-white px-5.5 py-4">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {data.results === 0 ? (
              <p className="font-semibold">
                Uporabnik ni del nobenega podjetja.
              </p>
            ) : (
              data.companies.map(
                (company: { companyName: string; _id: string }) => (
                  <div
                    key={company._id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-lg font-semibold">
                      {company.companyName}
                    </p>
                    <LinkBtn
                      type="primary"
                      to={`/dashboard/companies/${company._id}`}
                    >
                      <p className="flex items-center gap-4">
                        Prijava obiska na podjetje{" "}
                        <ChevronRightIcon className="h-4 stroke-3" />
                      </p>
                    </LinkBtn>
                  </div>
                ),
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Companies;
