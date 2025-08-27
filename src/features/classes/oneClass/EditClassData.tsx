import { useParams } from "react-router";
import Spinner from "../../../components/Spinner";
import { getOneClass, removeDateFromClass } from "../../../services/classAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, X } from "lucide-react";
import { useState } from "react";

function EditClassData() {
  const { classId } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getOneClass(classId!),
    enabled: !!classId,
  });

  if (isPending) return <Spinner />;

  if (data.class.dates.length === 1) {
    return <></>;
  }

  return (
    <div>
      <div>
        <p>Datumi</p>
        <div className="grid grid-cols-8 gap-x-5 gap-y-2">
          {data.class.dates.map((date: string) => (
            <DateCard key={date} date={date} dates={data.class.dates} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DateCard({ date, dates }: { date: string; dates: string[] }) {
  const queryClient = useQueryClient();
  const { classId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove(date: string) {
    try {
      setIsLoading(true);
      if (classId)
        await removeDateFromClass({
          id: classId,
          date,
          dates: dates,
        });

      queryClient.invalidateQueries({ queryKey: ["class"] });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 shadow-xs">
      <p>
        {new Date(date).toLocaleDateString("sl-SI", {
          day: "2-digit",
          year: "2-digit",
          month: "2-digit",
        })}
      </p>
      {isLoading ? (
        <RefreshCcw className="animate-spin" />
      ) : (
        <X className="cursor-pointer" onClick={() => handleRemove(date)} />
      )}
    </div>
  );
}

export default EditClassData;
