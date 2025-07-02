import { useQuery } from "@tanstack/react-query";
import { getUserTickets } from "../../services/userAPI";
import { useParams } from "react-router";
import Spinner from "../../components/Spinner";
import TicketCard from "./TicketCard";

function Tickets() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["userTickets", id],
    queryFn: () => getUserTickets(id!),
    enabled: !!id,
  });
  return (
    <div className="flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">Vstopnice</p>
      <div className="drop-shadow-input flex h-full flex-col gap-2 rounded-xl bg-white px-5.5 py-4">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {data.results === 0 ? (
              <p className="font-medium">Uporabnik nima veljavnih vstopnic.</p>
            ) : (
              <>
                {data.unusedTickets.map(
                  (ticket: {
                    name: { sl: string };
                    validUntil: string;
                    visits: number;
                    visitsLeft: number;
                    duration: number;
                    _id: string;
                    type: string;
                    used: boolean;
                  }) => (
                    <TicketCard ticket={ticket} key={ticket._id} />
                  ),
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Tickets;
