import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import LinkBtn from "./LinkBtn";
import { useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/userAPI";
import { useState } from "react";
import { logout } from "../services/authAPI";

function Header({ btnTo }: { btnTo?: string }) {
  const { pathname } = useLocation();

  return (
    <header className="flex flex-col gap-14 lg:gap-20">
      <div className="flex items-center justify-between">
        <div className="w-1/2 md:w-1/3 lg:w-1/6">
          <Logo />
        </div>
        <HeaderBadges />
      </div>
      {pathname !== "/dashboard" && (
        <div>
          <LinkBtn type="backBtn" to={btnTo}>
            <p className="flex items-center gap-4">
              <ChevronLeftIcon className="h-4 stroke-3" />
              Nazaj
            </p>
          </LinkBtn>
        </div>
      )}
    </header>
  );
}

function HeaderBadges() {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({ queryKey: ["me"], queryFn: getMe });
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  if (isPending) return <p>...</p>;

  return (
    <div className="drop-shadow-input border-gray/80 flex h-11 items-center gap-4 rounded-lg border bg-white px-4">
      <svg
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 19C17 17.6044 17 16.9067 16.8278 16.3389C16.44 15.0605 15.4395 14.06 14.1611 13.6722C13.5933 13.5 12.8956 13.5 11.5 13.5H6.5C5.10444 13.5 4.40665 13.5 3.83886 13.6722C2.56045 14.06 1.56004 15.0605 1.17224 16.3389C1 16.9067 1 17.6044 1 19M13.5 5.5C13.5 7.98528 11.4853 10 9 10C6.51472 10 4.5 7.98528 4.5 5.5C4.5 3.01472 6.51472 1 9 1C11.4853 1 13.5 3.01472 13.5 5.5Z"
          stroke="#1C1C1C"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div>
        <p className="text-sm font-semibold">{data.fullName}</p>
        <p className="text-sm text-black/50">{data.email}</p>
      </div>
      <div className="relative">
        <ChevronDownIcon
          className={`w-5 cursor-pointer stroke-2 ${isOpen ? "rotate-180" : ""}`}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        />
        {isOpen && (
          <div className="drop-shadow-input border-gray/80 absolute -right-4 -bottom-12 w-24 gap-4 rounded-lg border bg-white px-4 py-1 text-center">
            <button
              className="cursor-pointer text-sm font-semibold"
              onClick={handleLogout}
            >
              Odjavi se
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
