import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState, type Dispatch, type SetStateAction } from "react";
import Spinner from "../../../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { getArticles, getOneArticle } from "../../../services/articlesAPI";
import { generateGiftCodes } from "../../../services/giftAPI";
import { useNavigate } from "react-router";

function CreateGiftForm() {
  const navigate = useNavigate();

  const [isOpenArticles, setIsOpenArticles] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [expires, setExpires] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [err, setErr] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => getOneArticle(articleId),
    enabled: !!articleId,
  });

  async function handleSubmit() {
    try {
      setIsLoadingSubmit(true);

      if (quantity && data) {
        await generateGiftCodes({
          article: data.article._id,
          quantity,
          label: data.article.label,
          expires,
        });

        setTimeout(() => {
          navigate("/dashboard/gifts");
        });
      } else {
        setErr("Izpolni obvezna polja.");
      }
    } catch (error) {
      console.log(error);
      setErr((error as Error).message);
    } finally {
      setIsLoadingSubmit(false);
    }
  }

  if (isLoading) {
    return <p>...</p>;
  }

  return (
    <>
      <div>
        <p className="text-3xl font-semibold">Ustvari darilni bon</p>
      </div>
      <div className="grid grid-cols-[4fr_1fr_1fr] gap-x-5 gap-y-10">
        <div>
          <p>
            Artikel <span className="font-bold text-red-500">*</span>
          </p>
          <div className="flex gap-8 rounded-xl bg-white px-8 py-9">
            <input
              placeholder="Ime artikla"
              className="grow rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
              disabled
              defaultValue={data?.article.name.sl}
            />
            <button
              className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-4 py-1.5 font-semibold transition-colors duration-300"
              onClick={() => setIsOpenArticles(true)}
            >
              Išči po artiklih
            </button>
          </div>
        </div>
        <div>
          <p>Veljavnost</p>
          <div className="flex gap-8 rounded-xl bg-white px-8 py-9">
            <input
              type="date"
              className="grow rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
              onChange={(e) => setExpires(e.target.value)}
            />
          </div>
        </div>
        <div>
          <p>
            Količina <span className="font-bold text-red-500">*</span>
          </p>
          <div className="flex gap-8 rounded-xl bg-white px-8 py-9">
            <input
              type="number"
              placeholder="Št. bonov"
              className="grow rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-3 justify-self-end">
          <button
            onClick={handleSubmit}
            disabled={isLoadingSubmit}
            className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-4 py-1.5 font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
          >
            Ustvari darilne bone
          </button>
          {err && <p className="mt-4 font-semibold text-red-500">{err}</p>}
        </div>
      </div>
      {isOpenArticles && (
        <PickArticle
          setIsOpenArticles={setIsOpenArticles}
          setArticleId={setArticleId}
        />
      )}
    </>
  );
}

function PickArticle({
  setIsOpenArticles,
  setArticleId,
}: {
  setIsOpenArticles: Dispatch<SetStateAction<boolean>>;
  setArticleId: Dispatch<SetStateAction<string>>;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles({}),
  });

  function handleClick(id: string) {
    setArticleId(id);

    setIsOpenArticles(false);
  }

  if (isPending) {
    return (
      <div className="fixed top-0 left-0 h-dvh w-dvw bg-black/50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 z-50 h-dvh w-dvw overflow-y-scroll bg-black/50">
      <XMarkIcon
        className="absolute top-8 right-8 h-8 cursor-pointer stroke-3 text-white"
        onClick={() => setIsOpenArticles(false)}
      />
      <div className="mx-auto my-20 w-full max-w-7xl rounded-xl bg-white p-8">
        {data.articles.map(
          (article: {
            _id: string;
            priceDDV: number;
            ageGroup: string[];
            name: { sl: string };
          }) => (
            <div
              className="grid grid-cols-[5fr_5fr_2fr] gap-x-5 rounded-xl bg-white p-6"
              key={article._id}
            >
              <p className="font-quicksand text-lg font-bold uppercase">
                {article.name.sl}
              </p>
              <div className="grid grid-cols-[128px_128px_96px_96px_32px] gap-5">
                <p className="bg-primary/85 flex h-8 w-32 items-center justify-center rounded-lg font-semibold">
                  {new Intl.NumberFormat("sl-SI", {
                    style: "currency",
                    currency: "EUR",
                  }).format(article.priceDDV)}
                </p>
                <p className="outline-secondary flex h-8 w-32 items-center justify-center rounded-md font-medium outline-2">
                  {article.ageGroup.includes("adult")
                    ? "Odrasli"
                    : article.ageGroup.includes("student")
                      ? "15 - 25 let"
                      : article.ageGroup.includes("school")
                        ? "6 - 14 let"
                        : "3 - 5 let"}
                </p>
              </div>
              <button
                className="from-primary to-secondary hover:to-primary flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r px-4 py-1.5 font-semibold transition-colors duration-300"
                onClick={() => handleClick(article._id)}
              >
                Dodaj
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default CreateGiftForm;
