import { useNavigate } from "react-router";

// function Logo() {
//   const navigate = useNavigate();
//   return (
//     <img
//       src="/logo.svg"
//       alt="logotip"
//       className="h-auto w-auto cursor-pointer object-cover"
//       onClick={() => navigate("/dashboard")}
//     />
//   );
// }

function Logo() {
  const navigate = useNavigate();
  return (
    <img
      src="/ikona-logo.svg"
      alt="logotip"
      className="h-14 w-auto cursor-pointer rounded-lg bg-white object-cover p-1.5 shadow-xs"
      onClick={() => navigate("/dashboard")}
    />
  );
}

export default Logo;
