export async function getUserVisits(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/visits/user/${id}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.error.statusCode === 500) {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function getDailyVisits() {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/visits/dailyvisits`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.error.statusCode === 500) {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function getCompanyVisits(companyId: string, limit: number) {
  try {
    const params = new URLSearchParams();

    params.append("company", companyId);
    params.append("limit", limit.toString());
    params.append("sort", "-date");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/visits?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.error.statusCode === 500) {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function exportCompanyVisits(companyId: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/visits/${companyId}/exportexcel`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.error.statusCode === 500) {
        throw new Error("Napaka na strežniku! Prosim poskusite kasneje.");
      }
      throw Error(data.message);
    }

    const disposition = res.headers.get("Content-Disposition");
    let filename = "prenos.xlsx";
    const match = disposition?.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1]);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    return error as Error;
  }
}
