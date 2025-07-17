import { useQueries, useQuery } from "@tanstack/react-query";
import {
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Link, useNavigate } from "react-router";
import { getOneUser } from "../../services/userAPI";
import {
  PlusCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getArticles, getOneArticle } from "../../services/articlesAPI";
import Spinner from "../../components/Spinner";
import { getOneCompany } from "../../services/companiesAPI";
import { createPreInvoice } from "../../services/preInvoicesAPI";

interface IInitialState {
  category: string;
  preInvoiceDate: string;
  paymentDueDate: string;
  articles: {
    articleId: string;
    quantity?: number;
    discount?: number;
  }[];
  buyer?: string;
  recepient?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    email?: string;
  };
  company?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    taxNumber: string;
    email?: string;
  };
}

type Action =
  | { type: "category"; payload: string }
  | { type: "preInvoiceDate"; payload: string }
  | { type: "paymentDueDate"; payload: string }
  | {
      type: "articles";
      payload: { articleId: string; quantity?: number; discount?: number };
    }
  | {
      type: "removeArticle";
      payload: string;
    }
  | { type: "buyer"; payload: string }
  | {
      type: "recepient";
      payload: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
      };
    }
  | {
      type: "recepient.mail";
      payload: string;
    }
  | {
      type: "company";
      payload: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        taxNumber: string;
        email?: string;
      };
    }
  | { type: "company.mail"; payload: string }
  | { type: "reset" };

const initialState: IInitialState = {
  category: "person",
  preInvoiceDate: "",
  paymentDueDate: "",
  articles: [],
};

function reducer(state: IInitialState, action: Action): IInitialState {
  switch (action.type) {
    case "category": {
      localStorage.setItem("category", action.payload);

      return { ...state, category: action.payload };
    }
    case "preInvoiceDate": {
      return { ...state, preInvoiceDate: action.payload };
    }
    case "paymentDueDate": {
      return { ...state, paymentDueDate: action.payload };
    }
    case "articles": {
      const { articleId, quantity, discount } = action.payload;

      const modifiedArticle = state.articles.find(
        (a) => a.articleId === articleId,
      );

      if (modifiedArticle && quantity) {
        modifiedArticle.quantity = quantity;

        const updatedArticles = state.articles.map((a) =>
          a.articleId === articleId ? { ...a, quantity } : a,
        );

        return { ...state, articles: updatedArticles };
      }

      if (modifiedArticle && discount) {
        modifiedArticle.discount = discount;

        const updatedArticles = state.articles.map((a) =>
          a.articleId === articleId ? { ...a, discount } : a,
        );

        return { ...state, articles: updatedArticles };
      }

      return { ...state, articles: [...state.articles, action.payload] };
    }
    case "removeArticle": {
      const updatedArticles = state.articles.filter(
        (a) => a.articleId !== action.payload,
      );

      return { ...state, articles: updatedArticles };
    }
    case "buyer": {
      return { ...state, buyer: action.payload };
    }
    case "recepient": {
      return { ...state, recepient: action.payload };
    }
    case "recepient.mail": {
      return {
        ...state,
        recepient: {
          ...state.recepient,
          email: action.payload,
        } as NonNullable<IInitialState["recepient"]>,
      };
    }
    case "company": {
      return { ...state, company: action.payload };
    }
    case "company.mail": {
      return {
        ...state,
        company: {
          ...state.company,
          email: action.payload,
        } as NonNullable<IInitialState["company"]>,
      };
    }
    case "reset": {
      return initialState;
    }
  }
}

