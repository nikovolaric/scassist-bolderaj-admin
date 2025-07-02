export async function getAllCompanies(name: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/companies?companyName=${name}`,
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

    const data = await res.json();

    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function getOneCompany(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
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

export async function companyTicketsUse(id: string, users: string[]) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/companies/${id}/usetickets`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ users }),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
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

export async function updateCompany(id: string, newData: unknown) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(newData),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
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

export async function removeUser(companyId: string, userId: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/companies/${companyId}/removeuser/${userId}`,
      {
        method: "POST",
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

    const data = await res.json();

    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function addUser(companyId: string, userId: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/companies/${companyId}/adduser/${userId}`,
      {
        method: "POST",
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

    const data = await res.json();

    return data;
  } catch (error) {
    return error as Error;
  }
}

export async function createCompany(companyData: unknown) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/companies`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
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

export async function editCompany(id: string, companyData: unknown) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/companies/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
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
