import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getDailyVisits } from "../../services/visitsAPI";
import Spinner from "../../components/Spinner";

function DailyStats() {
  const { data, isPending } = useQuery({
    queryKey: ["visits"],
    queryFn: getDailyVisits,
  });

  if (isPending || !data) {
    return <Spinner />;
  }

  return (
    <div className="flex h-101 flex-col gap-16 rounded-xl bg-white px-6 pt-14 pb-7">
      <div className="flex items-center justify-between">
        <p className="font-quicksand text-xl font-bold">OBISK CENTRA</p>
        <p className="flex items-center gap-4 uppercase">
          {new Date().toLocaleDateString("sl-SI", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          <span className="font-semibold">
            Skupaj št. obiskov:{" "}
            {data.groupedVisits.reduce(
              (c: number, a: { visitCount: number }) => a.visitCount + c,
              0,
            )}{" "}
          </span>
        </p>
      </div>
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data.groupedVisits}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="timeRange" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, "Obiski"]} />
            <Bar
              barSize={80}
              dataKey="visitCount"
              fill="#ffde00"
              activeBar={<Rectangle fill="#d7a760" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DailyStats;
