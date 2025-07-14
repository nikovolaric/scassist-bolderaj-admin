export async function getCashRegisterRecords({
  date,
  user,
}: {
  date?: string;
  user?: string;
}) {
  try {
    const params = new URLSearchParams();

    if (date) {
      params.append(
        "date",
        new Date(date).toLocaleDateString("sl-SI").replaceAll(" ", ""),
      );
    }

    if (user) {
      params.append("user", user);
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/cashregister?${params.toString()}`,
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
