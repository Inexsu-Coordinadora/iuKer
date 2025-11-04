export function camelToSnakeCase(nombre:string){
  let nombrePropiedad = nombre.split(/(?=[A-Z])/);
  let snakeCaseString = nombrePropiedad.join('_').toLowerCase();
  return snakeCaseString;
}