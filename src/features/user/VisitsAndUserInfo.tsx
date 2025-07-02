import UserInfoCard from "./UserInfoCard";
import Visits from "./Visits";

function VisitsAndUserInfo() {
  return (
    <div className="grid grid-cols-3 gap-x-5">
      <Visits />
      <UserInfoCard />
    </div>
  );
}

export default VisitsAndUserInfo;
