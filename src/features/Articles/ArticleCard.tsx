import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { deleteArticle } from "../../services/articlesAPI";
import { useQueryClient } from "@tanstack/react-query";

function ArticleCard({
  article,
}: {
  article: {
    name: { sl: string };
    priceDDV: number;
    ageGroup: string;
    hiddenUsers: boolean;
    hiddenReception: boolean;
    gift: boolean;
    _id: string;
  };
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { name, priceDDV, ageGroup, hiddenReception, hiddenUsers, gift, _id } =
    article;

  async function handleDelete() {
    try {
      await deleteArticle(_id);

      queryClient.invalidateQueries({ queryKey: ["articles"] });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="grid grid-cols-[5fr_5fr_2fr] gap-x-5 rounded-xl bg-white p-6">
      <p className="font-quicksand text-lg font-bold uppercase">{name.sl}</p>
      <div className="grid grid-cols-[128px_128px_96px_96px_32px] gap-5">
        <p className="bg-primary/85 flex h-8 w-32 items-center justify-center rounded-lg font-semibold">
          {new Intl.NumberFormat("sl-SI", {
            style: "currency",
            currency: "EUR",
          }).format(priceDDV)}
        </p>
        <p className="outline-secondary flex h-8 w-32 items-center justify-center rounded-md font-medium outline-2">
          {ageGroup.includes("adult")
            ? "Odrasli"
            : ageGroup.includes("student")
              ? "15 - 25 let"
              : ageGroup.includes("school")
                ? "6 - 14 let"
                : "3 - 5 let"}
        </p>
        <p
          className={`outline-gray flex h-8 w-24 items-center justify-center gap-2 rounded-md text-sm font-medium outline-2 ${hiddenReception ? "bg-red-700/5" : ""}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${hiddenReception ? "bg-red-700" : "bg-green-700"}`}
          ></span>
          Blagajna
        </p>{" "}
        <p
          className={`outline-gray flex h-8 w-24 items-center justify-center gap-2 rounded-md text-sm font-medium outline-2 ${hiddenUsers ? "bg-red-700/5" : ""}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${hiddenUsers ? "bg-red-700" : "bg-green-700"}`}
          ></span>
          Uporabniki
        </p>
        {gift && (
          <p className="bg-primary/85 flex h-8 w-8 items-center justify-center rounded-lg font-semibold">
            D
          </p>
        )}
      </div>
      <div className="grid grid-cols-[32px_32px] gap-3.5 justify-self-end">
        <button
          className="from-primary to-secondary hover:to-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r font-semibold transition-colors duration-300"
          onClick={() => navigate(`/dashboard/articles/${_id}`)}
        >
          <PencilIcon className="h-4 stroke-2" />
        </button>
        <button
          className="from-primary to-secondary hover:to-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r font-semibold transition-colors duration-300"
          onClick={handleDelete}
        >
          <TrashIcon className="h-4 stroke-2" />
        </button>
      </div>
    </div>
  );
}

export default ArticleCard;
