export async function getMe() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/getme`, {
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

    return data.me;
  } catch (error) {
    return error as Error;
  }
}

export async function getAllUsers(
  page: number,
  limit: number,
  lastName: string,
  roles?: string[],
) {
  try {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    params.append("lastName", lastName);

    if (roles) {
      if (roles.length > 0) params.append("role", roles.toString());
    }

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users?${params.toString()}`,
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

export async function getOneUser(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
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

export async function getUserTickets(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${id}/tickets`,
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

export async function getUserClasses(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${id}/classes`,
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

export async function getUserActivities(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${id}/classessingle`,
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

export async function getUserCompanies(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${id}/companies`,
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

export async function getUserChildren(id: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${id}/children`,
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

export async function changeUserRole(
  id: string,
  role: string,
  taxNo: string,
  invoiceNickname: string,
) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/updaterole/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ role, taxNo, invoiceNickname }),
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

export async function removeUserRole(id: string, role: string) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/users/removerole/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ role }),
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

export async function editUser(id: string, newData: unknown) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(newData),
    });

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
