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
(2, 'Pendiente'),
(3, 'Cancelada'),
(4, 'Finalizada'),
(5, 'Ocupado'),
(6, 'Disponible');

-- PACIENTES
INSERT INTO pacientes (numero_doc, tipo_doc, nombre, apellido, fecha_nacimiento, sexo, email, telefono, direccion)
VALUES
('100001', 1, 'Juan', 'Pérez', '1995-06-15', 'M', 'juan.perez@mail.com', '3001112233', 'Cra 45 #12-30'),
('100002', 1, 'Laura', 'Gómez', '1992-04-20', 'F', 'laura.gomez@mail.com', '3012223344', 'Cll 80 #45-10'),
('100003', 1, 'Andrés', 'Ramírez', '1988-10-05', 'M', 'andres.ramirez@mail.com', '3023334455', 'Av 30 #9-22'),
('100004', 2, 'María', 'López', '2000-01-12', 'F', 'maria.lopez@mail.com', '3044445566', 'Cll 10 #50-60');

-- MÉDICOS
INSERT INTO medicos (tarjeta_profesional, numero_doc, nombre, apellido, fecha_nacimiento, sexo, especialidad, email, telefono)
VALUES
('MP001', '900001', 'Carlos', 'Rodríguez', '1980-03-12', 'M', 'Medicina General', 'carlos.rodriguez@clinicaiuker.com', '3105556677'),
('MP002', '900002', 'Sofía', 'Martínez', '1985-11-23', 'F', 'Pediatría', 'sofia.martinez@clinicaiuker.com', '3116667788'),
('MP003', '900003', 'Julián', 'García', '1978-09-08', 'M', 'Cardiología', 'julian.garcia@clinicaiuker.com', '3127778899'),
('MP004', '900004', 'Valentina', 'Ruiz', '1990-02-17', 'F', 'Dermatología', 'valentina.ruiz@clinicaiuker.com', '3138889900');

-- CONSULTORIOS
INSERT INTO consultorios (id_consultorio, ubicacion, estado)
VALUES
('C101', 'Piso 1 - Frente a Recepción', 5),
('C102', 'Piso 1 - Ala Norte', 6),
('C201', 'Piso 2 - Junto a Radiología', 5),
('C202', 'Piso 2 - Ala Sur', 6);

-- CITAS MÉDICAS
INSERT INTO citas_medicas (medico, tipo_doc_paciente, numero_doc_paciente, consultorio, fecha, hora_inicio, duracion, estado, id_cita_anterior)
VALUES
('MP001', 1, '100001', 'C101', '2025-10-30', '08:00', INTERVAL '30 minutes', 2, NULL),
('MP002', 3, '100002', 'C102', '2025-10-30', '09:00', INTERVAL '45 minutes', 1, NULL),
('MP003', 2, '100003', 'C202', '2025-10-31', '10:30', INTERVAL '60 minutes', 4, NULL),
('MP004', 1, '100004', 'C201', '2025-11-01', '14:00', INTERVAL '30 minutes', 3, NULL);

