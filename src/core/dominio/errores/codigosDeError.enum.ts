export enum CodigosDeError {
  //Errores de Cita - [CITA]
  CITA_NO_EXISTE = 'CITA001',
  CITA_CANCELADA = 'CITA002',
  CITA_FINALIZADA = 'CITA003',
  CITA_REPROGRAMADA = 'CITA004',
  AGENDADANDO_CITA_EN_EL_PASADO = 'CITA005',

  //Errores de Paciente - [PAC]
  PACIENTE_YA_EXISTE = 'PAC001',
  PACIENTE_NO_EXISTE = 'PAC002',
  PACIENTE_CON_CITA_EN_MISMO_HORARIO = 'PAC003',

  // Errores de Médico y de Asignación - [MED] & [ASIG]
  MEDICO_NO_EXISTE = 'MED001',
  MEDICO_NO_DISPONIBLE = 'MED002', //No se encuentra disponible en ese horario
  MEDICO_CON_CITA_EN_MISMO_HORARIO = 'MED003',
  ASIGNACION_MEDICO_CONSULTORIO_YA_EXISTE = 'ASIG001',

  //Errores de consultorio - [CONS]
  CONSULTORIO_NO_EXISTE = 'CONS001',
  CONCULTORIO_YA_EXISTE = 'CONS002',
  CONSULTORIO_OCUPADO = 'CONS003', //Ocupado en ese rango de tiempo

  // Errores Generales/Validación de Entrada - [GEN]
  PARAMETROS_INVALIDOS = 'GEN001',
}
/**
 *Errores:
  CITAS:
  - Cita no existente (REPITE 4)
  - La cita ya está cancelada (REPITE 5)
  - la cita ya fue finalizada (REPITE 6)
  - La cita no está vigente, probablemente fué reprogramada (REPITE 12)
  - No se puede agendar una cita en el pasado (REPITE 7)

  PACIENTE:
  - Paciente ya existe, no volver a registrar
  - Paciente no existe en el sistema (REPITE 8)
  - El paciente ya tiene una cita agendada en ese horario (REPITE 10)

  MEDICO:
  - El medico no existe en el sistema (REPITE 1)
  - El médico no se encuentra disponible en ese horario (REPITE 9)
  - Medico ya tiene una cita a esa hora (REPITE 11)

  CONSULTORIO:
  - El consultorio no existe (REPITE 2)
  - El consultorio está ocupado en ese rango de tiempo (REPITE 3)*/
/*
  AGENDAMIENTO CITAS:
  - Paciente no existe en el sistema (REPITE 8)
  - El medico no existe en el sistema (REPITE 1)
  - No se puede agendar una cita en el pasado (REPITE 7)
  - Medico ya tiene una cita a esa hora (REPITE 11)
  - El médico no se encuentra disponible en ese horario (REPITE 9)
  - El paciente ya tiene una cita agendada en ese horario (REPITE 10)

  ASIGNACION MEDICO:
  - Medico no existe en el sistema (REPITE 1)
  - El consultorio no existe (REPITE 2)
  - El consultorio está ocupado en ese rango de tiempo (REPITE 3)
  - La asignación Medico-Consultorio que intentas crear ya existe de manera identica

  CANCELACIÓN REPROGRAMACION CITA:
- - Cita no existente (REPITE 4)
  - La cita ya está cancelada (REPITE 5)
  - la cita ya fue finalizada (REPITE 6)
  - No se puede agendar una cita en el pasado (REPITE 7)
  - El médico no se encuentra disponible en ese horario (REPITE 9)
  - El paciente ya tiene una cita agendada en ese horario (REPITE 10)
  - Medico ya tiene una cita a esa hora (REPITE 11)

*/
