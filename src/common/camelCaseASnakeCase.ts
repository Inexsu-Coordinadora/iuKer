export function camelCaseASnakeCase(nombre: string) {
  const nombrePropiedad = nombre.split(/(?=[A-Z])/);
  const snakeCaseString = nombrePropiedad.join('_').toLocaleLowerCase();

  return snakeCaseString;
}
