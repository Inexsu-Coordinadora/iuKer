import { ICitaMedica } from '../../dominio/citaMedica/ICitaMedica.js';

export interface ICitasMedicasCasosUso {
  obtenerCitas(limite?: number): Promise<ICitaMedica[]>;
  obtenerCitaPorId(idCita: string): Promise<ICitaMedica | null>;
  eliminarCita(idCita: string): Promise<void>;
}
