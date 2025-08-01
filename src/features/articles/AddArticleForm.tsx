import { ChevronDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useReducer, useState, type Dispatch, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { createArticle } from "../../services/articlesAPI";

const categories = [
  { name: "Vstopnice", label: "V" },
  { name: "Vodene vadbe", label: "VV" },
  { name: "Aktivnosti", label: "A" },
  { name: "Ostalo", label: "O" },
];

const ageGroups = [
  { name: "Odrasli", ageGroup: "adult" },
  { name: "15 - 25 let", ageGroup: "student" },
  { name: "6 - 14 let", ageGroup: "school" },
  { name: "3 - 5 let", ageGroup: "preschool" },
];

interface IInitialState {
  label: string;
  name: { sl: string; en: string };
  ageGroup: string[];
  type?: string;
  morning: boolean;
  activationDuration?: string;
  hiddenUsers: boolean;
  hiddenReception: boolean;
  duration?: string;
  visits?: string;
  gift: boolean;
  priceDDV: string;
  taxRate: string;
  noClasses?: string;
  startDate?: string;
  endDate?: string;
  isLoading: boolean;
}

const initialState: IInitialState = {
  label: "V",
  name: { sl: "", en: "" },
  ageGroup: [],
  type: undefined,
  morning: false,
  activationDuration: undefined,
  hiddenUsers: true,
  hiddenReception: true,
  duration: undefined,
  visits: undefined,
  gift: false,
  priceDDV: "",
  taxRate: "",
  noClasses: undefined,
  startDate: undefined,
  endDate: undefined,
  isLoading: false,
};

type Action =
  | { type: "label"; payload: string }
  | { type: "namesl"; payload: string }
  | { type: "nameen"; payload: string }
  | { type: "ageGroup"; payload: string }
  | { type: "type"; payload: string }
  | { type: "morning"; payload: boolean }
  | { type: "activationDuration"; payload: string }
  | { type: "hiddenUsers"; payload: boolean }
  | { type: "hiddenReception"; payload: boolean }
  | { type: "duration"; payload: string }
  | { type: "visits"; payload: string }
  | { type: "gift"; payload: boolean }
  | { type: "priceDDV"; payload: string }
  | { type: "taxRate"; payload: string }
  | { type: "noClasses"; payload: string }
  | { type: "startDate"; payload: string }
  | { type: "endDate"; payload: string }
  | { type: "success" }
  | { type: "loading"; payload: boolean };

function reducer(state: IInitialState, action: Action) {
  switch (action.type) {
    case "label":
      return { ...state, label: action.payload };
    case "namesl":
      return { ...state, name: { ...state.name, sl: action.payload } };
    case "nameen":
      return { ...state, name: { ...state.name, en: action.payload } };
    case "ageGroup":
      return {
        ...state,
        ageGroup: state.ageGroup.includes(action.payload)
          ? state.ageGroup.filter((aG) => aG !== action.payload)
          : [...state.ageGroup, action.payload],
      };
    case "type":
      return {
        ...state,
        type: action.payload === state.type ? "" : action.payload,
      };
    case "morning":
      return { ...state, morning: action.payload };
    case "activationDuration":
      return { ...state, activationDuration: action.payload };
    case "hiddenUsers":
      return { ...state, hiddenUsers: action.payload };
    case "hiddenReception":
      return { ...state, hiddenReception: action.payload };
    case "duration":
      return { ...state, duration: action.payload, visits: "" };
    case "visits":
      return { ...state, visits: action.payload, duration: "" };
    case "gift":
      return { ...state, gift: action.payload };
    case "priceDDV":
      return { ...state, priceDDV: action.payload };
    case "taxRate":
      return { ...state, taxRate: (Number(action.payload) / 100).toString() };
    case "noClasses":
      return { ...state, noClasses: action.payload };
    case "startDate":
      return { ...state, startDate: action.payload };
    case "endDate":
      return { ...state, endDate: action.payload };
    case "success":
      return { ...initialState };
    case "loading":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

function AddArticleForm() {
  const navigate = useNavigate();

  const [
    {
      label,
      name,
      ageGroup,
      type,
      morning,
      activationDuration,
      hiddenUsers,
      hiddenReception,
      duration,
      visits,
      gift,
      priceDDV,
      taxRate,
      noClasses,
      startDate,
      endDate,
      isLoading,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  async function handleClick(e: FormEvent<HTMLButtonElement>) {
    try {
      e.preventDefault();
      dispatch({ type: "loading", payload: true });

      await createArticle({
        label,
        name,
        ageGroup,
        type,
        morning,
        activationDuration,
        hiddenUsers,
        hiddenReception,
        duration,
        visits,
        gift,
        priceDDV,
        taxRate,
        noClasses,
        startDate,
        endDate,
      });

      dispatch({ type: "success" });
      navigate("/dashboard/articles");
    } catch (error) {
      console.error(error);
    }
    {
      dispatch({ type: "loading", payload: false });
    }
  }

  return (
    <form className="grid grid-cols-2 gap-x-5 gap-y-8">
      <div className="col-span-2 flex items-center justify-between">
        <p className="text-3xl font-semibold">Ustvari nov artikel</p>
        <div className="outline-gray grid grid-cols-[190px_190px_190px_190px] rounded-lg bg-white px-2 py-1 shadow-xs outline">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className={`h-8 w-full cursor-pointer rounded-lg ${label === cat.label ? "outline-secondary bg-primary/55 shadow-xs outline" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "label", payload: cat.label });
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <BasicInfo
        label={label}
        ageGroup={ageGroup}
        type={type}
        morning={morning}
        noClasses={noClasses}
        dispatch={dispatch}
      />
      <div className="flex flex-col gap-9">
        <Visibility
          hiddenReception={hiddenReception}
          hiddenUsers={hiddenUsers}
          dispatch={dispatch}
        />
        {label === "VV" && <ClassDuration dispatch={dispatch} />}
        {label === "V" && type !== "dnevna" && (
          <Visits type={type} dispatch={dispatch} />
        )}
        {label !== "VV" && <Gift gift={gift} dispatch={dispatch} />}
      </div>
      <Price priceDDV={priceDDV} taxRate={taxRate} dispatch={dispatch} />
      <button
        className="from-primary to-secondary drop-shadow-btn hover:to-primary col-span-2 flex cursor-pointer items-center gap-4 justify-self-end rounded-lg bg-gradient-to-r px-6 py-2 font-semibold transition-colors duration-300 disabled:cursor-pointer disabled:from-gray-400 disabled:to-gray-400"
        disabled={isLoading}
        onClick={handleClick}
      >
        <PlusCircleIcon className="h-5 stroke-2" />
        Shrani in ustvari nov artikel
      </button>
    </form>
  );
}

function BasicInfo({
  label,
  ageGroup,
  type,
  morning,
  noClasses,
  dispatch,
}: {
  label: string;
  ageGroup: string[];
  type?: string;
  morning: boolean;
  noClasses?: string;
  dispatch: Dispatch<Action>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSub, setIsOpenSub] = useState(false);

  return (
    <div>
      <p>Osnovne informacije</p>
      <div className="flex flex-col gap-10 rounded-xl bg-white p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ime artikla (slovensko)</p>
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi slovensko ime artikla"
            onChange={(e) =>
              dispatch({ type: "namesl", payload: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ime artikla (angleško)</p>
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi angleško ime artikla"
            onChange={(e) =>
              dispatch({ type: "nameen", payload: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="relative flex flex-col gap-1">
            <p className="text-sm font-medium">Starostna skupina</p>
            <input
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
              placeholder="Izberi starostno skupino"
              disabled
              value={ageGroup.join(", ")}
            />
            <ChevronDownIcon
              className={`absolute right-4 bottom-3 w-5 cursor-pointer stroke-2 ${isOpen ? "rotate-180" : ""}`}
              onClick={() => setIsOpen((isOpen) => !isOpen)}
            />
            {isOpen && (
              <div className="absolute top-[110%] left-0 flex w-full flex-col gap-2 rounded-lg border border-black/20 bg-white px-4 py-2 shadow-xs">
                {ageGroups.map((aG) => (
                  <div key={aG.ageGroup} className="flex items-center gap-2">
                    <span
                      className={`h-6 w-6 cursor-pointer rounded-lg border border-black/50 ${ageGroup.includes(aG.ageGroup) ? "bg-primary/50" : ""}`}
                      onClick={() =>
                        dispatch({ type: "ageGroup", payload: aG.ageGroup })
                      }
                    ></span>
                    {aG.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {label === "V" && (
            <div className="relative flex flex-col gap-1">
              <p className="text-sm font-medium">Podkategorija</p>
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
                placeholder="Izberi podkategorijo"
                disabled
                value={type}
              />
              <ChevronDownIcon
                className={`absolute right-4 bottom-3 w-5 cursor-pointer stroke-2 ${isOpenSub ? "rotate-180" : ""}`}
                onClick={() => setIsOpenSub((isOpen) => !isOpen)}
              />
              {isOpenSub && (
                <div className="absolute top-[110%] left-0 flex w-full flex-col gap-2 rounded-lg border border-black/20 bg-white px-4 py-2 shadow-xs">
                  {["dnevna", "terminska", "paket"].map((typeOption, i) => (
                    <div key={i} className="flex items-center gap-2 capitalize">
                      <span
                        className={`h-6 w-6 cursor-pointer rounded-lg border border-black/50 ${type === typeOption ? "bg-primary/50" : ""}`}
                        onClick={() =>
                          dispatch({ type: "type", payload: typeOption })
                        }
                      ></span>
                      {typeOption}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {label === "VV" && (
            <div className="flex flex-col gap-1 justify-self-end">
              <p className="text-sm font-medium">Število tedenskih vadb</p>
              <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${noClasses === "1" ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "noClasses", payload: "1" });
                  }}
                >
                  1
                </button>
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${noClasses === "2" ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "noClasses", payload: "2" });
                  }}
                >
                  2
                </button>
              </div>
            </div>
          )}
        </div>
        {label === "V" && (
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Dopoldanska</p>
              <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${morning ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "morning", payload: true });
                  }}
                >
                  DA
                </button>
                <button
                  className={`h-8 w-full cursor-pointer rounded-lg ${!morning ? "outline-secondary bg-primary/55 outline-2" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "morning", payload: false });
                  }}
                >
                  NE
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Čas za aktivacijo</p>
              <input
                type="number"
                className="w-35 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
                placeholder="365 dni"
                onChange={(e) =>
                  dispatch({
                    type: "activationDuration",
                    payload: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Visibility({
  hiddenReception,
  hiddenUsers,
  dispatch,
}: {
  hiddenReception: boolean;
  hiddenUsers: boolean;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div>
      <p>Vidnost</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="flex items-center gap-2">
          <p>Vidno v blagajni</p>
          <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${!hiddenReception ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "hiddenReception", payload: false });
              }}
            >
              DA
            </button>
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${hiddenReception ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "hiddenReception", payload: true });
              }}
            >
              NE
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p>Vidno uporabnikom</p>
          <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${!hiddenUsers ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "hiddenUsers", payload: false });
              }}
            >
              DA
            </button>
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${hiddenUsers ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "hiddenUsers", payload: true });
              }}
            >
              NE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Visits({
  type,
  dispatch,
}: {
  type?: string;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div>
      <p>Število obiskov</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
          <p
            className={`outline-secondary bg-primary/55 w-full rounded-lg px-6 py-1 outline-2`}
          >
            {type === "paket" ? "Število obiskov" : "Trajanje"}
          </p>
        </div>
        <input
          type="number"
          className="w-35 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
          placeholder={type === "terminska" ? "Št. dni" : "Št. obiskov"}
          onChange={(e) =>
            dispatch({
              type: type === "terminska" ? "duration" : "visits",
              payload: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

function ClassDuration({ dispatch }: { dispatch: Dispatch<Action> }) {
  return (
    <div>
      <p>Darilni bon</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Datum začetka</p>
          <input
            type="date"
            className="w-44 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi ceno(€)"
            onChange={(e) =>
              dispatch({ type: "startDate", payload: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Datum zaključka</p>
          <input
            type="date"
            className="w-44 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi ceno(€)"
            onChange={(e) =>
              dispatch({ type: "endDate", payload: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

function Gift({
  gift,
  dispatch,
}: {
  gift: boolean;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div>
      <p>Darilni bon</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="flex items-center gap-8">
          <p>Artikel je darilni bon</p>
          <div className="grid grid-cols-[64px_64px] rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-xs">
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${gift ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "gift", payload: true });
              }}
            >
              DA
            </button>
            <button
              className={`h-8 w-full cursor-pointer rounded-lg ${!gift ? "outline-secondary bg-primary/55 outline-2" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "gift", payload: false });
              }}
            >
              NE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Price({
  priceDDV,
  taxRate,
  dispatch,
}: {
  priceDDV: string;
  taxRate: string;
  dispatch: Dispatch<Action>;
}) {
  return (
    <div className="col-span-2 w-7/12">
      <p>Cena artikla</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Cena z DDV(€)</p>
          <input
            type="number"
            className="w-44 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi ceno(€)"
            onChange={(e) =>
              dispatch({ type: "priceDDV", payload: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">DDV vrednost(%)</p>
          <input
            type="number"
            className="w-44 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi DDV(%)"
            onChange={(e) =>
              dispatch({ type: "taxRate", payload: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Cena brez DDV(€)</p>
          <input
            type="number"
            className="w-44 rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="0"
            disabled
            value={(Number(priceDDV) / (Number(taxRate) + 1)).toFixed(2)}
          />
        </div>
      </div>
    </div>
  );
}

export default AddArticleForm;
