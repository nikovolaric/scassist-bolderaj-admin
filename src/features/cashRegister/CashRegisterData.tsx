import { useQueries } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeUser, getCashRegister } from "./slice/cashRegisterSlice";
import { getCashRegisterRecords } from "../../services/cashRegisterAPI";
import Spinner from "../../components/Spinner";
import { getInvoicesTotalSum } from "../../services/invoicesAPI";
import { addDays } from "date-fns";

function CashRegisterData() {
  const cashRegister = useAppSelector(getCashRegister);
  const dispatch = useAppDispatch();

  const { date, user } = cashRegister;

  const [
    { data, isPending },
    { data: cardSum },
    { data: cashSum },
    { data: hobexSum },
    { data: paypalSum },
  ] = useQueries({
    queries: [
      {
        queryKey: ["cashRegister", date, user],
        queryFn: () => getCashRegisterRecords({ date, user }),
      },
      {
        queryKey: ["totalSumCards", date, user],
        queryFn: () =>
          getInvoicesTotalSum({
            dateFrom: new Date(date).toString(),
            dateTo: new Date(addDays(new Date(date), 1)).toString(),
            deviceNo: "BLAG1",
            paymentMethod: "card",
            issuer: user,
          }),
      },
      {
        queryKey: ["totalSumCash", date, user],
        queryFn: () =>
          getInvoicesTotalSum({
            dateFrom: new Date(date).toString(),
            dateTo: new Date(addDays(new Date(date), 1)).toString(),
            deviceNo: "BLAG1",
            paymentMethod: "gotovina",
            issuer: user,
          }),
      },
      {
        queryKey: ["totalSumHobex", date],
        queryFn: () =>
          getInvoicesTotalSum({
            dateFrom: new Date(date).toString(),
            dateTo: new Date(addDays(new Date(date), 1)).toString(),
            deviceNo: "BLAGO",
            paymentMethod: "online",
          }),
      },
      {
        queryKey: ["totalSumPayPal", date],
        queryFn: () =>
          getInvoicesTotalSum({
            dateFrom: new Date(date).toString(),
            dateTo: new Date(addDays(new Date(date), 1)).toString(),
            deviceNo: "BLAGO",
            paymentMethod: "paypal",
          }),
      },
    ],
  });

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-5">
        <div>
          <p>Stanje prometa</p>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8">
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Realno stanje - gotovina</p>
              <p className="text-2xl font-semibold">
                {cashSum?.results > 0
                  ? new Intl.NumberFormat("sl-SI", {
                      style: "currency",
                      currency: "EUR",
                    }).format(cashSum.totalAmount)
                  : "0,00 €"}
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Končno stanje - gotovina</p>
              <p className="text-2xl font-semibold">
                {new Intl.NumberFormat("sl-SI", {
                  style: "currency",
                  currency: "EUR",
                }).format(
                  data.cashRegister.reduce(
                    (c: number, a: { cashBalanceDifference: number }) =>
                      a.cashBalanceDifference + c,
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Realno stanje - kartice</p>
              <p className="text-2xl font-semibold">
                {cardSum?.results > 0
                  ? new Intl.NumberFormat("sl-SI", {
                      style: "currency",
                      currency: "EUR",
                    }).format(cardSum.totalAmount)
                  : "0,00 €"}
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Končno stanje - kartice</p>
              <p className="text-2xl font-semibold">
                {new Intl.NumberFormat("sl-SI", {
                  style: "currency",
                  currency: "EUR",
                }).format(
                  data.cashRegister.reduce(
                    (c: number, a: { creditCardBalanceDifference: number }) =>
                      a.creditCardBalanceDifference + c,
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Spletna plačila - hobex</p>
              <p className="text-2xl font-semibold">
                {new Intl.NumberFormat("sl-SI", {
                  style: "currency",
                  currency: "EUR",
                }).format(hobexSum?.totalAmount || 0)}
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-lg bg-white p-4 pb-9 shadow-xs">
              <p className="text-sm">Spletna plačila - PayPal</p>
              <p className="text-2xl font-semibold">
                {new Intl.NumberFormat("sl-SI", {
                  style: "currency",
                  currency: "EUR",
                }).format(paypalSum?.totalAmount || 0)}
              </p>
            </div>
          </div>
        </div>
        {data.results > 0 && (
          <div className="flex flex-col">
            <p>Seznam prijavljenih na blagajni</p>
            <div className="flex-grow rounded-lg bg-white p-6 shadow-xs">
              {data.cashRegister.map(
                (
                  cr: {
                    user: { fullName: string; _id: string };
                    loginTime: string;
                    logoutTime: string;
                    _id: string;
                  },
                  i: number,
                ) => (
                  <div
                    key={cr._id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 px-3.5 py-5 shadow-xs ${i % 2 === 0 ? "bg-white" : "bg-primary/20"}`}
                    onClick={() =>
                      dispatch(
                        changeUser({
                          fullName: cr.user.fullName,
                          id: cr.user._id,
                        }),
                      )
                    }
                  >
                    <p className="font-medium">{cr.user.fullName}</p>
                    <p className="text-black/75">
                      {new Date(cr.loginTime).toLocaleDateString("sl-SI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-black/75">
                      {new Date(cr.logoutTime).toLocaleDateString("sl-SI", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CashRegisterData;
