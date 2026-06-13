export const formatRUT = (rut: string): string => {
  // Eliminar cualquier carácter que no sea número o k/K
  let value = rut.replace(/[^0-9kK]/g, "");

  if (value.length <= 1) return value;

  // Separar el dígito verificador
  const body = value.slice(0, -1);
  const dv = value.slice(-1).toUpperCase();

  // Formatear el cuerpo con puntos
  let bodyFormatted = "";
  for (let i = body.length - 1, j = 1; i >= 0; i--, j++) {
    bodyFormatted = body[i] + bodyFormatted;
    if (j % 3 === 0 && i !== 0) {
      bodyFormatted = "." + bodyFormatted;
    }
  }

  return `${bodyFormatted}-${dv}`;
};
