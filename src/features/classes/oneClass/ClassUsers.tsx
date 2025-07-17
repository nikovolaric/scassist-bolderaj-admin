import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import Spinner from "../../../components/Spinner";
import { getOneClass } from "../../../services/classAPI";
import ClassUserList from "../ClassUserList";

function ClassUsers() {
  const { classId } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getOneClass(classId!),
    enabled: !!classId,
  });

  if (isPending) return <Spinner />;

  return (
    <>
      <ClassInfo classData={data.class} />
      <ClassUserList classData={data.class} />
    </>
  );
}

function ClassInfo({
  classData,
}: {
  classData: {
    className: { sl: string };
    dates: string[];
    hours: string[];
    teacher: { fullName: string };
  };
}) {
  const { className, dates, hours, teacher } = classData;
  return (
    <div className="grid grid-cols-4 gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-black/75">
          Dan in ura izvajanja
        </p>
        <div className="drop-shadow-input flex items-center justify-around rounded-lg bg-white py-5 text-black/75">
          <p className="font-semibold uppercase">
            {dates.length > 1
              ? new Date(dates[0]).toLocaleDateString("sl-SI", {
                  weekday: "long",
                })
              : new Date(dates[0]).toLocaleDateString("sl-SI", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
          </p>
          <p>
            {hours[0]}-{hours[1]}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-black/75">Ime skupine</p>
        <div className="drop-shadow-input flex items-center justify-around rounded-lg bg-white py-5 text-black/75">
          <p className="font-semibold">{className.sl}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-black/75">Izvajalec</p>
        <div className="drop-shadow-input flex items-center justify-center rounded-lg bg-white py-5 text-black/75">
          <p className="font-semibold">{teacher.fullName}</p>
        </div>
      </div>
    </div>
  );
}

export default ClassUsers;
