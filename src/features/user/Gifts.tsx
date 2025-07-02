import { ChevronRightIcon } from "@heroicons/react/24/outline";
import LinkBtn from "../../components/LinkBtn";

function Gifts() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <p className="text-sm font-medium text-black/75">Podjetje</p>
      <div className="drop-shadow-input flex items-center justify-between rounded-xl bg-white px-5.5 py-4">
        <p className="font-semibold">Uporabnik ima darilni bon.</p>
        <LinkBtn type="primary" to={`/dashboard/gifts`}>
          <p className="flex items-center gap-4">
            Vnovči bon <ChevronRightIcon className="h-4 stroke-3" />
          </p>
        </LinkBtn>
      </div>
    </div>
  );
}

export default Gifts;
