import { FastifyRequest, FastifyReply } from 'fastify';
import { IMedicoCasosUso } from '../../aplicacion/Medico/IMedicoCasosUso.js';
import { MedicoDTO, MedicoActualizarDTO, crearMedicoEsquema } from '../esquemas/medicoEsquema.js';
import { ZodError } from 'zod';

export class MedicosControlador{
    constructor(private medicoCasosUso : IMedicoCasosUso) {}

    crearMedico = async(
        request : FastifyRequest <{Body : MedicoDTO}>,
        reply : FastifyReply
    ) => {
        try {
            const nuevoMedico = crearMedicoEsquema.parse(request.body);
            const nuevaTarjetaProfesional = await this.medicoCasosUso.crearMedico(nuevoMedico);

            return reply.code(200).send({
                mensaje: "El médico se creo correctamente",
                TarjetaProfesional: nuevaTarjetaProfesional
            });
        }catch (er) {
            if (er instanceof ZodError){
                return reply.code(400).send({
                    mensaje: "Error al crear un nuevo médico",
                    error: er.issues[0]?.message || "Error desconocido"
                });
            }
            return reply.code(500).send({
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
            const medicosEncontrados = await this.medicoCasosUso.listarMedicos(limite);

            return reply.code(200).send({
                mensaje: "Médicos encontrados correctamente",
                medicos: medicosEncontrados,
                cantidad : medicosEncontrados.length
            });
        }catch (er){
            return reply.code(500).send({
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
            const medicoEncontrado = await this.medicoCasosUso.obtenerMedicoPorTarjetaProfesional(tarjetaProfesional);

            if(!medicoEncontrado){
                return reply.code(404).send({
                    mensaje: "Médico no encontrado"
                });
            }

            return reply.code(200).send({
                mensaje: "Médico encontrado correctamente",
                medico: medicoEncontrado
            })
        }catch(er){
            return reply.code(500).send({
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
            const medicoActualizado = await this.medicoCasosUso.actualizarMedico(tarjetaProfesional, nuevoMedico);

            if(!medicoActualizado){
                return reply.code(404).send({
                    mensaje: "Médico no encontrado"
                });
            }

            return reply.code(200).send({
                mensaje: "Médico actualizado correctamente",
                medico: medicoActualizado
            });
        }catch(er){
            return reply.code(500).send({
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
            await this.medicoCasosUso.eliminarMedico(tarjetaProfesional);

            return reply.code(200).send({
                mensaje: "Médico eliminado correctamente",
                tarjetaProfesional: tarjetaProfesional
            });
        }catch(er){
            return reply.code(500).send({
                mensaje: "Error al eliminar el médico",
                error: er instanceof Error? er.message : er
            });
        }
    };
}