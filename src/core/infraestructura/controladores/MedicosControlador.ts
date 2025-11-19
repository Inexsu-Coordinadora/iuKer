import { FastifyRequest, FastifyReply } from 'fastify';
import { IMedicosCasosUso } from '../../aplicacion/medico/IMedicosCasosUso.js';
import { MedicoDTO, MedicoActualizarDTO, crearMedicoEsquema } from '../esquemas/medicoEsquema.js';
import { ZodError } from 'zod';
import { EstadoHttp } from './estadoHttp.enum.js';

export class MedicosControlador{
    constructor(private medicosCasosUso : IMedicosCasosUso) {}

    crearMedico = async(
        request : FastifyRequest <{Body : MedicoDTO}>,
        reply : FastifyReply
    ) => {
        try {
            const nuevoMedico = crearMedicoEsquema.parse(request.body);
            const nuevaTarjetaProfesional = await this.medicosCasosUso.crearMedico(nuevoMedico);

            return reply.code(EstadoHttp.CREADO).send({
                mensaje: "El médico se creo correctamente",
                TarjetaProfesional: nuevaTarjetaProfesional
            });
        }catch (er) {
            if (er instanceof ZodError){
                return reply.code(EstadoHttp.PETICION_INVALIDA).send({
                    mensaje: "Error al crear un nuevo médico",
                    error: er.issues[0]?.message || "Error desconocido"
                });
            }
            return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
                mensaje: "Error al crear un nuevo médico",
                error: er instanceof Error ? er.message : String(er)
            });
        }
    };

    listarMedicos = async(
        request : FastifyRequest <{Querystring : {limite? : number}}>,
        reply : FastifyReply
    ) => {
        try {
            const { limite } = request.query;
            const medicosEncontrados = await this.medicosCasosUso.listarMedicos(limite);

            return reply.code(EstadoHttp.OK).send({
                mensaje: "Médicos encontrados correctamente",
                medicos: medicosEncontrados,
                cantidad : medicosEncontrados.length
            });
        }catch (er){
            return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
                mensaje: "Error al obtener los médicos",
                error: er instanceof Error? er.message : er
            });
        }
    };

    obtenerMedicoPorTarjetaProfesional = async(
        request : FastifyRequest <{Params : { tarjetaProfesional : string}}>,
        reply : FastifyReply
    ) => {
        try{
            const { tarjetaProfesional } = request.params;
            const medicoEncontrado = await this.medicosCasosUso.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);

            if(!medicoEncontrado){
                return reply.code(EstadoHttp.NO_ENCONTRADO).send({
                    mensaje: "Médico no encontrado"
                });
            }

            return reply.code(EstadoHttp.OK).send({
                mensaje: "Médico encontrado correctamente",
                medico: medicoEncontrado
            })
        }catch(er){
            return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
                mensaje: "Error al obtener el médico",
                error: er instanceof Error? er.message : er
            });
        }
    };

    actualizarMedico = async(
        request : FastifyRequest <{Params : { tarjetaProfesional : string}, Body : MedicoActualizarDTO}>,
        reply : FastifyReply
    ) => {
        try{
            const { tarjetaProfesional } = request.params;
            const nuevoMedico = request.body;
            const medicoActualizado = await this.medicosCasosUso.actualizarMedico(tarjetaProfesional, nuevoMedico);

            if(!medicoActualizado){
                return reply.code(EstadoHttp.NO_ENCONTRADO).send({
                    mensaje: "Médico no encontrado"
                });
            }

            return reply.code(EstadoHttp.OK).send({
                mensaje: "Médico actualizado correctamente",
                medico: medicoActualizado
            });
        }catch(er){
            return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
                mensaje: "Error al actualizar el médico",
                error: er instanceof Error? er.message : er
            });
        }
    };

    eliminarMedico = async(
        request : FastifyRequest <{Params : {tarjetaProfesional : string}}>,
        reply: FastifyReply
    ) => {
        try{
            const { tarjetaProfesional } = request.params;
            await this.medicosCasosUso.eliminarMedico(tarjetaProfesional);

            return reply.code(EstadoHttp.OK).send({
                mensaje: "Médico eliminado correctamente",
                tarjetaProfesional: tarjetaProfesional
            });
        }catch(er){
            return reply.code(EstadoHttp.ERROR_INTERNO_SERVIDOR).send({
                mensaje: "Error al eliminar el médico",
                error: er instanceof Error? er.message : er
            });
        }
    };
}