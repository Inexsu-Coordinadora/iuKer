CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';

DROP SCHEMA IF EXISTS iuker;
CREATE SCHEMA iuker;
SET search_path TO iuker;

CREATE TABLE IF NOT EXISTS tipo_documentos(
  id_documento INT PRIMARY KEY,
  descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS estados(
	id_estado INT PRIMARY KEY,
	descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS pacientes (
  numero_doc VARCHAR(15) UNIQUE,
  tipo_doc INT NOT NULL REFERENCES tipo_documentos (id_documento),
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  sexo CHAR(1) NOT NULL,
  email VARCHAR(200) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(100) NOT NULL,
  
  PRIMARY KEY (numero_doc, tipo_doc)
);

CREATE TABLE IF NOT EXISTS medicos (
  tarjeta_profesional VARCHAR(15) PRIMARY KEY,
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
  id_cita UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medico VARCHAR(15) NOT NULL REFERENCES medicos (tarjeta_profesional),
  tipo_doc_paciente INT NOT NULL,
  numero_doc_paciente VARCHAR(15) NOT NULL,
  consultorio VARCHAR(5) NOT NULL REFERENCES consultorios (id_consultorio),
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  duracion INTERVAL NOT NULL,
  estado INT NOT NULL REFERENCES estados(id_estado),
  id_cita_anterior UUID REFERENCES citas_medicas (id_cita),
  FOREIGN KEY (numero_doc_paciente, tipo_doc_paciente) REFERENCES pacientes(numero_doc, tipo_doc)
);





