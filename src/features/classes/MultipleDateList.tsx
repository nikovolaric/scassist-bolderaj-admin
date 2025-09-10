import ClassListCard from "./ClassListCard";

function MultipleDateList({
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
  const today = new Date().toLocaleDateString("sl-SI", { weekday: "long" });

  return (
    <>
      <div>
        <p className="text-xl font-semibold">Danes, {today}</p>
        <div className="mt-6 flex flex-col gap-2">
          {classes
            .filter(
              (el) => new Date(el.dates[el.dates.length - 1]) >= new Date(),
            )
            .sort((a, b) => a.hours[0] - b.hours[0])
            .map((el, i) => {
              if (
                new Date(el.dates[0]).toLocaleDateString("sl-SI", {
                  weekday: "long",
                }) === today
              ) {
                return <ClassListCard key={el._id} classData={el} i={i} />;
              }
            })}
        </div>
      </div>
      <ClassDatesList day="ponedeljek" classes={classes} />
      <ClassDatesList day="torek" classes={classes} />
      <ClassDatesList day="sreda" classes={classes} />
      <ClassDatesList day="četrtek" classes={classes} />
      <ClassDatesList day="petek" classes={classes} />
      <ClassDatesList day="sobota" classes={classes} />
    </>
  );
}

function ClassDatesList({
  day,
  classes,
}: {
  day: string;
  classes: {
    teacher: { fullName: string };
    dates: string[];
    className: { sl: string };
    hours: number[];
    _id: string;
  }[];
}) {
  const today = new Date().toLocaleDateString("sl-SI", { weekday: "long" });

  if (day !== today)
    return (
      <div>
        <p className="text-xl font-semibold capitalize">{day}</p>
        <div className="mt-6 flex flex-col gap-2">
          {classes
            .filter(
              (el) => new Date(el.dates[el.dates.length - 1]) >= new Date(),
            )
            .map((el, i) => {
              if (
                new Date(el.dates[0]).toLocaleDateString("sl-SI", {
                  weekday: "long",
                }) === day
              ) {
                return <ClassListCard key={el._id} classData={el} i={i} />;
              }
            })}
        </div>
      </div>
    );
}

export default MultipleDateList;
