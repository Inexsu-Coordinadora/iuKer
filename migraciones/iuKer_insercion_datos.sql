-- ==============================================================
-- INSERCIÓN DE DATOS
-- ==============================================================

-- TIPOS DE DOCUMENTO
INSERT INTO tipo_documentos (id_documento, descripcion) VALUES
(1, 'Cédula'),
(2, 'Tarjeta Identidad'),
(3, 'Cédula Extranjería'),
(4, 'Pasaporte');

-- ESTADOS GENERALES
INSERT INTO estados (id_estado, descripcion) VALUES
(1, 'Activa'),
(2, 'Actualizada'),
(3, 'Reprogramada'),
(4, 'Finalizada'),
(5, 'Cancelada'),
(6, 'Ocupado'),
(7, 'Disponible');

-- PACIENTES
INSERT INTO pacientes (tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion)
VALUES
(1, '100001', 'Juan', 'Pérez', '1995-06-15', 'M', 'juan.perez@mail.com', '3001112233', 'Cra 45 #12-30'),
(3, '100002', 'Laura', 'Gómez', '1992-04-20', 'F', 'laura.gomez@mail.com', '3012223344', 'Cll 80 #45-10'),
(2, '100003', 'Andrés', 'Ramírez', '1988-10-05', 'M', 'andres.ramirez@mail.com', '3023334455', 'Av 30 #9-22'),
(4, '100004', 'María', 'López', '2000-01-12', 'F', 'maria.lopez@mail.com', '3044445566', 'Cll 10 #50-60');

-- MÉDICOS
INSERT INTO medicos (tarjeta_profesional, tipo_doc, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP001', 1, '900001', 'Carlos', 'Rodríguez', '1980-03-12', 'M', 'Medicina General', 'carlos.rodriguez@clinicaiuker.com', '3105556677'),
('MP002', 1, '900002', 'Sofía', 'Martínez', '1985-11-23', 'F', 'Pediatría', 'sofia.martinez@clinicaiuker.com', '3116667788'),
('MP003', 1, '900003', 'Julián', 'García', '1978-09-08', 'M', 'Cardiología', 'julian.garcia@clinicaiuker.com', '3127778899'),
('MP004', 1, '900004', 'Valentina', 'Ruiz', '1990-02-17', 'F', 'Dermatología', 'valentina.ruiz@clinicaiuker.com', '3138889900');

-- CONSULTORIOS
INSERT INTO consultorios (id_consultorio, ubicacion, estado)
VALUES
('C101', 'Piso 1 - Frente a Recepción', 5),
('C102', 'Piso 1 - Ala Norte', 6),
('C201', 'Piso 2 - Junto a Radiología', 5),
('C202', 'Piso 2 - Ala Sur', 6);

-- CITAS MÉDICAS
INSERT INTO citas_medicas (id_cita, medico, tipo_doc_paciente, numero_doc_paciente, id_consultorio, fecha, hora_inicio, duracion, estado)
VALUES
('A12546778931mc','MP001', 1, '100001', 'C101', '2025-11-30', '08:00', '30 minutos', 1),
('B225dds5545','MP002', 3, '100002', 'C102', '2025-11-27', '09:00', '45 minutos', 1),
('G654465646df16sdf','MP003', 2, '100003', 'C202', '2025-11-29', '10:30', '60 minutos', 1),
('Hdf54sf1s31fs84ds5','MP004', 4, '100004', 'C201', '2025-11-01', '14:00', '90 minutos', 1);