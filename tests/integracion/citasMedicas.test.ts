import { describe, expect, jest } from '@jest/globals';

jest.mock('../../src/core/infraestructura/repositorios/postgres/CitasMedicasRepositorio.js', () => {
  return {
    CitasMedicasRepositorio: jest.fn().mockImplementation(() => ({
      obtenerCitas: async (limite?: number) => {
        const datosSimulados = [
          {
            idCita: 'f5581292-15c1-4d8a-9295-46f72df39b78',
            paciente: 'Juan Pérez',
            tipoDocPaciente: 'Cédula',
            numeroDocPaciente: '100001',
            medico: 'Carlos Rodríguez',
            ubicacion: 'Edificio E, Piso 3',
            consultorio: 'C101',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '08:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: '8a614da7-071a-40fa-837d-945ddbec40ba',
            paciente: 'Laura Gómez',
            tipoDocPaciente: 'Cédula Extranjería',
            numeroDocPaciente: '100002',
            medico: 'Sofía Martínez',
            ubicacion: 'Edificio A, Piso 5',
            consultorio: 'C102',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '09:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: 'a2dea0d0-841d-4440-b887-023c3cbdbcb4',
            paciente: 'Andrés Ramírez',
            tipoDocPaciente: 'Tarjeta Identidad',
            numeroDocPaciente: '100003',
            medico: 'Julián García',
            ubicacion: 'Edificio B, Piso 6',
            consultorio: 'C202',
            fecha: '2025-11-28T05:00:00.000Z',
            horaInicio: '10:30:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
          {
            idCita: '35004a7d-7774-4cc9-9e75-e291801f48fe',
            paciente: 'María López',
            tipoDocPaciente: 'Pasaporte',
            numeroDocPaciente: '100004',
            medico: 'Valentina Ruiz',
            ubicacion: 'Edificio D, Piso 2',
            consultorio: 'C201',
            fecha: '2025-11-29T05:00:00.000Z',
            horaInicio: '14:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          },
        ];

        return typeof limite === 'number' ? datosSimulados.slice(0, limite) : datosSimulados;
      },

      obtenerCitaPorId: async (idCita: string) => {
        if (idCita === 'feaac82c-2904-429a-a344-4591cc765bdb') {
          return {
            idCita: 'feaac82c-2904-429a-a344-4591cc765bdb',
            paciente: 'Juan Pérez',
            tipoDocPaciente: 'Cédula',
            numeroDocPaciente: '100001',
            medico: 'Carlos Rodríguez',
            ubicacion: 'Edificio E, Piso 3',
            consultorio: 'C101',
            fecha: '2025-11-25T05:00:00.000Z',
            horaInicio: '08:00:00',
            codigoEstadoCita: 1,
            estadoCita: 'Activa',
            idCitaAnterior: null,
          };
        }
        return null;
      },

      eliminarCita: async (id: string) => (id === 'feaac82c-2904-429a-a344-4591cc765bdb' ? true : false),
    })),
  };
});

import request from 'supertest';
import { app } from '../../src/core/infraestructura/app';
import { pool } from '../../src/core/infraestructura/repositorios/postgres/clientePostgres';

describe('Pruebas de integración - Módulo citas medicas', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  test('GET /api/citas-medicas - Retorna todas la citas medicas simuladas', async () => {
    const respuesta = await request(app.server).get('/api/citas-medicas');
    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      cantidadCitas: 4,
      citasEncontradas: [
        {
          idCita: 'f5581292-15c1-4d8a-9295-46f72df39b78',
          paciente: 'Juan Pérez',
          tipoDocPaciente: 'Cédula',
          numeroDocPaciente: '100001',
          medico: 'Carlos Rodríguez',
          ubicacion: 'Edificio E, Piso 3',
          consultorio: 'C101',
          fecha: '2025-11-25T05:00:00.000Z',
          horaInicio: '08:00:00',
          codigoEstadoCita: 1,
          estadoCita: 'Activa',
          idCitaAnterior: null,
        },
        {
          idCita: '8a614da7-071a-40fa-837d-945ddbec40ba',
          paciente: 'Laura Gómez',
          tipoDocPaciente: 'Cédula Extranjería',
          numeroDocPaciente: '100002',
          medico: 'Sofía Martínez',
          ubicacion: 'Edificio A, Piso 5',
          consultorio: 'C102',
          fecha: '2025-11-25T05:00:00.000Z',
          horaInicio: '09:00:00',
          codigoEstadoCita: 1,
          estadoCita: 'Activa',
          idCitaAnterior: null,
        },
        {
          idCita: 'a2dea0d0-841d-4440-b887-023c3cbdbcb4',
          paciente: 'Andrés Ramírez',
          tipoDocPaciente: 'Tarjeta Identidad',
          numeroDocPaciente: '100003',
          medico: 'Julián García',
          ubicacion: 'Edificio B, Piso 6',
          consultorio: 'C202',
          fecha: '2025-11-28T05:00:00.000Z',
          horaInicio: '10:30:00',
          codigoEstadoCita: 1,
          estadoCita: 'Activa',
          idCitaAnterior: null,
        },
        {
          idCita: '35004a7d-7774-4cc9-9e75-e291801f48fe',
          paciente: 'María López',
          tipoDocPaciente: 'Pasaporte',
          numeroDocPaciente: '100004',
          medico: 'Valentina Ruiz',
          ubicacion: 'Edificio D, Piso 2',
          consultorio: 'C201',
          fecha: '2025-11-29T05:00:00.000Z',
          horaInicio: '14:00:00',
          codigoEstadoCita: 1,
          estadoCita: 'Activa',
          idCitaAnterior: null,
        },
      ],
    });
  });

  //fin
  //fin
  //fin
});
