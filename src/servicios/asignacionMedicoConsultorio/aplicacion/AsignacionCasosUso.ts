import { IAsignacionMedicoConsultorio } from '../dominio/IAsignacionMedicoConsultorio.js';
import { AsignacionMedicoConsultorio } from '../dominio/AsignacionMedicoConsultorio.js';
import { IAsignacionCasosUso } from './IAsignacionCasosUso.js';
import { IRepositorioAsignacion } from '../dominio/IRepositorioAsignacion.js';
import { IMedicoRepositorio } from '../../../core/dominio/Medico/IMedicoRepositorio.js';
import { IRepositorioConsultorio } from '../../../core/dominio/Consultorio/IRepositorioConsultorio.js';
import { error } from 'console';

export class AsignacionCasosUso implements IAsignacionCasosUso {
  constructor(
    private asignacionRepositorio: IRepositorioAsignacion,
    private medicoRepositorio: IMedicoRepositorio,
    private consultorioRepositorio: IRepositorioConsultorio
  ) {}

  async crearAsignacion(
    nuevaAsignacion: IAsignacionMedicoConsultorio
  ): Promise<string> {
    //Medico existe
    const medicoExiste =
      await this.medicoRepositorio.obtenerMedicoPorTarjetaProfesional(
        nuevaAsignacion.tarjetaProfesionalMedico
      );
    if (!medicoExiste) {
      throw new Error(
        `El médico con tarjeta profesional '${nuevaAsignacion.tarjetaProfesionalMedico}' no existe.`
      );
    }
    //Consultorio existe
    const consultorioExiste =
      await this.consultorioRepositorio.obtenerConsultorioPorId(
        nuevaAsignacion.idConsultorio
      );
    if (!consultorioExiste) {
      throw new Error(
        `El consultorio con ID '${nuevaAsignacion.idConsultorio}' no existe.`
      );
    }
    //Comprobacion de consultorio ocupado
    const consultorioOcupado =
      await this.asignacionRepositorio.consultorioOcupado(
        nuevaAsignacion.idConsultorio,
        nuevaAsignacion.diaSemana,
        nuevaAsignacion.inicioJornada,
        nuevaAsignacion.finJornada
      );
    if (consultorioOcupado) {
      throw new Error(
        'El consultorio está ocupado en ese rango de tiempo. Escoge uno anterior a la hora de inicio que ingresaste o posterior a la hora de finalización que ingresaste'
      );
    }
    //Comprobación de existencia de una asignación identica
    const existeAsignacion = await this.asignacionRepositorio.existeAsignacion(
      nuevaAsignacion.tarjetaProfesionalMedico,
      nuevaAsignacion.idConsultorio,
      nuevaAsignacion.diaSemana,
      nuevaAsignacion.inicioJornada,
      nuevaAsignacion.finJornada
    );
    if (existeAsignacion) {
      throw new Error('La asignación que intentas crear ya existe');
    }

    //creación y persistencia
    const instanciaAsignacion = new AsignacionMedicoConsultorio(
      nuevaAsignacion
    );

    const idNuevaAsignacion = await this.asignacionRepositorio.crearAsignacion(
      instanciaAsignacion
    );

    return idNuevaAsignacion;
  }
}
