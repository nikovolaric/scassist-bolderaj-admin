import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CashRegisterData from "./CashRegisterData";
import { changeDate, getCashRegister } from "./slice/cashRegisterSlice";

function CashRegisterInfo() {
  const dispatch = useAppDispatch();
  const cashRegister = useAppSelector(getCashRegister);

  return (
    <div className="flex flex-col gap-12">
      <p className="text-3xl font-semibold">
        Pregled dnevne blagajne{" "}
        {cashRegister.user ? `- za ${cashRegister.userName}` : ""}
      </p>
      <div>
        <p>Izberi datum</p>
        <input
          type="date"
          className="rounded-lg bg-white px-3.5 py-2.5 shadow-xs"
          defaultValue={cashRegister.date}
          onChange={(e) => dispatch(changeDate(e.target.value))}
        />
      </div>
      <CashRegisterData />
    </div>
  );
}

export default CashRegisterInfo;
