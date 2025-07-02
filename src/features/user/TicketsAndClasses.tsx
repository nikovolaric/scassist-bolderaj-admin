import Classes from "./Classes";
import Tickets from "./Tickets";

function TicketsAndClasses() {
  return (
    <div className="grid grid-cols-3 gap-x-5">
      <Tickets />
      <Classes />
      <Classes single={true} />
    </div>
  );
}

export default TicketsAndClasses;
