import { useParams } from "react-router";
import Spinner from "../../../components/Spinner";
import {
  getOneClass,
  removeDateFromClass,
  updateVisibility,
} from "../../../services/classAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCcw, Trash2 } from "lucide-react";
import { useState } from "react";

function EditClassData() {
  const queryClient = useQueryClient();
  const { classId } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getOneClass(classId!),
    enabled: !!classId,
  });

  async function handleUpdateVisibility({
    hiddenReception,
    hiddenUsers,
  }: {
    hiddenReception?: boolean;
    hiddenUsers?: boolean;
  }) {
    if (classId)
      await updateVisibility({ id: classId, hiddenReception, hiddenUsers });

    queryClient.invalidateQueries({ queryKey: ["class"] });
  }

  if (isPending) return <Spinner />;

  if (data.class.dates.length === 1) {
    return <></>;
  }

  return (
    <div className="flex flex-col gap-16">
      <div>
        <p>Datumi</p>
        <div className="grid grid-cols-8 gap-x-5 gap-y-2">
          {data.class.dates.map((date: string) => (
            <DateCard key={date} date={date} dates={data.class.dates} />
          ))}
        </div>
      </div>
      <div>
        <p>Vidnost</p>
        <div className="flex items-center gap-10">
          <div className="flex items-center justify-between rounded-xl bg-white p-8">
            <div className="flex items-center gap-2">
              <p>Vidno v blagajni</p>
              <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${!data.class.hiddenReception ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={() => {
                    handleUpdateVisibility({ hiddenReception: false });
                  }}
                >
                  DA
                </button>
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${data.class.hiddenReception ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={() => {
                    handleUpdateVisibility({ hiddenReception: true });
                  }}
                >
                  NE
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-white p-8">
            <div className="flex items-center gap-2">
              <p>Vidno uporabnikom</p>
              <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${!data.class.hiddenUsers ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={() => {
                    handleUpdateVisibility({ hiddenUsers: false });
                  }}
                >
                  DA
                </button>
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${data.class.hiddenUsers ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={() => {
                    handleUpdateVisibility({ hiddenUsers: true });
                  }}
                >
                  NE
                </button>
              </div>
            </div>
          </div>
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
        <Trash2 className="cursor-pointer" onClick={() => handleRemove(date)} />
      )}
    </div>
  );
}

export default EditClassData;
