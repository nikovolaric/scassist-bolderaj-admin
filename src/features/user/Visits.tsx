import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getUserVisits } from "../../services/visitsAPI";

function Visits() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["userVisits", id],
    queryFn: () => getUserVisits(id!),
    enabled: !!id,
  });

  return (
    <div className="col-span-2 flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">Pretekli obiski</p>
      <div
        className={`drop-shadow-input rounded-xl bg-white px-5.5 py-4 ${data?.results > 0 ? "grid grid-flow-col grid-cols-2 grid-rows-5 gap-x-20 gap-y-9" : ""}`}
      >
        {isPending ? (
          <p>...</p>
        ) : (
          <>
            {data.results === 0 && (
              <p className="font-semibold">
                Uporabnik nima zabeleženih obiskov.
              </p>
            )}
            {data.results > 0 &&
              data.visits.map(
                (visit: {
                  date: string;
                  ticket: { name: { sl: string } };
                  _id: string;
                }) => (
                  <div key={visit._id}>
                    <p className="font-semibold">
                      {new Date(visit.date).toLocaleDateString("sl-SI", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <progress value={1} max={1} />
                    <p className="font-medium">
                      Koriščena vstopnica:{" "}
                      <span className="font-normal">
                        {visit.ticket.name.sl}
                      </span>{" "}
                    </p>
                  </div>
                ),
              )}
          </>
        )}
      </div>
    </div>
  );
}

export default Visits;