function CreatePreInvoiceForm() {
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const categoryLS = localStorage.getItem("category");

    if (categoryLS) {
      dispatch({ type: "category", payload: categoryLS });
    }
  }, []);

  const { buyer, recepient, paymentDueDate, articles, company } = state;

  async function handleCreatePreInvoice() {
    try {
      setIsLoading(true);

      if (!state.buyer && !state.recepient && !state.company) return;

      const data = await createPreInvoice({
        buyer,
        recepient,
        dueDate: paymentDueDate,
        articles,
        company,
      });

      if (data instanceof Error) {
        setErr(data.message);

        throw Error(data.message);
      }

      navigate("/dashboard/invoices");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">Ustvari predračun</p>
        <div className="flex items-center gap-5">
          {state.category === "person" ? (
            <Link
              to="/dashboard/invoices/createpreinvoice/pickuser"
              className="bg-primary drop-shadow-btn hover:bg-primary/90 flex w-fit flex-none items-center rounded-lg px-4 py-1.5 font-semibold transition-colors duration-150"
            >
              Poišči uporabniški profil
            </Link>
          ) : (
            <Link
              to="/dashboard/invoices/createpreinvoice/pickcompany"
              className="bg-primary drop-shadow-btn hover:bg-primary/90 flex w-fit flex-none items-center rounded-lg px-4 py-1.5 font-semibold transition-colors duration-150"
            >
              Poišči profil podjetja
            </Link>
          )}
          <div className="flex w-100 items-center rounded-lg bg-white px-2 py-1 shadow-xs">
            <button
              className={`w-1/2 flex-none cursor-pointer py-1 text-center ${state.category === "person" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
              onClick={() => {
                dispatch({ type: "category", payload: "person" });
              }}
            >
              Fizična oseba
            </button>
            <button
              className={`w-1/2 flex-none cursor-pointer py-1 text-center ${state.category === "company" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
              onClick={() => {
                dispatch({ type: "category", payload: "company" });
              }}
            >
              Podjetje
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] gap-x-5 gap-y-10">
        {state.category === "person" && <NameSection dispatch={dispatch} />}
        {state.category === "company" && (
          <NameSectionCompany dispatch={dispatch} />
        )}
        <Dates dispatch={dispatch} />
        <Articles dispatch={dispatch} state={state} />
        <EndPart state={state} dispatch={dispatch} />
        <div className="col-span-2 justify-self-end">
          <button
            className="from-primary to-secondary drop-shadow-btn hover:to-primary cursor-pointer rounded-lg bg-gradient-to-r px-10 py-1.5 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400"
            onClick={handleCreatePreInvoice}
            disabled={isLoading}
          >
            Shrani in ustvari predračun
          </button>
          {err && <p>{err}</p>}
        </div>
      </div>
    </>
  );
}

function NameSection({ dispatch }: { dispatch: Dispatch<Action> }) {
  const [buyer, setBuyer] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const { data } = useQuery({
    queryKey: ["buyer", buyer],
    queryFn: () => getOneUser(buyer),
    enabled: !!buyer,
  });

  useEffect(function () {
    const buyerLS = localStorage.getItem("buyer");

    if (buyerLS) {
      setBuyer(buyerLS);
      dispatch({ type: "buyer", payload: buyerLS });
    }
  }, []);

  async function handleClick(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!isEdit) {
      setIsEdit(true);
    }
    if (isEdit) {
      setIsEdit(false);
      if (name && address && city && postalCode) {
        dispatch({
          type: "recepient",
          payload: { name, address, city, postalCode },
        });
        dispatch({ type: "buyer", payload: "" });
        localStorage.removeItem("buyer");
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p>Podatki stranke</p>
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-x-5 gap-y-11 rounded-xl bg-white p-8">
        <div className="col-span-2">
          <p className="text-sm font-medium">Ime in priimek</p>
          <input
            placeholder="Vnesi ime in priimek"
            className="w-70 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.fullName}
            disabled={!isEdit}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          className="bg-primary h-fit cursor-pointer rounded-lg px-4 py-1.5 font-semibold"
          onClick={handleClick}
        >
          {isEdit ? "Shrani" : "Spremeni podatke"}
        </button>
        <div className="">
          <p className="text-sm font-medium">Naslov bivališča</p>
          <input
            placeholder="Vnesi naslov bivališča"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.address}
            disabled={!isEdit}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="">
          <p className="text-sm font-medium">Kraj bivališča</p>
          <input
            placeholder="Vnesi kraj bivališča"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.city}
            disabled={!isEdit}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="">
          <p className="text-sm font-medium">Poštna številka</p>
          <input
            placeholder="Vnesi poštno številko"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.postalCode}
            disabled={!isEdit}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function NameSectionCompany({ dispatch }: { dispatch: Dispatch<Action> }) {
  const [company, setCompany] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["company", company],
    queryFn: () => getOneCompany(company),
    enabled: !!company,
  });

  useEffect(
    function () {
      const companyLS = localStorage.getItem("company");

      if (companyLS) {
        setCompany(companyLS);
      }

      if (!isPending) {
        dispatch({
          type: "company",
          payload: {
            name: data.data.companyName,
            address: data.data.companyAddress,
            postalCode: data.data.companyPostalCode,
            city: data.data.companyCity,
            taxNumber: data.data.companyTaxNo,
            email: data.data.companyEmail,
          },
        });
      }
    },
    [isPending],
  );

  async function handleClick(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!isEdit) {
      setIsEdit(true);
    }
    if (isEdit) {
      setIsEdit(false);
      if (name && address && city && postalCode && taxNumber) {
        dispatch({
          type: "company",
          payload: { name, address, city, postalCode, taxNumber },
        });
        localStorage.removeItem("company");
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p>Podatki podjetja</p>
      <div className="grid grid-cols-[2fr_2fr_1fr] gap-x-5 gap-y-11 rounded-xl bg-white p-8">
        <div className="">
          <p className="text-sm font-medium">Ime podjetja</p>
          <input
            placeholder="Vnesi ime podjetja"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.companyName}
            disabled={!isEdit}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="">
          <p className="text-sm font-medium">Davčna številka</p>
          <input
            placeholder="Vnesi davčno številko"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.companyTaxNo}
            disabled={!isEdit}
            onChange={(e) => setTaxNumber(e.target.value)}
          />
        </div>
        <button
          className="bg-primary h-fit cursor-pointer rounded-lg px-4 py-1.5 font-semibold"
          onClick={handleClick}
        >
          {isEdit ? "Shrani" : "Spremeni podatke"}
        </button>
        <div className="">
          <p className="text-sm font-medium">Naslov podjetja</p>
          <input
            placeholder="Vnesi naslov podjetja"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.companyAddress}
            disabled={!isEdit}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="">
          <p className="text-sm font-medium">Kraj sedeža</p>
          <input
            placeholder="Vnesi kraj sedeža"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.companyCity}
            disabled={!isEdit}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="">
          <p className="text-sm font-medium">Poštna številka</p>
          <input
            placeholder="Vnesi poštno številko"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={data?.data.companyPostalCode}
            disabled={!isEdit}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Dates({ dispatch }: { dispatch: Dispatch<Action> }) {
  return (
    <div className="grid gap-x-5 gap-y-10">
      <div>
        <p>Datum izdaje</p>
        <div className="rounded-xl bg-white px-5 py-6">
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            defaultValue={new Intl.DateTimeFormat("sv-SE").format(new Date())}
            onChange={(e) =>
              dispatch({ type: "preInvoiceDate", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <p>Rok plačila</p>
        <div className="rounded-xl bg-white px-5 py-6">
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
            onChange={(e) =>
              dispatch({ type: "paymentDueDate", payload: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

function Articles({
  state,
  dispatch,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
}) {
  const [articlesNo, setArticlesNo] = useState(1);

  return (
    <>
      <div className="col-span-2">
        <p>Seznam artiklov</p>
        <div className="flex flex-col gap-4 rounded-xl bg-white px-8 py-9">
          {Array.from({ length: articlesNo }).map((_, i) => (
            <ArticleCard
              key={(i + 1) * 10}
              dispatch={dispatch}
              i={i}
              state={state}
              setArticlesNo={setArticlesNo}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ArticleCard({
  state,
  dispatch,
  setArticlesNo,
  i,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
  setArticlesNo: Dispatch<SetStateAction<number>>;
  i: number;
}) {
  const [isOpenArticles, setIsOpenArticles] = useState(false);
  const article = state.articles[i];

  const { data, isLoading } = useQuery({
    queryKey: ["article", article?.articleId],
    queryFn: () => getOneArticle(article!.articleId),
    enabled: !!article,
  });

  if (isLoading) {
    return <p>...</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-5">
        <div className="flex items-center gap-1">
          {!article ? (
            <PlusCircleIcon
              className="w-5 flex-none cursor-pointer stroke-2"
              onClick={() => setIsOpenArticles(true)}
            />
          ) : (
            <XCircleIcon
              className="w-5 flex-none cursor-pointer stroke-2"
              onClick={() => {
                setArticlesNo((articleNo) =>
                  articleNo > 1 ? articleNo - 1 : 1,
                );
                dispatch({ type: "removeArticle", payload: data.article._id });
              }}
            />
          )}
          <input
            placeholder="Ime artikla"
            className="w-80 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
            disabled
            defaultValue={data?.article.name.sl}
          />
        </div>
        <input
          type="number"
          placeholder="Količina"
          className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
          defaultValue={state.articles[i]?.quantity || ""}
          onChange={(e) =>
            dispatch({
              type: "articles",
              payload: {
                articleId: data.article._id,
                quantity: Number(e.target.value),
              },
            })
          }
        />
        <input
          placeholder="Cena"
          className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
          disabled
          value={
            data
              ? new Intl.NumberFormat("sl-SI", {
                  style: "currency",
                  currency: "EUR",
                }).format(
                  data.article.priceDDV * (state.articles[i]?.quantity || 1),
                )
              : ""
          }
        />
        <input
          placeholder="DDV %"
          className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
          disabled
          defaultValue={
            data
              ? new Intl.NumberFormat("sl-SI", {
                  style: "percent",
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }).format(data.article.taxRate)
              : ""
          }
        />
        <input
          placeholder="Popust %"
          type="number"
          className="w-40 rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none"
          onChange={(e) =>
            dispatch({
              type: "articles",
              payload: {
                articleId: data.article._id,
                discount: Number(e.target.value) / 100,
              },
            })
          }
        />
        <button
          className="bg-gray drop-shadow-btn hover:bg-gray-90 flex cursor-pointer items-center gap-2 rounded-lg px-4 py-1.5 font-semibold transition-colors duration-150"
          onClick={() => setArticlesNo((articleNo) => articleNo + 1)}
        >
          <PlusCircleIcon className="w-5 stroke-2" />
          Dodaj
        </button>
      </div>
      {isOpenArticles && (
        <PickArticle
          setIsOpenArticles={setIsOpenArticles}
          dispatch={dispatch}
        />
      )}
    </>
  );
}

function PickArticle({
  dispatch,
  setIsOpenArticles,
}: {
  dispatch: Dispatch<Action>;
  setIsOpenArticles: Dispatch<SetStateAction<boolean>>;
}) {
  const { data, isPending } = useQuery({
    queryKey: ["articles"],
    queryFn: () => getArticles({}),
  });

  function handleClick(id: string) {
    dispatch({ type: "articles", payload: { articleId: id, quantity: 1 } });

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
                Dodaj med artikle
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function EndPart({
  state,
  dispatch,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
}) {
  const { data } = useQuery({
    queryKey: ["buyer", state.buyer],
    queryFn: () => getOneUser(state.buyer!),
    enabled: !!state.buyer,
  });

  const results = useQueries({
    queries: state.articles.map((a) => ({
      queryKey: ["article", a.articleId],
      queryFn: () => getOneArticle(a.articleId),
      enabled: !!a.articleId,
    })),
  });

  const total = results.reduce((sum, result, i) => {
    const a = state.articles[i];
    const article = result.data?.article;

    if (!a || !article) return sum;

    const quantity = a.quantity || 1;
    const discount = a.discount || 0;
    const price = article.priceDDV;

    return sum + quantity * price * (1 - discount);
  }, 0);

  return (
    <div className="col-span-2 grid grid-cols-3 gap-x-5">
      <div>
        <p>Elektronski naslov za pošiljanje</p>
        <div className="rounded-xl bg-white px-5 py-6">
          <input
            placeholder="Vnesi elektronski naslov"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            disabled={state.category === "person" ? !!state.buyer : false}
            defaultValue={
              state.category === "person"
                ? data?.data.email || ""
                : state.company?.email
            }
            onChange={(e) => {
              if (state.category === "person") {
                dispatch({ type: "recepient.mail", payload: e.target.value });
              } else {
                dispatch({ type: "company.mail", payload: e.target.value });
              }
            }}
          />
        </div>
      </div>{" "}
      <div />
      <div>
        <p>Skupni znesek (z DDV)</p>
        <div className="rounded-xl bg-white px-5 py-6">
          <input
            placeholder="Skupaj za plačilo"
            className="w-full rounded-lg border border-gray-300 px-3 py-1.5 shadow-xs outline-none disabled:cursor-not-allowed"
            disabled
            value={new Intl.NumberFormat("sl-SI", {
              style: "currency",
              currency: "EUR",
            }).format(total)}
          />
        </div>
      </div>
    </div>
  );
}

export default CreatePreInvoiceForm;
