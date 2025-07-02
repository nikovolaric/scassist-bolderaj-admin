import { useQuery } from "@tanstack/react-query";
import {
  exportCompanyVisits,
  getCompanyVisits,
} from "../../services/visitsAPI";
import { useParams } from "react-router";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";

function CompanyVisits() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["companyVisits", id],
    queryFn: () => getCompanyVisits(id!, 10),
    enabled: !!id,
  });

  async function handleClick() {
    if (id) await exportCompanyVisits(id);
  }

  return (
    <div className="col-span-2 flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">
        Seznam koriščenih obiskov
      </p>
      {isPending ? (
        <p>...</p>
      ) : (
        <div
          className={`drop-shadow-input flex items-start justify-between rounded-xl bg-white px-8 py-10`}
        >
          {data.results > 0 ? (
            <>
              <VisitsList visits={data.data} />
              <button
                className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-4 rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300"
                onClick={handleClick}
              >
                <ArrowDownCircleIcon className="h-5 stroke-2" />
                Izvozi
              </button>
            </>
          ) : (
            <p className="font-medium">
              Podjetje trenutno nima koriščenih vstopnic.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function VisitsList({
  visits,
}: {
  visits: {
    date: string;
    ticket: { name: { sl: string } };
    user: { fullName: string; birthDate: string };
    _id: string;
  }[];
}) {
  return (
    <div className="flex w-3/4 flex-none flex-col">
      <div className="bg-primary/50 grid grid-cols-3 rounded-xl px-8 py-2">
        <p className="font-medium text-black/75">Datum in ura obiska</p>
        <p className="font-medium text-black/75">Uporabnik</p>
      </div>
      {visits.map(
        (
          visit: {
            date: string;
            user: { fullName: string; birthDate: string };
            _id: string;
          },
          i: number,
        ) => (
          <div
            key={visit._id}
            className={`grid grid-cols-3 items-center px-8 py-4 ${i % 2 === 0 ? "bg-primary/10" : ""}`}
          >
            <p>
              {new Date(visit.date).toLocaleDateString("sl-SI", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div>
              <p className="font-medium">{visit.user.fullName}</p>
              <p>
                {new Date(visit.user.birthDate).toLocaleDateString("sl-SI", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        ),
      )}
    </div>
  );
}

export default CompanyVisits;
