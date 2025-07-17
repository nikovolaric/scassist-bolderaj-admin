import LinkBtn from "../../components/LinkBtn";

function ClassListCard({
  classData,
  i,
}: {
  classData: {
    teacher: { fullName: string };
    dates: string[];
    className: { sl: string };
    hours: number[];
    _id: string;
  };
  i: number;
}) {
  const { teacher, dates, className, hours, _id } = classData;

  return (
    <div
      className={`${i % 2 === 0 ? "bg-white" : "bg-primary/25"} drop-shadow-input grid grid-cols-[2fr_3fr_4fr_4fr_2fr] items-center rounded-lg px-4 py-5`}
    >
      <p className="text-black/75">
        {dates.length > 1
          ? new Date(dates[0])
              .toLocaleDateString("sl-SI", { weekday: "long" })
              .toUpperCase()
          : new Date(dates[0])
              .toLocaleDateString("sl-SI", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .toUpperCase()}
      </p>
      <p className="text-black/75">{`${hours[0]} - ${hours[1]}`}</p>
      <p className="font-semibold">{className.sl}</p>
      <p className="font-semibold text-black/75">{teacher.fullName}</p>
      <LinkBtn type="primary" to={`/dashboard/classes/${_id}`}>
        Prikaži skupino
      </LinkBtn>
    </div>
  );
}

export default ClassListCard;
