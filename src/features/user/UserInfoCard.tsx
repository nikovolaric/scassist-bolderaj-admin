import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getOneUser } from "../../services/userAPI";
import Spinner from "../../components/Spinner";

function UserInfoCard() {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getOneUser(id!),
    enabled: !!id,
  });

  return (
    <div className="flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">Osebni podatki</p>
      <div className="drop-shadow-input flex h-full flex-col gap-8 rounded-xl bg-white px-5.5 py-4">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">Ime</p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.firstName}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">Priimek</p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.lastName}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">Datum rojstva</p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {new Date(data.data.birthDate).toLocaleDateString("sl-SI", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">
                Naslov bivališča
              </p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.address}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">
                Kraj bivališča
              </p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.city}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">
                Poštna številka
              </p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.postalCode}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">Država</p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.country}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">
                Elektronski naslov
              </p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.email}
              </p>
            </div>{" "}
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium text-black/50">
                Telefonska številka
              </p>
              <p className="border-gray/80 rounded-lg border px-3.5 py-2.5 shadow-xs">
                {data.data.phoneNumber}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserInfoCard;
