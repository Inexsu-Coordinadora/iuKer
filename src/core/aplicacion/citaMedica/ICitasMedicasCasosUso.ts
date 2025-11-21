import { CitaMedicaResumenDTO } from '../../infraestructura/repositorios/postgres/dtos/citaMedicaResumenDTO.js';

export interface ICitasMedicasCasosUso {
  obtenerCitas(limite?: number): Promise<CitaMedicaResumenDTO[]>;
  obtenerCitaPorId(idCita: string): Promise<CitaMedicaResumenDTO | null>;
  eliminarCita(idCita: string): Promise<void>;
}
