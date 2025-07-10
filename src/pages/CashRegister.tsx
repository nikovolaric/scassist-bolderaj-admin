import Header from "../components/Header";
import CashRegisterInfo from "../features/cashRegister/CashRegisterInfo";

function CashRegister() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <CashRegisterInfo />
    </div>
  );
}

export default CashRegister;
