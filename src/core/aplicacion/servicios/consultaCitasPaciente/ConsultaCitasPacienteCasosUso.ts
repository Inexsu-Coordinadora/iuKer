import { IConsultaCitasPacienteCasosUso } from './IConsultaCitasPacienteCasosUso.js';
import { citaMedicaDTO } from '../../../infraestructura/esquemas/citaMedicaEsquema.js';
import { IPacientesRepositorio } from '../../../dominio/Paciente/IPacientesRepositorio.js';
import { CitasRepositorio } from '../../../infraestructura/postgres/CitasRepositorio.js';

export class ConsultaPacienteCasosUso implements IConsultaCitasPacienteCasosUso{
    constructor (private repositorioPacientes : IPacientesRepositorio,
        private repositorioCitaMedica : CitasRepositorio
    ) {}

    async ejecutarServicio(numeroDocPaciente : string, limite? : number) : Promise <citaMedicaDTO[]>{
        const paciente = await this.repositorioPacientes.obtenerPacientePorId(numeroDocPaciente);

        if(!paciente){
            throw new Error(`El paciente con documento '${numeroDocPaciente}' no existe`);
        }

        const citasPorPaciente = await this.repositorioCitaMedica.obtenerCitasPorPaciente(numeroDocPaciente, limite);
        
        if(limite){
            return citasPorPaciente.slice(0,limite);
        }
        return citasPorPaciente;

    }
    
}