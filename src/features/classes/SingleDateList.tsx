import ClassListCard from "./ClassListCard";

function SingleDateList({
  classes,
}: {
  classes: {
    teacher: { fullName: string };
    dates: string[];
    className: { sl: string };
    hours: number[];
    _id: string;
  }[];
}) {
  const today = new Date().toLocaleDateString("sl-SI");

  return (
    <>
      <div>
        <p className="text-xl font-semibold">
          Danes, {new Date().toLocaleDateString("sl-SI", { weekday: "long" })}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {classes.map((el, i) => {
            if (new Date(el.dates[0]).toLocaleDateString("sl-SI") === today) {
              return <ClassListCard key={el._id} classData={el} i={i} />;
            }
          })}
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Prihajajoče dogajanje</p>
        <div className="mt-6 flex flex-col gap-2">
          {classes.map((el, i) => {
            if (
              new Date(el.dates[0]).toTimeString() > new Date().toTimeString()
            ) {
              return <ClassListCard key={el._id} classData={el} i={i} />;
            }
          })}
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">Preteklo dogajanje</p>
        <div className="mt-6 flex flex-col gap-2">
          {classes.map((el, i) => {
            if (
              new Date(el.dates[0]).toTimeString() < new Date().toTimeString()
            ) {
              return <ClassListCard key={el._id} classData={el} i={i} />;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default SingleDateList;
