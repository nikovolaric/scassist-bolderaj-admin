import Header from "../components/Header";
import CashRegisterInfo from "../features/cashRegister/CashRegisterInfo";
import DailyInvoices from "../features/cashRegister/DailyInvoices";

function CashRegister() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CashRegisterInfo />
      <DailyInvoices />
    </div>
  );
}

export default CashRegister;
