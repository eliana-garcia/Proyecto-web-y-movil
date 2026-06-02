import { apiFetch } from "./api";

export const loginUsuario = async (
  rut: string,
  password: string
) => {

  return await apiFetch(
    "/api/login",
    {
      method: "POST",
      body: JSON.stringify({
        rut,
        password
      })
    }
  );
};

export const registrarUsuario = async (
  usuario: string,
  rut: string,
  correo: string,
  region: string,
  comuna: string,
  password: string
) => {

  return await apiFetch(
    "/api/registro",
    {
      method: "POST",
      body: JSON.stringify({
        nombre_usuario: usuario,
        rut,
        correo,
        region,
        comuna,
        password
      })
    }
  );
};