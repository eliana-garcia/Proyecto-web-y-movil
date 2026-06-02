const API_URL = "http://localhost:3000";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {

  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization:
            `Bearer ${token}`
        }),
        ...options.headers
      }
    }
  );

  const text = await response.text();

  const data = text
    ? JSON.parse(text)
    : null;

  if (!response.ok) {
    throw new Error(
      data?.mensaje ||
      "Error del servidor"
    );
  }

  return data;
};