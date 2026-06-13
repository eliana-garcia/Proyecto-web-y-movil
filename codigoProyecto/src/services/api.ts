export const API_URL = import.meta.env.VITE_API_URL;

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

  // Interceptor para token expirado o inválido
  if (response.status === 401) {

    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    window.location.href = "/Login";

    throw new Error(
      "Sesión expirada"
    );
  }

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