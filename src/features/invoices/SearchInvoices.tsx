import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  CircleArrowDown,
  CircleArrowUp,
  CirclePlusIcon,
  ListFilter,
} from "lucide-react";
import { useReducer, useState, type Dispatch } from "react";
import InvoicesList from "./InvoicesList";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../components/Spinner";
import { getAllInvoices } from "../../services/invoicesAPI";
import { getAllPreinvoices } from "../../services/preInvoicesAPI";
import PreInvoicesList from "./PreInvoicesList";

interface IInitialState {
  q: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  dateFromDone: string;
  dateToDone: string;
  issuer: string;
  totalAmount: string;
  paymentMethod: string;
  label: string;
  article: string;
  buyer: string;
  taxNo: string;
  isOpenFilter: boolean;
}

type Action =
  | { type: "q"; payload: string }
  | { type: "category"; payload: string }
  | { type: "dateFrom"; payload: string }
  | { type: "dateTo"; payload: string }
  | { type: "dateFromDone"; payload: string }
  | { type: "dateToDone"; payload: string }
  | { type: "issuer"; payload: string }
  | { type: "totalAmount"; payload: string }
  | { type: "paymentMethod"; payload: string }
  | { type: "label"; payload: string }
  | { type: "article"; payload: string }
  | { type: "buyer"; payload: string }
  | { type: "taxNo"; payload: string }
  | { type: "setIsOpenFilter"; payload: boolean }
  | { type: "reset" };

const initialState: IInitialState = {
  q: "",
  category: "invoices",
  dateFrom: "",
  dateTo: "",
  dateFromDone: "",
  dateToDone: "",
  issuer: "",
  totalAmount: "",
  paymentMethod: "",
  label: "",
  article: "",
  buyer: "",
  taxNo: "",
  isOpenFilter: false,
};

function reducer(state: IInitialState, action: Action): IInitialState {
  switch (action.type) {
    case "q":
      return { ...state, q: action.payload };
    case "category":
      return {
        ...state,
        category: action.payload,
      };
    case "dateFrom":
      return {
        ...state,
        dateFrom: action.payload,
      };
    case "dateTo":
      return {
        ...state,
        dateTo: action.payload,
      };
    case "dateFromDone":
      return {
        ...state,
        dateFromDone: action.payload,
      };
    case "dateToDone":
      return {
        ...state,
        dateToDone: action.payload,
      };
    case "issuer":
      return {
        ...state,
        issuer: action.payload,
      };
    case "totalAmount":
      return {
        ...state,
        totalAmount: action.payload,
      };
    case "paymentMethod":
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case "label":
      return {
        ...state,
        label: action.payload,
      };
    case "article":
      return {
        ...state,
        article: action.payload,
      };
    case "buyer":
      return {
        ...state,
        buyer: action.payload,
      };
    case "taxNo":
      return {
        ...state,
        taxNo: action.payload,
      };
    case "setIsOpenFilter":
      return {
        ...state,
        isOpenFilter: action.payload,
      };
    case "reset":
      return initialState;
  }
}

