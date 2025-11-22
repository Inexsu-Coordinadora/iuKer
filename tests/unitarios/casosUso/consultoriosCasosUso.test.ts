import { describe, it, expect, beforeEach, afterEach, jest as jestImport } from '@jest/globals';
import { ConsultorioCasosUso } from '../../../src/core/aplicacion/consultorio/ConsultoriosCasosUso.js';
import { IConsultoriosRepositorio } from '../../../src/core/dominio/consultorio/IConsultoriosRepositorio.js';
import { IConsultorio } from '../../../src/core/dominio/consultorio/IConsultorio.js';
import { ConsultorioRespuestaDTO } from '../../../src/core/infraestructura/repositorios/postgres/dtos/consultorioRespuestaDTO.js';

describe('ConsultorioCasosUso', () => {
  let consultorioCasosUso: ConsultorioCasosUso;
  let mockRepositorio: jest.Mocked<IConsultoriosRepositorio>;

  // Datos de prueba
  const consultorioMock: IConsultorio = {
    idConsultorio: 'CONS-001',
    ubicacion: 'Edificio A, Piso 2',
  };

  const consultorioRespuestaMock: ConsultorioRespuestaDTO = {
    idConsultorio: 'CONS-001',
    ubicacion: 'Edificio A, Piso 2',
  };

  beforeEach(() => {
    // Crear mock del repositorio
    mockRepositorio = {
      agregarConsultorio: jestImport.fn() as any,
      listarConsultorios: jestImport.fn() as any,
      obtenerConsultorioPorId: jestImport.fn() as any,
      actualizarConsultorio: jestImport.fn() as any,
      eliminarConsultorio: jestImport.fn() as any,
    } as jest.Mocked<IConsultoriosRepositorio>;

    // Crear instancia del caso de uso con el mock
    consultorioCasosUso = new ConsultorioCasosUso(mockRepositorio);

    // Mockear console.log para evitar salida en tests
    jestImport.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jestImport.clearAllMocks();
  });

  describe('agregarConsultorio', () => {
    it('debería agregar un consultorio exitosamente cuando no existe', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act
      const resultado = await consultorioCasosUso.agregarConsultorio(consultorioMock);

      // Assert
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioMock);
      expect(resultado).toEqual(consultorioRespuestaMock);
    });

    it('debería lanzar error cuando el consultorio ya existe', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act & Assert
      await expect(consultorioCasosUso.agregarConsultorio(consultorioMock))
        .rejects
        .toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(mockRepositorio.agregarConsultorio).not.toHaveBeenCalled();
    });

    it('debería validar que se llame al repositorio con los datos correctos', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      const nuevoConsultorio: IConsultorio = {
        idConsultorio: 'CONS-002',
        ubicacion: 'Edificio B, Piso 1',
      };

      // Act
      await consultorioCasosUso.agregarConsultorio(nuevoConsultorio);

      // Assert
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(nuevoConsultorio);
    });
  });

  describe('listarConsultorios', () => {
    it('debería listar todos los consultorios sin límite', async () => {
      // Arrange
      const consultoriosEsperados: ConsultorioRespuestaDTO[] = [
        { idConsultorio: 'CONS-001', ubicacion: 'Edificio A' },
        { idConsultorio: 'CONS-002', ubicacion: 'Edificio B' },
        { idConsultorio: 'CONS-003', ubicacion: 'Edificio C' },
      ];
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue(consultoriosEsperados);

      // Act
      const resultado = await consultorioCasosUso.listarConsultorios();

      // Assert
      expect(mockRepositorio.listarConsultorios).toHaveBeenCalledWith(undefined);
      expect(resultado).toEqual(consultoriosEsperados);
      expect(resultado).toHaveLength(3);
    });

    it('debería listar consultorios con límite especificado', async () => {
      // Arrange
      const limite = 5;
      const consultoriosEsperados: ConsultorioRespuestaDTO[] = [
        { idConsultorio: 'CONS-001', ubicacion: 'Edificio A' },
        { idConsultorio: 'CONS-002', ubicacion: 'Edificio B' },
      ];
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue(consultoriosEsperados);

      // Act
      const resultado = await consultorioCasosUso.listarConsultorios(limite);

      // Assert
      expect(mockRepositorio.listarConsultorios).toHaveBeenCalledWith(limite);
      expect(resultado).toEqual(consultoriosEsperados);
    });

    it('debería retornar array vacío cuando no hay consultorios', async () => {
      // Arrange
      (mockRepositorio.listarConsultorios as jest.Mock).mockResolvedValue([]);

      // Act
      const resultado = await consultorioCasosUso.listarConsultorios();

      // Assert
      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });
  });

  describe('obtenerConsultorioPorId', () => {
    it('debería obtener un consultorio existente por ID', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act
      const resultado = await consultorioCasosUso.obtenerConsultorioPorId('CONS-001');

      // Assert
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(resultado).toEqual(consultorioRespuestaMock);
      expect(console.log).toHaveBeenCalledWith(consultorioRespuestaMock);
    });

    it('debería lanzar error cuando el consultorio no existe', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(consultorioCasosUso.obtenerConsultorioPorId('CONS-999'))
        .rejects
        .toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
    });

    it('debería hacer log del consultorio encontrado', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);

      // Act
      await consultorioCasosUso.obtenerConsultorioPorId('CONS-001');

      // Assert
      expect(console.log).toHaveBeenCalledWith(consultorioRespuestaMock);
    });
  });

  describe('actualizarConsultorio', () => {
    it('debería actualizar un consultorio existente', async () => {
      // Arrange
      const consultorioActualizado: ConsultorioRespuestaDTO = {
        idConsultorio: 'CONS-001',
        ubicacion: 'Edificio A, Piso 3 - Actualizado',
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.actualizarConsultorio as jest.Mock).mockResolvedValue(consultorioActualizado);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'CONS-001',
        ubicacion: 'Edificio A, Piso 3 - Actualizado',
      };

      // Act
      const resultado = await consultorioCasosUso.actualizarConsultorio(
        'CONS-001',
        datosActualizacion
      );

      // Assert
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(mockRepositorio.actualizarConsultorio).toHaveBeenCalledWith(
        'CONS-001',
        datosActualizacion
      );
      expect(resultado).toEqual(consultorioActualizado);
    });

    it('debería lanzar error cuando el consultorio a actualizar no existe', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'CONS-999',
        ubicacion: 'Nueva ubicación',
      };

      // Act & Assert
      await expect(
        consultorioCasosUso.actualizarConsultorio('CONS-999', datosActualizacion)
      ).rejects.toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
      expect(mockRepositorio.actualizarConsultorio).not.toHaveBeenCalled();
    });

    it('debería retornar null cuando la actualización no retorna datos', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.actualizarConsultorio as jest.Mock).mockResolvedValue(null);

      const datosActualizacion: IConsultorio = {
        idConsultorio: 'CONS-001',
        ubicacion: 'Nueva ubicación',
      };

      // Act
      const resultado = await consultorioCasosUso.actualizarConsultorio(
        'CONS-001',
        datosActualizacion
      );

      // Assert
      expect(resultado).toBeNull();
    });
  });

  describe('eliminarConsultorio', () => {
    it('debería eliminar un consultorio existente', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(consultorioRespuestaMock);
      (mockRepositorio.eliminarConsultorio as jest.Mock).mockResolvedValue(undefined);

      // Act
      await consultorioCasosUso.eliminarConsultorio('CONS-001');

      // Assert
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(mockRepositorio.eliminarConsultorio).toHaveBeenCalledWith('CONS-001');
    });

    it('debería lanzar error cuando el consultorio a eliminar no existe', async () => {
      // Arrange
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(consultorioCasosUso.eliminarConsultorio('CONS-999'))
        .rejects
        .toThrow();

      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-999');
      expect(mockRepositorio.eliminarConsultorio).not.toHaveBeenCalled();
    });

    it('debería verificar existencia antes de eliminar', async () => {
      // Arrange
      const ordenDeLlamadas: string[] = [];
      
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockImplementation(async (id: string) => {
        ordenDeLlamadas.push('obtener');
        return consultorioRespuestaMock;
      });
      
      (mockRepositorio.eliminarConsultorio as jest.Mock).mockImplementation(async (id: string) => {
        ordenDeLlamadas.push('eliminar');
      });

      // Act
      await consultorioCasosUso.eliminarConsultorio('CONS-001');

      // Assert
      expect(ordenDeLlamadas).toEqual(['obtener', 'eliminar']);
      expect(mockRepositorio.obtenerConsultorioPorId).toHaveBeenCalledWith('CONS-001');
      expect(mockRepositorio.eliminarConsultorio).toHaveBeenCalledWith('CONS-001');
    });
  });

  describe('Casos de borde y validaciones', () => {
    it('debería manejar consultorios con ubicación null', async () => {
      // Arrange
      const consultorioSinUbicacion: IConsultorio = {
        idConsultorio: 'CONS-003',
        ubicacion: null,
      };
      const respuesta: ConsultorioRespuestaDTO = {
        idConsultorio: 'CONS-003',
        ubicacion: '',
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue(respuesta);

      // Act
      const resultado = await consultorioCasosUso.agregarConsultorio(consultorioSinUbicacion);

      // Assert
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioSinUbicacion);
      expect(resultado).toEqual(respuesta);
    });

    it('debería manejar consultorios con ubicación undefined', async () => {
      // Arrange
      const consultorioSinUbicacion: IConsultorio = {
        idConsultorio: 'CONS-004',
        ubicacion: undefined,
      };
      (mockRepositorio.obtenerConsultorioPorId as jest.Mock).mockResolvedValue(null);
      (mockRepositorio.agregarConsultorio as jest.Mock).mockResolvedValue({
        idConsultorio: 'CONS-004',
        ubicacion: '',
      });

      // Act
      await consultorioCasosUso.agregarConsultorio(consultorioSinUbicacion);

      // Assert
      expect(mockRepositorio.agregarConsultorio).toHaveBeenCalledWith(consultorioSinUbicacion);
    });
  });
});