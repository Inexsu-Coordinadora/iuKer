import { ICitaMedica } from '../../dominio/CitaMedica/ICitaMedica.js';

export interface ICitaMedicaCasosUso {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  agendarCita(datosCitaMedica: ICitaMedica): Promise<ICitaMedica>;
  reprogramarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null>;
  finalizarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null>;
  cancelarCita(idCita: string, datosCitaMedica: ICitaMedica): Promise<ICitaMedica | null>;
  eliminarCita(idCita: string): Promise<void>;
}
