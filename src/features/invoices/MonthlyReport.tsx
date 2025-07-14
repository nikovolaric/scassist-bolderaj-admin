import { getMonthlyReport } from "../../services/invoicesAPI";

const months = [
  "JANUAR",
  "FEBRUAR",
  "MAREC",
  "APRIL",
  "MAJ",
  "JUNIJ",
  "JULIJ",
  "AVGUST",
  "SEPTEMBER",
  "OKTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function MonthlyReport() {
  async function handleClick(formData: FormData) {
    const bodyData = Object.fromEntries(formData);

    await getMonthlyReport(bodyData);
  }

  return (
    <form className="flex items-center gap-4 self-end" action={handleClick}>
      <p className="font-medium">Prenesi računovodsko poročilo za mesec:</p>
      <select
        className="bg-white px-2 py-1 outline-none"
        name="month"
        defaultValue={new Date().getMonth()}
      >
        {months.map((month, i) => (
          <option key={i} value={i + 1}>
            {month}
          </option>
        ))}
      </select>
      <select
        className="bg-white px-2 py-1 outline-none"
        name="year"
        defaultValue={new Date().getFullYear()}
      >
        {Array.from({ length: new Date().getFullYear() - 2024 }).map((_, i) => (
          <option key={(i + 1) * 100} value={new Date().getFullYear() - i}>
            {new Date().getFullYear() - i}
          </option>
        ))}
      </select>
      <button className="bg-primary cursor-pointer rounded-lg px-4 py-1 font-semibold shadow-xs">
        Prenesi
      </button>
    </form>
  );
}

export default MonthlyReport;
