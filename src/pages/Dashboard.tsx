import { Link } from "react-router";
import Header from "../components/Header";
import DailyStats from "../features/dashboard/DailyStats";

function Dashboard() {
  return (
    <div className="my-16 flex flex-col gap-25">
      <Header />
      <ul className="flex items-center gap-4">
        <Link to="/dashboard/invoices" className="text-blue-500 underline">
          Računi
        </Link>
        <Link to="/dashboard/users" className="text-blue-500 underline">
          Uporabniki
        </Link>
        <Link to="/dashboard/articles" className="text-blue-500 underline">
          Artikli
        </Link>
        <Link to="/dashboard/companies" className="text-blue-500 underline">
          Podjetja
        </Link>
        <Link to="/dashboard/gifts" className="text-blue-500 underline">
          Darilni boni
        </Link>
        <Link to="/dashboard/cashregister" className="text-blue-500 underline">
          Pregled dnevne blagajne
        </Link>
      </ul>
      <div className="grid grid-cols-[2fr_1fr]">
        <DailyStats />
      </div>
    </div>
  );
}

export default Dashboard;
