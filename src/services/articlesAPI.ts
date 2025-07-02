export async function getArticles(
  name: string,
  ageGroup?: string,
  label?: string,
) {
  try {
    const params = new URLSearchParams();

    params.append("name", name);
    params.append("sort", "name");

    if (ageGroup) params.append("ageGroup", ageGroup);
    if (label) params.append("label", label);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/articles?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const data = await res.json();
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export async function getOneArticle(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export async function sellArticles(id: string, bodyData: unknown) {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/articles/sellinperson/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(bodyData),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    const data = await res.json();

    return data;
  } catch (error) {
    return error;
  }
}

export async function createArticle({
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
}: {
  label: string;
  name: { sl: string; en: string };
  ageGroup: string[];
  type?: string;
  morning?: boolean;
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
}) {
  try {
    const bodyData = {
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
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/articles`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
}

export async function updateArticle(
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
    price,
    taxRate,
    noClasses,
    startDate,
    endDate,
  }: {
    label: string;
    name: { sl: string; en: string };
    ageGroup: string[];
    type?: string;
    morning?: boolean;
    activationDuration?: string;
    hiddenUsers: boolean;
    hiddenReception: boolean;
    duration?: string;
    visits?: string;
    gift: boolean;
    priceDDV: string;
    price: string;
    taxRate: string;
    noClasses?: string;
    startDate?: string;
    endDate?: string;
  },
  id: string,
) {
  try {
    const bodyData = {
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
      price,
      taxRate,
      noClasses,
      startDate,
      endDate,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
}

export async function deleteArticle(id: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.status === "error") {
        throw new Error(
          "Nekaj je šlo narobe na strežniku! Poiskusite kasneje!",
        );
      }
      throw Error(data.message);
    }

    return data;
  } catch (error) {
    return error;
  }
}
