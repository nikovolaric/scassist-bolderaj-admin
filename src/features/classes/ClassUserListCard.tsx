import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getStudents,
  removeDate,
  setStudent,
} from "./slices/checkAttendanceSlice";

function ClassUserListCard({
  studentData,
  i,
  dates,
  month,
}: {
  studentData: {
    student: { fullName: string; birthDate: string; _id: string };
    attendance: string[];
  };
  i: number;
  dates: string[];
  month: string;
}) {
  const { student, attendance } = studentData;
  const monthDates = dates.filter(
    (date) =>
      new Date(date).toLocaleDateString("sl-SI", { month: "long" }) === month,
  );

  return (
    <div
      className={`border-gray/75 grid items-center justify-items-center border-b px-3 py-4 ${i % 2 === 0 ? "bg-primary/10" : ""} ${dates.length > 1 ? "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr]" : "grid-cols-2"}`}
    >
      <div className="justify-self-start">
        <p className="font-medium">{student.fullName}</p>
        <p className="text-black/50">
          {new Date(student.birthDate).toLocaleDateString("sl-SI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
      {monthDates.map((date) => (
        <CheckBox
          key={date}
          date={date}
          attendance={attendance}
          id={student._id}
        />
      ))}
    </div>
  );
}

function CheckBox({
  attendance,
  date,
  id,
}: {
  attendance: string[];
  date: string;
  id: string;
}) {
  const dispatch = useAppDispatch();
  const students = useAppSelector(getStudents);
  const curStudent = students.find((student) => student.id === id);
  const [isChecked, setIsChecked] = useState(
    (attendance.includes(date) || curStudent?.dates.includes(date)) ?? false,
  );

  function handleChange() {
    setIsChecked((isChecked) => !isChecked);

    if (!curStudent?.dates.includes(date)) {
      dispatch(setStudent({ id, date }));
    } else {
      dispatch(removeDate({ id, date }));
    }
  }

  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        className="peer hidden"
        checked={isChecked}
        onChange={handleChange}
      />
      <div className="border-gray flex h-6 w-6 items-center justify-center rounded-lg border transition-all duration-75">
        <span
          className={`${isChecked ? "bg-primary border-gray border" : ""} h-4 w-4 rounded-full`}
        />
      </div>
    </label>
  );
}

export default ClassUserListCard;
