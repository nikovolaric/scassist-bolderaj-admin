import Companies from "./Companies";
import Gifts from "./Gifts";

function CompanyAndGits() {
  return (
    <div className="grid grid-cols-3 gap-x-5">
      <Companies />
      <Gifts />
    </div>
  );
}

export default CompanyAndGits;
