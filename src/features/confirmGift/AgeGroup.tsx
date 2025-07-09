function AgeGroup({
  gift,
}: {
  gift: { giftCode: string; article: { ageGroup: string } };
}) {
  const { giftCode, article } = gift;

  function generateAgeGroup() {
    if (article.ageGroup.includes("preschool")) return "3 - 5 let";
    if (article.ageGroup.includes("school")) return "6 - 14 let";
    if (article.ageGroup.includes("student")) return "15 - 25 let";
    if (article.ageGroup.includes("adult")) return "Odrasli";
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-3xl font-semibold">
        Vnovčitev darilnega bona:{" "}
        <span className="font-normal">{giftCode}</span>
      </p>
      <div className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 text-black/75 shadow-xs">
        <p className="font-semibold">Starostna skupina:</p>
        <p className="border-secondary rounded-lg border-2 px-5 py-1 font-medium shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]">
          {generateAgeGroup()}
        </p>
      </div>
    </div>
  );
}

export default AgeGroup;
