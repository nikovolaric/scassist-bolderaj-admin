import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import LinkBtn from "../../components/LinkBtn";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getArticles } from "../../services/articlesAPI";
import Spinner from "../../components/Spinner";
import ArticleCard from "./ArticleCard";

const categories = [
  { name: "Vstopnice", label: "V" },
  { name: "Vodene vadbe", label: "VV" },
  { name: "Aktivnosti", label: "A" },
  { name: "Ostalo", label: "O" },
];

function SearchArticles() {
  const [label, setLabel] = useState("V");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [name, setName] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["articles", name, ageGroup, label],
    queryFn: () => getArticles({ name, ageGroup, label }),
  });

  return (
    <div className="flex flex-col gap-14">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">Artikli</p>
        <LinkBtn type="primary" to="/dashboard/articles/add">
          <p className="flex items-center gap-4">
            <PlusCircleIcon className="h-5 stroke-2" />
            Ustvari nov artikel
          </p>
        </LinkBtn>
      </div>
      <Filter label={label} setLabel={setLabel} />
      <div className="flex flex-col gap-4">
        <AgeGroup ageGroup={ageGroup} setAgeGroup={setAgeGroup} />
        <div className="drop-shadow-input border-gray/75 flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <MagnifyingGlassIcon className="h-4 stroke-3" />
          <input
            placeholder="Išči po artiklih"
            className="w-full outline-none"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          {label === "V" && (
            <>
              <div>
                <p className="text-sm font-medium">Dnevne vstopnice</p>
                <div className="flex flex-col gap-3">
                  {data.articles
                    .filter(
                      (article: { type: string }) => article.type === "dnevna",
                    )
                    .map(
                      (article: {
                        name: { sl: string };
                        priceDDV: number;
                        ageGroup: string;
                        hiddenUsers: boolean;
                        hiddenReception: boolean;
                        gift: boolean;
                        _id: string;
                      }) => (
                        <ArticleCard key={article._id} article={article} />
                      ),
                    )}
                </div>
              </div>{" "}
              <div>
                <p className="text-sm font-medium">
                  Vstopnice za daljše obdobje
                </p>
                <div className="flex flex-col gap-3">
                  {data.articles
                    .filter(
                      (article: { type: string }) =>
                        article.type === "terminska",
                    )
                    .map(
                      (article: {
                        name: { sl: string };
                        priceDDV: number;
                        ageGroup: string;
                        hiddenUsers: boolean;
                        hiddenReception: boolean;
                        gift: boolean;
                        _id: string;
                      }) => (
                        <ArticleCard key={article._id} article={article} />
                      ),
                    )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Paketi vstopnic</p>
                <div className="flex flex-col gap-3">
                  {data.articles
                    .filter(
                      (article: { type: string }) => article.type === "paket",
                    )
                    .map(
                      (article: {
                        name: { sl: string };
                        priceDDV: number;
                        ageGroup: string;
                        hiddenUsers: boolean;
                        hiddenReception: boolean;
                        gift: boolean;
                        _id: string;
                      }) => (
                        <ArticleCard key={article._id} article={article} />
                      ),
                    )}
                </div>
              </div>
            </>
          )}
          {label === "VV" && (
            <div>
              <p className="text-sm font-medium">Vodene vadbe</p>
              <div className="flex flex-col gap-3">
                {data.articles.map(
                  (article: {
                    name: { sl: string };
                    priceDDV: number;
                    ageGroup: string;
                    hiddenUsers: boolean;
                    hiddenReception: boolean;
                    gift: boolean;
                    _id: string;
                  }) => (
                    <ArticleCard key={article._id} article={article} />
                  ),
                )}
              </div>
            </div>
          )}{" "}
          {label === "A" && (
            <div>
              <p className="text-sm font-medium">Aktivnosti</p>
              <div className="flex flex-col gap-3">
                {data.articles.map(
                  (article: {
                    name: { sl: string };
                    priceDDV: number;
                    ageGroup: string;
                    hiddenUsers: boolean;
                    hiddenReception: boolean;
                    gift: boolean;
                    _id: string;
                  }) => (
                    <ArticleCard key={article._id} article={article} />
                  ),
                )}
              </div>
            </div>
          )}
          {label === "O" && (
            <div>
              <p className="text-sm font-medium">Ostali artikli</p>
              <div className="flex flex-col gap-3">
                {data.articles.map(
                  (article: {
                    name: { sl: string };
                    priceDDV: number;
                    ageGroup: string;
                    hiddenUsers: boolean;
                    hiddenReception: boolean;
                    gift: boolean;
                    _id: string;
                  }) => (
                    <ArticleCard key={article._id} article={article} />
                  ),
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Filter({
  label,
  setLabel,
}: {
  label: string;
  setLabel: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {categories.map((cat) => (
        <button
          className={`font-quicksand w-full cursor-pointer rounded-xl py-9.5 text-center font-bold uppercase ${label === cat.label ? "bg-primary/55 outline-secondary outline-2" : "bg-white"}`}
          key={cat.label}
          onClick={() => setLabel(cat.label)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

function AgeGroup({
  ageGroup,
  setAgeGroup,
}: {
  ageGroup: string;
  setAgeGroup: Dispatch<SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick(ageGroup: string) {
    setAgeGroup(ageGroup);

    setIsOpen(false);
  }

  return (
    <div
      className={`drop-shadow-input relative z-20 flex items-center gap-2 self-end bg-white px-5 py-2.5 ${isOpen ? "rounded-t-lg" : "rounded-lg"}`}
    >
      <p className="font-semibod flex items-center gap-4.5 font-semibold text-black/75">
        Starostna skupina:{" "}
        <span className="drop-shadow-input border-secondary cursor-pointer rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]">
          {ageGroup === "adult"
            ? "Odrasli"
            : ageGroup === "student"
              ? "15 - 25 let"
              : ageGroup === "school"
                ? "6 - 14 let"
                : "3 - 5 let"}
        </span>
        <ChevronDownIcon
          className={`h-5 cursor-pointer stroke-3 ${isOpen ? "rotate-180" : ""}`}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
        />
      </p>
      {isOpen && (
        <div className="drop-shadow-input absolute top-full left-0 z-20 flex w-full flex-col gap-4 rounded-b-lg bg-white px-5 py-2.5 text-right font-medium">
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("adult")}
          >
            Odrasli
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("student")}
          >
            15 - 25 let
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("school")}
          >
            6 - 14 let
          </p>
          <p
            className="drop-shadow-input border-secondary cursor-pointer self-end rounded-lg border-2 bg-white px-4 shadow-[inset_1px_2px_4px_rgba(0,0,0,0.25)]"
            onClick={() => handleClick("preschool")}
          >
            3 - 5 let
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchArticles;
