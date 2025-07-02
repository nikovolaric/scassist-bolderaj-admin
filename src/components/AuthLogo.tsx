import { useNavigate } from "react-router";

// function AuthLogo() {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   function handleClick() {
//     dispatch(clearSignupData());
//     navigate("/");
//   }

//   return (
//     <img
//       src="/logo.svg"
//       alt="logotip"
//       className="h-auto w-auto cursor-pointer object-cover"
//       onClick={handleClick}
//     />
//   );
// }

function AuthLogo() {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
  }

  return (
    <img
      src="/logocrn.svg"
      alt="logotip"
      className="bg-primary drop-shadow-input h-auto w-auto cursor-pointer rounded-lg object-cover px-4 py-2"
      onClick={handleClick}
    />
  );
}

export default AuthLogo;