function SearchInvoices() {
  const [
    {
      q,
      category,
      dateFrom,
      dateTo,
      dateFromDone,
      dateToDone,
      issuer,
      totalAmount,
      paymentMethod,
      label,
      article,
      buyer,
      taxNo,
      isOpenFilter,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [page, setPage] = useState(1);

  const [
    { data: invoiceData, isPending: isPendingInvoices },
    { data: preinvoiceData, isPending: isPendingPreinvoices },
  ] = useQueries({
    queries: [
      {
        queryKey: ["invoices", q, page],
        queryFn: () =>
          getAllInvoices({
            q,
            page,
            dateFrom,
            dateTo,
            dateFromDone,
            dateToDone,
            issuer,
            totalAmount,
            paymentMethod,
            label,
            article,
            buyer,
            taxNo,
          }),
        enabled: category === "invoices",
      },
      {
        queryKey: ["preinvoices", q, page],
        queryFn: () => getAllPreinvoices(q, page),
        enabled: category === "preinvoices",
      },
    ],
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-semibold">
          Pregled izdanih {category === "invoices" ? "računov" : "predračunov"}
        </p>
        <div className="flex w-100 items-center rounded-lg bg-white px-2 py-1 shadow-xs">
          <button
            className={`w-1/2 flex-none cursor-pointer py-1 text-center ${category === "invoices" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
            onClick={() => {
              setPage(1);
              dispatch({ type: "category", payload: "invoices" });
            }}
          >
            Računi
          </button>
          <button
            className={`w-1/2 flex-none cursor-pointer py-1 text-center ${category === "preinvoices" ? "outline-secondary bg-neutral/50 rounded-lg shadow-xs outline-2" : ""}`}
            onClick={() => {
              setPage(1);
              dispatch({ type: "category", payload: "preinvoices" });
            }}
          >
            Predračuni
          </button>
        </div>
      </div>
      <Filter
        category={category}
        dispatch={dispatch}
        isOpenFilter={isOpenFilter}
      />
      {category === "invoices" && isPendingInvoices && <Spinner />}
      {category === "invoices" && invoiceData && !isPendingInvoices && (
        <InvoicesList
          invoices={invoiceData.invoices}
          page={page}
          setPage={setPage}
        />
      )}
      {category === "preinvoices" && isPendingPreinvoices && <Spinner />}
      {category === "preinvoices" &&
        preinvoiceData &&
        !isPendingPreinvoices && (
          <PreInvoicesList
            preinvoices={preinvoiceData.preinvoices}
            page={page}
            setPage={setPage}
          />
        )}
    </>
  );
}

function Filter({
  category,
  dispatch,
  isOpenFilter,
}: {
  category: string;
  dispatch: Dispatch<Action>;
  isOpenFilter: boolean;
}) {
  return (
    <>
      <div className="relative grid grid-cols-[12fr_3fr_3fr_4fr] gap-x-5">
        <div className="drop-shadow-input border-gray/75 flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <MagnifyingGlassIcon className="h-4 stroke-3" />
          <input
            placeholder={`Išči po ${category === "invoices" ? "številki računa (npr. BLAGO-1)" : "referenci ali prejemniku"}`}
            className="w-full outline-none"
            onChange={(e) => dispatch({ type: "q", payload: e.target.value })}
          />
        </div>
        {category === "invoices" && (
          <button
            className="drop-shadow-btn hover:bg-gray/50 bg-gray/80 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1 font-semibold transition-colors duration-300"
            onClick={() =>
              dispatch({ type: "setIsOpenFilter", payload: !isOpenFilter })
            }
          >
            <ListFilter height={20} />
            Filter
          </button>
        )}
        {category === "preinvoices" && (
          <button className="drop-shadow-btn hover:bg-gray/50 bg-gray/80 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1 font-semibold transition-colors duration-300">
            <CircleArrowUp height={20} />
            Uvozi iz OTP
          </button>
        )}
        <button className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-1 font-semibold transition-colors duration-300">
          <CircleArrowDown height={20} />
          Izvozi v excel
        </button>
        <button className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-1 font-semibold transition-colors duration-300">
          <CirclePlusIcon height={20} /> Ustvari nov{" "}
          {category === "invoices" ? "račun" : "predračun"}
        </button>
      </div>
      {isOpenFilter && <FilterOptions dispatch={dispatch} />}
    </>
  );
}

function FilterOptions({ dispatch }: { dispatch: Dispatch<Action> }) {
  const queryClient = useQueryClient();

  return (
    <div className="grid grid-cols-4 gap-16 rounded-xl bg-white px-8 py-10">
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">
          Datum izdaje računa (od-do)
        </label>
        <div className="flex gap-1">
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-1.5 py-2.5 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "dateFrom", payload: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-1.5 py-1 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "dateTo", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">
          Datum opravljene storitve (od-do)
        </label>
        <div className="flex gap-1">
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-1.5 py-2.5 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "dateFromDone", payload: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-1.5 py-2.5 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "dateToDone", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Zaposleni</label>
        <div className="flex gap-1">
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            placeholder="Vnesi zaposlenega"
            onChange={(e) =>
              dispatch({ type: "issuer", payload: e.target.value })
            }
          />
        </div>
      </div>{" "}
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Znesek</label>
        <div className="flex gap-1">
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            placeholder="Vnesi znesek"
            onChange={(e) =>
              dispatch({ type: "totalAmount", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Način plačila</label>
        <div className="flex gap-1">
          <select
            className="w-full cursor-pointer rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "paymentMethod", payload: e.target.value })
            }
          >
            <option value="">Izberi način plačila</option>
            <option value="gotovina">Gotovina</option>
            <option value="card">Kartica</option>
            <option value="online">Spletno plačilo</option>
            <option value="paypal">Paypal</option>
            <option value="nakazilo">Nakazilo</option>
          </select>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Kategorija artikla</label>
        <div className="flex gap-1">
          <select
            className="w-full cursor-pointer rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            onChange={(e) =>
              dispatch({ type: "label", payload: e.target.value })
            }
          >
            <option value="">Izberi kategorijo artikla</option>
            <option value="V">Vstopnica</option>
            <option value="VV">Vodena vadba</option>
            <option value="A">Aktivnost</option>
            <option value="O">Ostalo</option>
          </select>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Artikel</label>
        <div className="flex gap-1">
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            placeholder="Vnesi ime artikla"
            onChange={(e) =>
              dispatch({ type: "article", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Stranka</label>
        <div className="flex gap-1">
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            placeholder="Vnesi ime in priimek stranke"
            onChange={(e) =>
              dispatch({ type: "buyer", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <label className="text-sm font-medium">Davčna številka</label>
        <div className="flex gap-1">
          <input
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 shadow-xs"
            placeholder="Vnesi davčno številko"
            onChange={(e) =>
              dispatch({ type: "taxNo", payload: e.target.value })
            }
          />
        </div>
      </div>
      <div />
      <div className="col-span-2 flex items-center gap-5 justify-self-end">
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-2 font-semibold transition-colors duration-300"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            dispatch({ type: "setIsOpenFilter", payload: false });
          }}
        >
          Išči po računih
        </button>
        <button
          className="drop-shadow-btn hover:bg-gray/50 bg-gray/80 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors duration-300"
          onClick={() => {
            dispatch({ type: "reset" });
            setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["invoices"] });
            }, 50);
          }}
        >
          Počisti filtre
        </button>
      </div>
    </div>
  );
}

export default SearchInvoices;
