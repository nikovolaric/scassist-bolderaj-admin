export async function openInvoice(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices/download/${id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    return error as Error;
  }
}

export async function getUserInvoices(id: string, year: string) {
  try {
    const params = new URLSearchParams();

    params.append("buyer", id);
    params.append("sort", "-invoiceDate");
    params.append("invoiceData.year", year);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await res.json();

    if (!res.ok) {
      if (data.status === "error") {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function getAllInvoices({
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
}: {
  q: string;
  page: number;
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
}) {
  try {
    const params = new URLSearchParams();

    params.append("q", q);
    params.append("sort", "-invoiceDate");
    params.append("limit", "30");
    params.append("page", page.toString());
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);
    if (dateFromDone) params.append("dateFromDone", dateFromDone);
    if (dateToDone) params.append("dateToDone", dateToDone);
    if (issuer) params.append("issuer", issuer);
    if (totalAmount) params.append("totalAmount", totalAmount);
    if (paymentMethod) params.append("paymentMethod", paymentMethod);
    if (label) params.append("label", label);
    if (article) params.append("article", article);
    if (buyer) params.append("buyerFullName", buyer);
    if (taxNo) params.append("taxNo", taxNo);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/invoices?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await res.json();

    if (!res.ok) {
      if (data.status === "error") {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error as Error;
  }
}
