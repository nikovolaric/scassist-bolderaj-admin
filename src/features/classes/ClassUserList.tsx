import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState, type Dispatch, type SetStateAction } from "react";
import ClassUserListCard from "./ClassUserListCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearStudentData, getStudents } from "./slices/checkAttendanceSlice";
import { checkAttendance } from "../../services/classAPI";
import { useParams } from "react-router";

function ClassUserList({
  classData,
}: {
  classData: {
    students: {
      student: {
        fullName: string;
        birthDate: string;
        _id: string;
        lastName: string;
      };
      attendance: string[];
      _id: string;
    }[];
    dates: string[];
  };
}) {
  const { classId } = useParams();
  const sliceStudents = useAppSelector(getStudents);
  const dispatch = useAppDispatch();
  const { dates, students } = classData;
  const thisMonth =
    new Date().getMonth() >= new Date(classData.dates[0]).getMonth() &&
    new Date().getMonth() <=
      new Date(classData.dates[classData.dates.length - 1]).getMonth()
      ? new Date().toLocaleDateString("sl-SI", { month: "long" })
      : new Date(classData.dates[0]).toLocaleDateString("sl-SI", {
          month: "long",
        });
  const [month, setMonth] = useState(thisMonth);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  async function handleClick() {
    try {
      setIsLoading(true);
      await checkAttendance(sliceStudents, classId!);
      dispatch(clearStudentData());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${dates.length === 1 ? "w-1/2" : ""}`}>
      <p className="text-sm font-medium text-black/75">
        Seznam prijavljenih uporabnikov
      </p>
      <div className="drop-shadow-input flex flex-col gap-6 rounded-lg bg-white px-6 py-5">
        <Filters
          month={month}
          setMonth={setMonth}
          dates={dates}
          setName={setName}
        />
        <div>
          <NameBar dates={dates} month={month} />
          {students
            .filter((studentData) =>
              studentData.student.fullName.toLowerCase().includes(name),
            )
            .sort((a, b) =>
              a.student.lastName.localeCompare(b.student.lastName, "sl", {
                sensitivity: "base",
              }),
            )
            .map((studentData, i) => (
              <ClassUserListCard
                key={studentData._id}
                studentData={studentData}
                i={i}
                dates={dates}
                month={month}
              />
            ))}
        </div>
      </div>
      <button
        className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer self-end rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
        onClick={handleClick}
        disabled={isLoading || sliceStudents.length === 0}
      >
        Shrani prisotnost uporabnika
      </button>
    </div>
  );
}

function Filters({
  month,
  setMonth,
  setName,
  dates,
}: {
  month: string;
  setMonth: Dispatch<SetStateAction<string>>;
  setName: Dispatch<SetStateAction<string>>;
  dates: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    ...new Set(
      dates.map((date) =>
        new Date(date).toLocaleDateString("sl-SI", { month: "long" }),
      ),
    ),
  ];

  function handleClick(month: string) {
    setMonth(month);
    setIsOpen(false);
  }

  function handleMonthBefore() {
    if (months.indexOf(month) > 0) {
      setMonth(months[months.indexOf(month) - 1]);
    }
  }

  function handleMonthAfter() {
    if (months.indexOf(month) < months.length - 1) {
      setMonth(months[months.indexOf(month) + 1]);
    }
  }

  return (
    <>
      <div
        className={`${dates.length > 1 ? "grid grid-cols-[3fr_1fr_8fr] gap-x-5" : ""}`}
      >
        {dates.length > 1 && (
          <>
            <div className="relative font-medium text-black/75">
              <p
                className={`border-gray/75 flex items-center justify-between border px-6 py-2 shadow-xs ${isOpen ? "rounded-t-lg" : "rounded-lg"}`}
              >
                Mesec: {month.toUpperCase()}{" "}
                <ChevronDownIcon
                  className={`h-4 cursor-pointer stroke-3 ${isOpen ? "rotate-180" : ""}`}
                  onClick={() => setIsOpen((isOpen) => !isOpen)}
                />
              </p>
              {isOpen && (
                <div className="border-gray/75 absolute top-full left-0 flex w-full flex-col items-start gap-4 rounded-b-lg border bg-white px-6 py-2 shadow-xs">
                  {months.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => handleClick(el)}
                      className="cursor-pointer"
                    >
                      {el.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between font-medium text-black/75">
              <div className="border-gray/75 flex h-full items-center rounded-lg border px-3 shadow-xs">
                <ArrowLeftIcon
                  className="h-4 cursor-pointer stroke-3"
                  onClick={handleMonthBefore}
                />
              </div>
              <div className="border-gray/75 flex h-full items-center rounded-lg border px-3 shadow-xs">
                <ArrowRightIcon
                  className="h-4 cursor-pointer stroke-3"
                  onClick={handleMonthAfter}
                />
              </div>
            </div>
          </>
        )}
        <div className="border-gray/75 flex items-center gap-2 rounded-lg border px-3 py-2 shadow-xs">
          <MagnifyingGlassIcon className="h-4 stroke-3" />
          <input
            placeholder="Išči po udeležencih"
            className="w-full outline-none"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}

function NameBar({ month, dates }: { month: string; dates: string[] }) {
  const monthDates = dates.filter(
    (date) =>
      new Date(date).toLocaleDateString("sl-SI", { month: "long" }) === month,
  );

  return (
    <div
      className={`bg-primary grid items-center justify-items-center rounded-xl p-3 font-semibold ${dates.length > 1 ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]" : "grid-cols-2"} `}
    >
      <p className="justify-self-start text-black/75">
        Ime in priimek uporabnika
      </p>
      {monthDates.map((date, i) => (
        <p className="text-black/50" key={(i + 1) * 1000}>
          {new Date(date).toLocaleDateString("sl-SI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      ))}
    </div>
  );
}

export default ClassUserList;
