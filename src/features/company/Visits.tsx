import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { createTicketsForCompany } from "../../services/ticketAPI";

function Visits({ visitsLeft, id }: { visitsLeft: number; id: string }) {
  const queryClient = useQueryClient();

  const [isAdding, setIsAdding] = useState(false);
  const [newVisits, setNewVisits] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function valueA() {
    if (visitsLeft > 10) {
      return 10;
    } else {
      return visitsLeft;
    }
  }

  function valueB() {
    if (visitsLeft > 10) {
      return 0;
    } else {
      return 10 - visitsLeft;
    }
  }

  async function handleClick() {
    try {
      setIsLoading(true);

      await createTicketsForCompany(id, newVisits);

      queryClient.invalidateQueries({ queryKey: ["company", id] });
      setIsAdding(false);
      setNewVisits("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-black/75">Stanje vstopnic</p>
      <div className="grid grid-cols-2 rounded-lg bg-white px-5 py-3">
        <PieChart width={184} height={184}>
          <Pie
            dataKey="value"
            data={[
              { name: "A", value: valueA() },
              { name: "B", value: valueB() },
            ]}
            innerRadius={60}
            outerRadius={80}
          >
            <Cell fill="#ffde00" />
            <Cell fill="#cccccc" />
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={30}
            fontWeight="semibold"
          >
            {visitsLeft}
          </text>
        </PieChart>
        <div className="flex flex-col justify-between">
          {!isAdding ? (
            <p>
              Na voljo še:{" "}
              <span className="font-medium">{visitsLeft} vstopnic</span>
            </p>
          ) : (
            <input
              type="number"
              className="rounded-lg border border-black/50 px-2 py-0.5 outline-none"
              placeholder="Vnesite število vstopnic"
              onChange={(e) => setNewVisits(e.target.value)}
            />
          )}
          {!isAdding && (
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 font-semibold transition-colors duration-300"
              onClick={() => setIsAdding(true)}
            >
              <PlusCircleIcon className="h-5 stroke-2" />
              <span>Dodaj vstopnice</span>
            </button>
          )}
          {isAdding && (
            <div className="flex items-center justify-between">
              <button
                className="cursor-pointer rounded-lg px-4 py-2 font-semibold outline outline-black transition-colors duration-300"
                onClick={() => setIsAdding(false)}
              >
                <ChevronLeftIcon className="h-5 stroke-2" />
              </button>
              <button
                className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 font-semibold transition-colors duration-300"
                onClick={handleClick}
              >
                {isLoading ? (
                  "..."
                ) : (
                  <>
                    <PlusCircleIcon className="h-5 stroke-2" />
                    <span>Shrani</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Visits;
