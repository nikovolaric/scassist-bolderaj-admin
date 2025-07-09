import LinkBtn from "../../components/LinkBtn";

function GiftCard({
  gift,
  i,
}: {
  gift: {
    giftCode: string;
    expires: string;
    article: { name: { sl: string }; ageGroup: string };
    used: boolean;
    _id: string;
    createdAt: string;
  };
  i: number;
}) {
  const { giftCode, expires, article, used, _id, createdAt } = gift;

  function generateAgeGroup() {
    if (article.ageGroup.includes("preschool")) return "3 - 5 let";
    if (article.ageGroup.includes("school")) return "6 - 14 let";
    if (article.ageGroup.includes("student")) return "15 - 25 let";
    if (article.ageGroup.includes("adult")) return "Odrasli";
  }

  return (
    <div
      className={`grid grid-cols-[1fr_2fr_4fr_2fr_2fr_2fr] items-center justify-items-start rounded-lg px-4 py-5 shadow-xs ${i % 2 === 0 ? "bg-white" : "bg-primary/10"}`}
    >
      <p className="font-semibold">{giftCode}</p>
      <p className="text-black/75">
        {new Date(expires).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
      <p className="font-medium">{article.name.sl}</p>
      <p className="font-semibold text-black/75">{generateAgeGroup()}</p>
      <p className="font-semibold text-black/75">
        {new Date(createdAt).toLocaleDateString("sl-SI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      {!used && new Date(expires) > new Date() && (
        <LinkBtn to={`/dashboard/gifts/${_id}`} type="primary">
          Vnovči darilni bon
        </LinkBtn>
      )}
    </div>
  );
}

export default GiftCard;
