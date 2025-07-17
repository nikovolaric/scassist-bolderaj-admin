import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useQueries } from "@tanstack/react-query";
import type { Dispatch } from "react";
import { useReducer, useState } from "react";
import { getAllUsers } from "../../services/userAPI";
import { getArticles } from "../../services/articlesAPI";

interface IInitialState {
  category: string;
  className: { sl: string; en: string };
  ageGroup: string[];
  coach: string;
  coachName: string;
  articles: { id: string; name: string }[];
  maxStudents: string;
  hiddenUsers: boolean;
  hiddenReception: boolean;
  time: string[];
  dates: string[];
}

type Action =
  | { type: "category"; payload: string }
  | { type: "className.sl"; payload: string }
  | { type: "className.en"; payload: string }
  | { type: "ageGroup"; payload: string }
  | { type: "coach"; payload: string }
  | { type: "coachName"; payload: string }
  | { type: "articles"; payload: { id: string; name: string } }
  | { type: "maxStudents"; payload: string }
  | { type: "hiddenUsers"; payload: boolean }
  | { type: "hiddenReception"; payload: boolean }
  | { type: "time"; payload: { start?: string; end?: string } }
  | { type: "dates"; payload: string };

const ageGroups = [
  { name: "Odrasli", ageGroup: "adult" },
  { name: "15 - 25 let", ageGroup: "student" },
  { name: "6 - 14 let", ageGroup: "school" },
  { name: "3 - 5 let", ageGroup: "preschool" },
];

const initialState: IInitialState = {
  category: "VV",
  className: { sl: "", en: "" },
  ageGroup: [],
  coach: "",
  coachName: "",
  articles: [],
  maxStudents: "",
  hiddenUsers: true,
  hiddenReception: true,
  time: ["", ""],
  dates: [],
};

function reducer(state: IInitialState, action: Action): IInitialState {
  switch (action.type) {
    case "category": {
      return { ...state, category: action.payload };
    }
    case "className.sl": {
      return {
        ...state,
        className: { ...state.className, sl: action.payload },
      };
    }
    case "className.en": {
      return {
        ...state,
        className: { ...state.className, en: action.payload },
      };
    }
    case "ageGroup": {
      if (state.ageGroup.includes(action.payload)) {
        return {
          ...state,
          ageGroup: state.ageGroup.filter((el) => el !== action.payload),
        };
      } else {
        return { ...state, ageGroup: [...state.ageGroup, action.payload] };
      }
    }
    case "coach": {
      if (!state.coach) {
        return { ...state, coach: action.payload };
      } else {
        return { ...state, coach: "" };
      }
    }
    case "coachName": {
      if (!state.coachName) {
        return { ...state, coachName: action.payload };
      } else {
        return { ...state, coachName: "" };
      }
    }
    case "articles": {
      if (state.articles.find((el) => el.id === action.payload.id)) {
        return {
          ...state,
          articles: state.articles.filter((el) => el.id !== action.payload.id),
        };
      } else {
        return { ...state, articles: [...state.articles, action.payload] };
      }
    }
    case "maxStudents": {
      return { ...state, maxStudents: action.payload };
    }
    case "hiddenUsers":
      return { ...state, hiddenUsers: action.payload };
    case "hiddenReception":
      return { ...state, hiddenReception: action.payload };
    case "time": {
      if (action.payload.start) {
        return { ...state, time: state.time.fill(action.payload.start, 0) };
      }
      if (action.payload.end) {
        return { ...state, time: state.time.fill(action.payload.end, 1) };
      }
      return state;
    }
    case "dates": {
      return { ...state, dates: [action.payload] };
    }
  }
}

function CreateClassForm() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { category } = state;

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">Ustvari novo skupino</p>
        <div className="flex w-100 items-center rounded-lg bg-white px-2 py-1 shadow-xs">
          <button
            className={`w-1/2 flex-none cursor-pointer py-1 text-center ${category === "VV" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
            onClick={() => {
              dispatch({ type: "category", payload: "VV" });
            }}
          >
            Vodene vadbe
          </button>
          <button
            className={`w-1/2 flex-none cursor-pointer py-1 text-center ${category === "A" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
            onClick={() => {
              dispatch({ type: "category", payload: "A" });
            }}
          >
            Aktivnosti
          </button>
        </div>
      </div>
      <form className="grid grid-cols-2 gap-x-5">
        <BasicInfo state={state} dispatch={dispatch} />
        <div className="flex flex-col gap-6">
          <Visibility state={state} dispatch={dispatch} />
          <Dates state={state} dispatch={dispatch} />
        </div>
      </form>
    </>
  );
}

