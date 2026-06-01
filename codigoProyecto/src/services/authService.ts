export const loginUsuario = async (
  rut: string,
  password: string
) => {

  const response = await fetch(
    'http://localhost:3000/api/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rut,
        password
      })
    }
  );

  const data = await response.json();

  return {
    response,
    data
  };
};

export const registrarUsuario = async (
  usuario: string,
  rut: string,
  correo: string,
  region: string,
  comuna: string,
  password: string
) => {

  const response = await fetch(
    'http://localhost:3000/api/registro',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

  const data = await response.json();

  return {
    response,
    data
  };
};