import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import LinkBtn from "../../components/LinkBtn";
import { useQueries } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  getMultipleDateClasses,
  getSingleDateClasses,
} from "../../services/classAPI";
import Spinner from "../../components/Spinner";
import MultipleDateList from "./MultipleDateList";
import SingleDateList from "./SingleDateList";

function SearchClasses() {
  const [selected, setSelected] = useState("vodene");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [className, setClassName] = useState("");

  const [
    { data: singleDate, isLoading: isLoadingSingle },
    { data: multipleDates, isLoading: isLoadingMultiple },
  ] = useQueries({
    queries: [
      {
        queryKey: ["singleDates", ageGroup],
        queryFn: () => getSingleDateClasses(ageGroup),
        enabled: selected === "aktivnosti",
      },
      {
        queryKey: ["multipleDates", ageGroup, className],
        queryFn: () => getMultipleDateClasses(ageGroup, className),
        enabled: selected === "vodene",
      },
    ],
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">Skupine</p>
        <LinkBtn type="primary" to="/dashboard/classes/create">
          <p className="flex items-center gap-4">
            <PlusCircleIcon className="w-5.5 flex-none stroke-2" />
            Ustvari novo skupino
          </p>
        </LinkBtn>
      </div>
      <div className="flex flex-col gap-16">
        <Select
          selected={selected}
          setSelected={setSelected}
          setClassName={setClassName}
        />
        <AgeGroup ageGroup={ageGroup} setAgeGroup={setAgeGroup} />
        {selected === "vodene" && (
          <>
            {isLoadingMultiple ? (
              <Spinner />
            ) : (
              <MultipleDateList classes={multipleDates.classes} />
            )}
          </>
        )}
        {selected === "aktivnosti" && (
          <>
            {isLoadingSingle ? (
              <Spinner />
            ) : (
              <SingleDateList classes={singleDate.classes} />
            )}
          </>
        )}
      </div>
    </>
  );
}

function Select({
  selected,
  setSelected,
  setClassName,
}: {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  setClassName: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_4fr] gap-5">
      <button
        className={`drop-shadow-input h-11 cursor-pointer rounded-lg bg-white px-4 font-semibold ${selected === "vodene" ? "border-secondary border-2 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]" : ""}`}
        onClick={() => setSelected("vodene")}
      >
        Vodene vadbe
      </button>
      <button
        className={`drop-shadow-input h-11 cursor-pointer rounded-lg bg-white px-4 font-semibold ${selected === "aktivnosti" ? "border-secondary border-2 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]" : ""}`}
        onClick={() => setSelected("aktivnosti")}
      >
        Aktivnosti
      </button>
      {selected === "vodene" && (
        <div className="drop-shadow-input flex items-center gap-2 rounded-lg bg-white px-3 py-2">
          <MagnifyingGlassIcon className="h-4 stroke-3" />
          <input
            placeholder="Išči po vodenih vadbah"
            className="w-full outline-none"
            onChange={(e) => setClassName(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function AgeGroup({
  ageGroup,
  setAgeGroup,
}: {
  ageGroup: string;
  setAgeGroup: Dispatch<SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(ageGroup: string) {
    setAgeGroup(ageGroup);

    setIsOpen(false);
  }

  return (
    <div
      className={`drop-shadow-input relative z-20 flex items-center gap-2 self-start bg-white px-5 py-2.5 ${isOpen ? "rounded-t-lg" : "rounded-lg"}`}
    >
      <p className="font-semibod flex items-center gap-4.5 font-semibold text-black/75">
        Starostna skupina:{" "}
        <span className="drop-shadow-input border-secondary cursor-pointer rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]">
          {ageGroup === "adult"
            ? "Odrasli"
            : ageGroup === "student"
              ? "15 - 25 let"
              : ageGroup === "school"
                ? "6 - 14 let"
                : "3 - 5 let"}
        </span>
        <ChevronDownIcon
          className={`h-5 cursor-pointer stroke-3 ${isOpen ? "rotate-180" : ""}`}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        />
      </p>
      {isOpen && (
        <div className="drop-shadow-input absolute top-full left-0 z-20 flex w-full flex-col gap-4 rounded-b-lg bg-white px-5 py-2.5 text-right font-medium">
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("adult")}
          >
            Odrasli
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("student")}
          >
            15 - 25 let
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("school")}
          >
            6 - 14 let
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("preschool")}
          >
            3 - 5 let
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchClasses;
