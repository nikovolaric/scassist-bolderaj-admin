import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { getUserActivities, getUserClasses } from "../../services/userAPI";
import Spinner from "../../components/Spinner";
import ClassCard from "./ClassCard";

function Classes({ single }: { single?: boolean }) {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: [`${single ? "userActivities" : "userClasses"}`, id],
    queryFn: single ? () => getUserActivities(id!) : () => getUserClasses(id!),
    enabled: !!id,
  });

  return (
    <div className="flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">
        {single ? "Aktivnosti" : "Vodene vadbe"}
      </p>
      <div className="drop-shadow-input flex h-full flex-col gap-2 rounded-xl bg-white px-5.5 py-4">
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {data.results === 0 ? (
              <p className="font-medium">
                Uporabnik še ni prijavljen na nobeno{" "}
                {single ? "aktivnost" : "vodeno vadbo"}.
              </p>
            ) : (
              <>
                {single
                  ? data.classes
                      .filter(
                        (classData: { dates: string[] }) =>
                          classData.dates.length === 1,
                      )
                      .map(
                        (classData: {
                          className: { sl: string };
                          dates: string[];
                          hours: string[];
                          _id: string;
                        }) => (
                          <ClassCard
                            classData={classData}
                            key={classData._id}
                          />
                        ),
                      )
                  : data.classes
                      .filter(
                        (classData: { dates: string[] }) =>
                          classData.dates.length > 1,
                      )
                      .map(
                        (classData: {
                          className: { sl: string };
                          dates: string[];
                          hours: string[];
                          _id: string;
                        }) => (
                          <ClassCard
                            classData={classData}
                            key={classData._id}
                          />
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

export default Classes;
