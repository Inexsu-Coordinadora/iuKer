// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, Plus, MoreVertical } from 'lucide-react';

// // Tipos de datos
// interface CitaMedica {
//   idCita: string;
//   paciente: string;
//   tipoDocPaciente: string;
//   numeroDocPaciente: string;
//   medico: string;
//   ubicacion: string | null;
//   consultorio: string | null;
//   fecha: string;
//   horaInicio: string;
//   codigoEstadoCita: number;
//   estadoCita: string;
//   idCitaAnterior: string | null;
// }

// interface ApiResponse {
//   cantidadCitas: number;
//   citasEncontradas: CitaMedica[];
// }

// interface DataTableProps {
//   baseUrl?: string;
//   title?: string;
//   primaryColor?: string;
// }

// const DataTable: React.FC<DataTableProps> = ({
//   baseUrl = 'http://127.0.0.1:3001/api/citas-medicas',
//   title = 'luker',
//   primaryColor = '#3B82F6', // Azul por defecto, fácilmente modificable
// }) => {
//   const [data, setData] = useState<CitaMedica[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchId, setSearchId] = useState<string>('');

//   // Función para obtener todas las citas
//   const fetchAllCitas = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get<ApiResponse>(baseUrl);
//       setData(response.data.citasEncontradas);
//     } catch (err) {
//       setError('Error al cargar las citas médicas');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Función para buscar por ID
//   const fetchCitaById = async (id: string) => {
//     if (!id.trim()) {
//       fetchAllCitas();
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const response = await axios.get(`${baseUrl}/${id}`);

//       console.log('Respuesta de la API por ID:', response.data);

