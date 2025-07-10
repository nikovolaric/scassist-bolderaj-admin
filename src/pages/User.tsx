import Header from "../components/Header";
import AdditionalInfo from "../features/user/AdditionalInfo";
import CompanyAndGits from "../features/user/CompanyAndGits";
import TicketsAndClasses from "../features/user/TicketsAndClasses";
import UserChildren from "../features/user/UserChildren";
import UserInfo from "../features/user/UserInfo";
import UserInvoices from "../features/user/UserInvoices";
import UserParent from "../features/user/UserParent";
import UserPreInvoices from "../features/user/UserPreInvoices";
import VisitsAndUserInfo from "../features/user/VisitsAndUserInfo";

function User() {
  return (
    <div className="my-16 flex flex-col gap-20">
      <Header />
      <UserInfo />
      <TicketsAndClasses />
      <CompanyAndGits />
      <VisitsAndUserInfo />
      <UserPreInvoices />
      <UserInvoices />
      <UserParent />
      <UserChildren />
      <AdditionalInfo />
    </div>
  );
}

export default User;