function BasicInfo({
  state,
  dispatch,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
}) {
  const { ageGroup, coachName, coach, category, articles } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCoaches, setIsOpenCoaches] = useState(false);
  const [isOpenArticles, setIsOpenArticles] = useState(false);

  const [
    { data: usersData, isPending: pendingUser },
    { data: articlesData, isPending: pendingArticles },
  ] = useQueries({
    queries: [
      {
        queryKey: ["coaches"],
        queryFn: () => getAllUsers({ roles: ["coach"] }),
        enabled: isOpenCoaches,
      },
      {
        queryKey: ["articles", category],
        queryFn: () => getArticles({ label: category }),
      },
    ],
  });

  return (
    <div>
      <p>Osnovne informacije</p>
      <div className="flex flex-col gap-10 rounded-xl bg-white p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ime skupine (slovensko)</p>
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi slovensko ime artikla"
            onChange={(e) =>
              dispatch({ type: "className.sl", payload: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Ime skupine (angleško)</p>
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
            placeholder="Vnesi angleško ime artikla"
            onChange={(e) =>
              dispatch({ type: "className.en", payload: e.target.value })
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
              <div className="absolute top-[110%] left-0 z-50 flex w-full flex-col gap-2 rounded-lg border border-black/20 bg-white px-4 py-2 shadow-xs">
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
          <div className="relative flex flex-col gap-1">
            <p className="text-sm font-medium">Trener skupine</p>
            <input
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
              placeholder="Izberi trenerja"
              disabled
              value={coachName}
            />
            <ChevronDownIcon
              className={`absolute right-4 bottom-3 w-5 cursor-pointer stroke-2 ${isOpenCoaches ? "rotate-180" : ""}`}
              onClick={() => setIsOpenCoaches((isOpen) => !isOpen)}
            />
            {isOpenCoaches && (
              <div className="absolute top-[110%] left-0 flex w-full flex-col gap-4 rounded-lg border border-black/20 bg-white px-4 py-2 shadow-xs">
                {pendingUser ? (
                  <p>...</p>
                ) : (
                  usersData.users.map(
                    (user: { _id: string; fullName: string }) => (
                      <div key={user._id} className="flex items-center gap-2">
                        <span
                          className={`h-6 w-6 cursor-pointer rounded-lg border border-black/50 ${coach === user._id ? "bg-primary/50" : ""}`}
                          onClick={() => {
                            dispatch({ type: "coach", payload: user._id });
                            dispatch({
                              type: "coachName",
                              payload: user.fullName,
                            });
                          }}
                        ></span>
                        {user.fullName}
                      </div>
                    ),
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[3fr_1fr] gap-x-5">
          <div className="relative flex flex-col gap-1">
            <p className="text-sm font-medium">Artikli</p>
            <input
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
              placeholder="Izberi artikle"
              disabled
              value={articles.map((a) => a.name).join(", ")}
            />
            <ChevronDownIcon
              className={`absolute right-4 bottom-3 w-5 cursor-pointer stroke-2 ${isOpenArticles ? "rotate-180" : ""}`}
              onClick={() => setIsOpenArticles((isOpen) => !isOpen)}
            />
            {isOpenArticles && (
              <div className="absolute top-[110%] left-0 flex w-full flex-col gap-4 rounded-lg border border-black/20 bg-white px-4 py-2 shadow-xs">
                {pendingArticles ? (
                  <p>...</p>
                ) : (
                  articlesData.articles.map(
                    (article: { _id: string; name: { sl: string } }) => (
                      <div
                        key={article._id}
                        className="flex items-center gap-2"
                      >
                        <span
                          className={`h-6 w-6 cursor-pointer rounded-lg border border-black/50 ${articles.find((a) => a.id === article._id) ? "bg-primary/50" : ""}`}
                          onClick={() =>
                            dispatch({
                              type: "articles",
                              payload: {
                                id: article._id,
                                name: article.name.sl,
                              },
                            })
                          }
                        ></span>
                        {article.name.sl}
                      </div>
                    ),
                  )
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Max št. učencev</p>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
              placeholder="Vnesi št. učencev"
              onChange={(e) =>
                dispatch({ type: "maxStudents", payload: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Visibility({
  state,
  dispatch,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
}) {
  const { hiddenReception, hiddenUsers } = state;

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

function Dates({
  state,
  dispatch,
}: {
  state: IInitialState;
  dispatch: Dispatch<Action>;
}) {
  console.log(state);

  return (
    <div>
      <p>Termin izvedbe</p>
      <div className="flex items-center justify-between rounded-xl bg-white p-8">
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Max št. učencev</p>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs outline-none"
              placeholder="Vnesi št. učencev"
              onChange={(e) =>
                dispatch({ type: "maxStudents", payload: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateClassForm;