//       // Verificar si la respuesta tiene la estructura de múltiples citas o una sola
//       if (response.data.citasEncontradas && Array.isArray(response.data.citasEncontradas)) {
//         // Si viene con el formato de array
//         setData(response.data.citasEncontradas);
//       } else if (response.data.citaEncontrada) {
//         // Si viene con citaEncontrada (singular)
//         setData([response.data.citaEncontrada]);
//       } else if (response.data.idCita) {
//         // Si viene un objeto único (una sola cita)
//         setData([response.data]);
//       } else {
//         // Si no reconocemos el formato
//         console.error('Formato de respuesta no reconocido:', response.data);
//         setError('Formato de respuesta no válido');
//         setData([]);
//       }
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 404) {
//           setError('No se encontró la cita con ese ID');
//         } else {
//           setError('Error al buscar la cita');
//         }
//       } else {
//         setError('Error al buscar la cita');
//       }
//       setData([]);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cargar datos al montar el componente
//   useEffect(() => {
//     fetchAllCitas();
//   }, []);

//   // Manejar búsqueda
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchCitaById(searchId);
//   };

//   // Formatear fecha
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return '-';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('es-CO', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//       });
//     } catch {
//       return '-';
//     }
//   };

//   // Formatear hora
//   const formatTime = (timeString: string | null) => {
//     if (!timeString) return '-';
//     return timeString.slice(0, 5); // Obtener HH:MM
//   };

//   return (
//     <div className='min-h-screen bg-gray-50 p-8'>
//       <div className='max-w-7xl mx-auto'>
//         {/* Header */}
//         <div className='mb-8'>
//           <h1 className='text-4xl font-light text-gray-800 text-center mb-6'>{title}</h1>

//           {/* Barra de búsqueda */}
//           <div className='flex gap-4 items-center'>
//             <form onSubmit={handleSearch} className='flex-1'>
//               <div className='relative'>
//                 <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
//                 <input
//                   type='text'
//                   value={searchId}
//                   onChange={(e) => setSearchId(e.target.value)}
//                   placeholder='Buscar por ID de cita...'
//                   className='w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
//                   style={{ borderColor: primaryColor }}
//                 />
//               </div>
//             </form>
//             <button
//               className='p-3 rounded-lg text-white hover:opacity-90 transition-opacity'
//               style={{ backgroundColor: primaryColor }}
//               onClick={() => {
//                 /* Agregar nueva cita */
//               }}
//             >
//               <Plus size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Tabla */}
//         <div className='bg-white rounded-lg border-2 overflow-hidden shadow-sm' style={{ borderColor: primaryColor }}>
//           {loading ? (
//             <div className='text-center py-12'>
//               <p className='text-gray-500'>Cargando...</p>
//             </div>
//           ) : error ? (
//             <div className='text-center py-12'>
//               <p className='text-red-500'>{error}</p>
//               <button
//                 onClick={fetchAllCitas}
//                 className='mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90'
//                 style={{ backgroundColor: primaryColor }}
//               >
//                 Recargar
//               </button>
//             </div>
//           ) : (
//             <div className='overflow-x-auto'>
//               <table className='w-full'>
//                 <thead className='bg-gray-100 border-b-2' style={{ borderColor: primaryColor }}>
//                   <tr>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Código cita</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Paciente</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Documento</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>N. documento</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Médico</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Consultorio</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Fecha</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Hora</th>
//                     <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Estado</th>
//                     <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>Acciones</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.length === 0 ? (
//                     <tr>
//                       <td colSpan={10} className='px-6 py-12 text-center text-gray-500'>
//                         No se encontraron citas médicas
//                       </td>
//                     </tr>
//                   ) : (
//                     data.map((cita, index) => (
//                       <tr
//                         key={`${cita.idCita}-${index}`}
//                         className={`border-b-2 hover:bg-gray-50 transition-colors ${
//                           index === data.length - 1 ? 'border-b-0' : ''
//                         }`}
//                         style={{ borderColor: index !== data.length - 1 ? primaryColor : 'transparent' }}
//                       >
//                         <td className='px-6 py-4 text-sm text-gray-700 font-mono text-xs'>{cita.idCita}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{cita.paciente}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{cita.tipoDocPaciente}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{cita.numeroDocPaciente}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{cita.medico}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{cita.consultorio || '-'}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{formatDate(cita.fecha)}</td>
//                         <td className='px-6 py-4 text-sm text-gray-700'>{formatTime(cita.horaInicio)}</td>
//                         <td className='px-6 py-4'>
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               cita.estadoCita === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
//                             }`}
//                           >
//                             {cita.estadoCita}
//                           </span>
//                         </td>
//                         <td className='px-6 py-4 text-center'>
//                           <button
//                             className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
//                             onClick={() => {
//                               /* Menú de acciones */
//                             }}
//                           >
//                             <MoreVertical size={18} className='text-gray-600' />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className='text-center mt-8 text-sm text-gray-500'>Copyright © 2025 iuKer®</div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Plus, MoreVertical, Calendar, Trash2 } from 'lucide-react';

// Tipos de datos
interface CitaMedica {
  idCita: string;
  paciente: string;
  tipoDocPaciente: string;
  numeroDocPaciente: string;
  medico: string;
  ubicacion: string | null;
  consultorio: string | null;
  fecha: string;
  horaInicio: string;
  codigoEstadoCita: number;
  estadoCita: string;
  idCitaAnterior: string | null;
}

interface ApiResponse {
  cantidadCitas: number;
  citasEncontradas: CitaMedica[];
}

interface DataTableProps {
  baseUrl?: string;
  title?: string;
  primaryColor?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  baseUrl = 'http://127.0.0.1:3001/api/citas-medicas',
  title = 'luker',
  primaryColor = '#3B82F6',
}) => {
  const [data, setData] = useState<CitaMedica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Función para obtener todas las citas
  const fetchAllCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>(baseUrl);
      setData(response.data.citasEncontradas);
    } catch (err) {
      setError('Error al cargar las citas médicas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar por ID
  const fetchCitaById = async (id: string) => {
    if (!id.trim()) {
      fetchAllCitas();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${baseUrl}/${id}`);

      console.log('Respuesta de la API por ID:', response.data);

      // Verificar si la respuesta tiene la estructura de múltiples citas o una sola
      if (response.data.citasEncontradas && Array.isArray(response.data.citasEncontradas)) {
        setData(response.data.citasEncontradas);
      } else if (response.data.citaEncontrada) {
        setData([response.data.citaEncontrada]);
      } else if (response.data.idCita) {
        setData([response.data]);
      } else {
        console.error('Formato de respuesta no reconocido:', response.data);
        setError('Formato de respuesta no válido');
        setData([]);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No se encontró la cita con ese ID');
        } else {
          setError('Error al buscar la cita');
        }
      } else {
        setError('Error al buscar la cita');
      }
      setData([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllCitas();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Alternar menú desplegable
  const toggleMenu = (citaId: string) => {
    setOpenMenuId(openMenuId === citaId ? null : citaId);
  };

  // Manejar reagendamiento
  const handleReagendar = async (cita: CitaMedica) => {
    console.log('Reagendar cita:', cita);
    alert(`Reagendar cita: ${cita.idCita}`);
    setOpenMenuId(null);
  };

  // Manejar eliminación
  const handleEliminar = async (cita: CitaMedica) => {
    if (!window.confirm(`¿Está seguro que desea eliminar la cita ${cita.idCita}?`)) {
      return;
    }

    try {
      await axios.delete(`${baseUrl}/eliminacion/${cita.idCita}`);
      await fetchAllCitas();
      alert('Cita eliminada exitosamente');
    } catch (err) {
      console.error('Error al eliminar la cita:', err);
      alert('Error al eliminar la cita');
    }
    setOpenMenuId(null);
  };

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCitaById(searchId);
  };

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '-';
    }
  };

  // Formatear hora
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    return timeString.slice(0, 5);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-light text-gray-800 text-center mb-6'>{title}</h1>

          {/* Barra de búsqueda */}
          <div className='flex gap-4 items-center'>
            <form onSubmit={handleSearch} className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
                <input
                  type='text'
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder='Buscar por ID de cita...'
                  className='w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors'
                  style={{ borderColor: primaryColor }}
                />
              </div>
            </form>
            <button
              className='p-3 rounded-lg text-white hover:opacity-90 transition-opacity'
              style={{ backgroundColor: primaryColor }}
              onClick={() => {
                /* Agregar nueva cita */
              }}
            >
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className='bg-white rounded-lg border-2 overflow-hidden shadow-sm' style={{ borderColor: primaryColor }}>
          {loading ? (
            <div className='text-center py-12'>
              <p className='text-gray-500'>Cargando...</p>
            </div>
          ) : error ? (
            <div className='text-center py-12'>
              <p className='text-red-500'>{error}</p>
              <button
                onClick={fetchAllCitas}
                className='mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90'
                style={{ backgroundColor: primaryColor }}
              >
                Recargar
              </button>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead className='bg-gray-100 border-b-2' style={{ borderColor: primaryColor }}>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Código cita</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Paciente</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Documento</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>N. documento</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Médico</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Consultorio</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Fecha</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Hora</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>Estado</th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={10} className='px-6 py-12 text-center text-gray-500'>
                        No se encontraron citas médicas
                      </td>
                    </tr>
                  ) : (
                    data.map((cita, index) => (
                      <tr
                        key={`${cita.idCita}-${index}`}
                        className={`border-b-2 hover:bg-gray-50 transition-colors ${
                          index === data.length - 1 ? 'border-b-0' : ''
                        }`}
                        style={{ borderColor: index !== data.length - 1 ? primaryColor : 'transparent' }}
                      >
                        <td className='px-6 py-4 text-sm text-gray-700 font-mono text-xs'>{cita.idCita}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.paciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.tipoDocPaciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.numeroDocPaciente}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.medico}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{cita.consultorio || '-'}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{formatDate(cita.fecha)}</td>
                        <td className='px-6 py-4 text-sm text-gray-700'>{formatTime(cita.horaInicio)}</td>
                        <td className='px-6 py-4'>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              cita.estadoCita === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {cita.estadoCita}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <div className='relative' ref={openMenuId === cita.idCita ? menuRef : null}>
                            <button
                              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                              onClick={() => toggleMenu(cita.idCita)}
                            >
                              <MoreVertical size={18} className='text-gray-600' />
                            </button>

                            {/* Menú desplegable */}
                            {openMenuId === cita.idCita && (
                              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10'>
                                <button
                                  onClick={() => handleReagendar(cita)}
                                  className='w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                  <Calendar size={16} style={{ color: primaryColor }} />
                                  <span>Reagendar cita</span>
                                </button>
                                <div className='border-t border-gray-100'></div>
                                <button
                                  onClick={() => handleEliminar(cita)}
                                  className='w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-lg'
                                >
                                  <Trash2 size={16} />
                                  <span>Eliminar cita</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='text-center mt-8 text-sm text-gray-500'>Copyright © 2025 iuKer®</div>
      </div>
    </div>
  );
};

export default DataTable;
