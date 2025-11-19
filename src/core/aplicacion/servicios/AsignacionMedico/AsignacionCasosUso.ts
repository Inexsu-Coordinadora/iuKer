import { IAsignacionMedico } from '../../../dominio/AsignacionMedico/IAsignacionMedico.js';
import { AsignacionMedico } from '../../../dominio/AsignacionMedico/AsignacionMedico.js';
import { IAsignacionCasosUso } from './IAsignacionCasosUso.js';
import { IAsignacionMedicoRepositorio } from '../../../dominio/AsignacionMedico/IAsignacionMedicoRepositorio.js';
import { IMedicosRepositorio } from '../../../dominio/Medico/IMedicosRepositorio.js';
import { IConsultoriosRepositorio } from '../../../dominio/Consultorio/IConsultoriosRepositorio.js';

export class AsignacionCasosUso implements IAsignacionCasosUso {
  constructor(
    private asignacionMedicoRepositorio: IAsignacionMedicoRepositorio,
    private medicoRepositorio: IMedicosRepositorio,
    private consultorioRepositorio: IConsultoriosRepositorio
  ) {}

  async crearAsignacion(nuevaAsignacion: IAsignacionMedico): Promise<string> {
    //Medico existe
    const medicoExiste = await this.medicoRepositorio.obtenerMedicoPorTarjetaProfesional(
      nuevaAsignacion.tarjetaProfesionalMedico
    );
    if (!medicoExiste) {
      throw new Error(`El médico con tarjeta profesional '${nuevaAsignacion.tarjetaProfesionalMedico}' no existe.`);
    }
    //Consultorio existe
    const consultorioExiste = await this.consultorioRepositorio.obtenerConsultorioPorId(nuevaAsignacion.idConsultorio);
    if (!consultorioExiste) {
      throw new Error(`El consultorio con ID '${nuevaAsignacion.idConsultorio}' no existe.`);
    }
    //Comprobación de existencia de una asignación identica
    const existeAsignacion = await this.asignacionMedicoRepositorio.existeAsignacion(
      nuevaAsignacion.tarjetaProfesionalMedico,
      nuevaAsignacion.idConsultorio,
      nuevaAsignacion.diaSemana,
      nuevaAsignacion.inicioJornada,
      nuevaAsignacion.finJornada
    );
    if (existeAsignacion) {
      throw new Error('La asignación Medico-Consultorio que intentas crear ya existe de manera identica');
    }
    //Comprobacion de consultorio ocupado
    const consultorioOcupado = await this.asignacionMedicoRepositorio.consultorioOcupado(
      nuevaAsignacion.idConsultorio,
      nuevaAsignacion.diaSemana,
      nuevaAsignacion.inicioJornada,
      nuevaAsignacion.finJornada
    );
    if (consultorioOcupado) {
      throw new Error('El consultorio está ocupado en ese rango de tiempo.');
    }

    //creación y persistencia
    const instanciaAsignacion = new AsignacionMedico(nuevaAsignacion);

    const idNuevaAsignacion = await this.asignacionMedicoRepositorio.crearAsignacion(instanciaAsignacion);

    return idNuevaAsignacion;
  }

  async eliminarAsignacion(tarjetaProfesionalMedico: string): Promise<void> {
    await this.asignacionMedicoRepositorio.eliminarAsignacion(tarjetaProfesionalMedico);
  }
}
