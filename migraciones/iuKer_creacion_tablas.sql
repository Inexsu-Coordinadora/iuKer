DROP SCHEMA IF EXISTS iuker CASCADE;
CREATE SCHEMA iuker;
ALTER DATABASE iukerdb SET search_path TO iuker, public;

CREATE TABLE IF NOT EXISTS tipo_documentos(
  id_documento INT PRIMARY KEY,
  descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados(
	id_estado INT PRIMARY KEY,
	descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS pacientes (
  tipo_doc INT NOT NULL REFERENCES tipo_documentos (id_documento),
  numero_doc VARCHAR(15) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,

  PRIMARY KEY (tipo_doc, numero_doc)
);

CREATE TABLE IF NOT EXISTS medicos (
  tarjeta_profesional VARCHAR(15) PRIMARY KEY,
  tipo_doc INT NOT NULL REFERENCES tipo_documentos (id_documento),
  numero_doc VARCHAR(15) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  especialidad VARCHAR(50) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS consultorios (
  id_consultorio VARCHAR(5) PRIMARY KEY,
  ubicacion VARCHAR(100) NOT NULL,
  estado INT NOT NULL REFERENCES estados (id_estado)
);

CREATE TABLE IF NOT EXISTS citas_medicas (
  id_cita VARCHAR(50) PRIMARY KEY,
  medico VARCHAR(15) REFERENCES medicos (tarjeta_profesional) ON DELETE SET NULL,
  tipo_doc_paciente INT NOT NULL,
  numero_doc_paciente VARCHAR(15) NOT NULL,
  id_consultorio VARCHAR(5) NOT NULL REFERENCES consultorios (id_consultorio),
  fecha VARCHAR(50) NOT NULL,
  hora_inicio VARCHAR(50) NOT NULL,
  duracion VARCHAR(20) NOT NULL,
  estado INT NOT NULL REFERENCES estados(id_estado),
  FOREIGN KEY (tipo_doc_paciente, numero_doc_paciente) REFERENCES pacientes(tipo_doc, numero_doc)
);