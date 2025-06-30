'use client'
import { useCallback } from 'react'

import { useState, useEffect, useMemo, useContext } from 'react'
import Swal from "sweetalert2";
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
interface TableData {
  columns: string[]
  rows: Record<string, any>[]
  total?: number
}

export default function DatabaseManager() {
  const [tables, setTables] = useState<string[]>([])
  const [selectedTable, setSelectedTable] = useState('')
  const { accessToken } = useContext(AuthContext);
  const router=useRouter()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<Record<string, any>>({})
  const [newRecordForm, setNewRecordForm] = useState<Record<string, any>>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null)
useEffect(() => {
        if (!accessToken) {
          router.push('/logincomsenha') 
        }
      }, [accessToken, router])
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://backend-django-2-7qpl.onrender.com/tables/')
        const data = await response.json()
        console.log(data.tables)
        
        if (!response.ok) throw new Error(data.error || 'Failed to fetch tables')
        setTables(data.tables)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTables()
  }, [])


  const fetchTableData = useCallback(async () => {
    if (!selectedTable) return

    try {
      setLoading(true)
      setError(null)
      const query = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        search: searchTerm,
        sort: sortConfig ? `${sortConfig.key},${sortConfig.direction}` : ''
      })

      const response = await fetch(
        `https://backend-django-2-7qpl.onrender.com/tables/${selectedTable}/data/?${query}`
      )
      const data = await response.json()
      console.log(data)
      if (!response.ok) throw new Error(data.error || 'Failed to fetch table data')
      setTableData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setTableData(null)
    } finally {
      setLoading(false)
    }
  }, [selectedTable, currentPage, pageSize, searchTerm, sortConfig])

  useEffect(() => {
    fetchTableData()
  }, [fetchTableData])

  const handleEditClick = (row: Record<string, any>) => {
    setEditingId(row.id)
    setEditFormData({...row})
  }

  const handleEditChange = (column: string, value: any) => {
    setEditFormData(prev => ({
      ...prev,
      [column]: value
    }))
  }

  const handleUpdate = async () => {
    if (!editingId || !selectedTable) return

    try {
      setLoading(true)
      const response = await fetch(
        `https://backend-django-2-7qpl.onrender.com/tables/${selectedTable}/data/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingId,
            ...editFormData
          })
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Falha')

      await fetchTableData()
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    if (!confirm('Tem certeza que deseja excluir este registro permanentemente?')) return

    try {
      setLoading(true)
      const response = await fetch(
        `https://backend-django-2-7qpl.onrender.com/tables/${selectedTable}/data/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id })
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to delete record')

      await fetchTableData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete record')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
  if (!selectedTable) return

  try {
    setLoading(true)

    const campos = Object.keys(newRecordForm)
    const nome1 = campos.find(c => c.toLowerCase() === 'nome')
    const email1 = campos.find(c => c.toLowerCase() === 'email')

    if (nome1 && email1) {
      const funcionarioCampos = {
        nome: newRecordForm[nome1],
        email: newRecordForm[email1],
      }

      const funcionarioResponse = await fetch('https://backend-django-2-7qpl.onrender.com/api/funcionarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionarioCampos),
      })

      const funcionarioData = await funcionarioResponse.json()
      if (!funcionarioResponse.ok) throw new Error(funcionarioData.error || 'Funcionário já registrado')

    }

    const response = await fetch(`https://backend-django-2-7qpl.onrender.com/data/${selectedTable}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecordForm),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Erro ao criar registro')
    if(response.ok){
      Swal.fire('Cadastrado', 'sucess')
    }
      await fetchTableData()
      setNewRecordForm({})
      setShowCreateForm(false)

  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao criar registro')
  } finally {
    setLoading(false)
  }
}


  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const totalPages = tableData?.total ? Math.ceil(tableData.total / pageSize) : 0

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-blue-700 sm:text-4xl 
      font-bold ">Gerenciador de Departamentos</h1>
        
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="table-select" className="block text-sm font-medium text-gray-700 mb-1">
              Selecione uma tabela:
            </label>
            <select
              id="table-select"
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value)
                setCurrentPage(1)
                setSearchTerm('')
                setSortConfig(null)
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            >
              <option value="">-- Selecione --</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar:
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              placeholder="Digite para filtrar"
            />
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={!selectedTable}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            + Novo Registro
          </button>
        </div>
      </div>

      {/* Mensagens de Erro */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Carregando dados...</p>
        </div>
      )}

      {showCreateForm && selectedTable && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Criar Novo Registro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tableData?.columns
              .filter(col => col !== 'id') // Remove campo ID
              .map((column) => (
                <div key={column}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column}
                  </label>
                  <input
                  title='hello'
                    type="text"
                    value={newRecordForm[column] || ''}
                    onChange={(e) => setNewRecordForm({
                      ...newRecordForm,
                      [column]: e.target.value
                    })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Tabela de Dados */}
      {tableData && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableData.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => requestSort(column)}
                    >
                      <div className="flex items-center">
                        {column}
                        {sortConfig?.key === column && (
                          <span className="ml-1">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {tableData.columns.map((column) => (
                      <td
                        key={`${rowIndex}-${column}`}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {editingId === row.id ? (
                          <input
                          title='hello'
                            type="text"
                            value={editFormData[column] || ''}
                            onChange={(e) => handleEditChange(column, e.target.value)}
                            className="border rounded p-1 w-full"
                          />
                        ) : (
                          String(row[column])
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingId === row.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdate}
                            className="text-green-600 hover:text-green-900"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Próxima
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * pageSize, tableData.total || 0)}</span> de{' '}
                    <span className="font-medium">{tableData.total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Primeira</span>
                      «
                    </button>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      Próxima
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Última</span>
                      »
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
