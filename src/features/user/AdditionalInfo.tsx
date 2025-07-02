import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { editUser, getOneUser } from "../../services/userAPI";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";

function AdditionalInfo() {
  const { id } = useParams();

  const { data, isPending } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getOneUser(id!),
    enabled: !!id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(
    function () {
      if (!isPending) {
        setInfo(data.data.additionalInfo ?? "");
      }
    },
    [isPending, data],
  );

  async function handleEditInfo() {
    try {
      setIsLoading(true);

      if (id) {
        await editUser(id, { additionalInfo: info });

        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div>
      <p className="text-sm font-medium">Opombe</p>
      <div className="flex flex-col gap-4 rounded-xl bg-white px-5 py-4">
        <textarea
          className="h-24 w-full outline-none"
          placeholder="Opombe"
          disabled={!isEditing}
          onChange={(e) => setInfo(e.target.value)}
          defaultValue={info}
        />
        {!isEditing && (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-8 py-1 font-semibold transition-colors duration-300"
            onClick={() => setIsEditing(true)}
          >
            Uredi opombe
          </button>
        )}
        {isEditing && (
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-8 py-1 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:bg-gray-400"
            onClick={handleEditInfo}
          >
            {isLoading ? "..." : "Shrani"}
          </button>
        )}
      </div>
    </div>
  );
}

export default AdditionalInfo;
