'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from "sweetalert2"
import Link from 'next/link';
type FieldDefinition = {
  name: string;
  type: string;
  length?: number;
  constraints?: string;
  isSystemField?: boolean;
};

export default function CreateTablePage() {
  const router = useRouter();
  const [tableName, setTableName] = useState('');
  const [fields, setFields] = useState<FieldDefinition[]>([
    {
      name: 'id',
      type: 'int',
      constraints: 'NOT NULL AUTO_INCREMENT PRIMARY KEY',
      isSystemField: true
    }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fieldTypes = [
    'varchar'
    // 'int', 'varchar', 'text', 'bigint',
    // 'decimal', 'datetime', 'date', 'tinyint',
    // 'float', 'double', 'timestamp', 'json'
  ];

  const commonConstraints = [
    'Nenhuma'
    // 'NOT NULL', 'UNIQUE',
    // 'DEFAULT CURRENT_TIMESTAMP', 'DEFAULT NULL'
  ];

  let normalizedTableName = ''

  const handleFieldChange = (index: number, key: keyof FieldDefinition, value: string | number) => {
    if (fields[index].isSystemField) return;

    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };

    if (key === 'type' && !['varchar', 'char', 'decimal'].includes(value as string)) {
      delete newFields[index].length;
    }

    setFields(newFields);
  };

  const addField = () => {
    setFields([fields[0], ...fields.slice(1), { name: '', type: 'varchar' }]);
  };

  const removeField = (index: number) => {
    if (fields[index].isSystemField) return;

    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const validateFields = () => {

      console.log(normalizedTableName)

    // if (!tableName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
    //   setError('Nome deve começar com letra/underscore e conter apenas letras, números e underscores');
    //   return false;
    // }
const customFields = fields.filter(f => !f.isSystemField);
if (customFields.length === 0) {
  Swal.fire({
    icon: 'warning',
    title: 'Campo insuficiente',
    text: 'Adicione pelo menos um campo além do Departamento',
  });
  return false;
}
    if (tableName.length > 64) {
      setError('Nome da tabela não pode exceder 64 caracteres');
      return false;
    }

    const idField = fields.find(f => f.isSystemField);
    if (!idField ||
        idField.name !== 'id' ||
        idField.type !== 'int' ||
        idField.constraints !== 'NOT NULL AUTO_INCREMENT PRIMARY KEY') {
      setError('O campo ID do sistema não pode ser modificado');
      return false;
    }

    for (const field of fields) {
      if (field.isSystemField) continue;

      if (!field.name) {
        setError('Todos os campos devem ter um nome');
        return false;
      }

      if (field.name.length > 64) {
        setError('Nome de campo não pode exceder 64 caracteres');
        return false;
      }

      if (['varchar', 'char'].includes(field.type) && (!field.length || field.length < 1)) {
        setError(`Campo ${field.name} do tipo ${field.type} precisa de um tamanho`);
        return false;
      }

      if (field.type === 'decimal' && (!field.length || field.length < 1)) {
        setError('Campo decimal precisa ter uma precisão definida');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    setIsSubmitting(true);
    setError(null);

normalizedTableName = tableName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w]/g, '_'); // Espaços viram _, símbolos são removidos

console.log(normalizedTableName)

fields.forEach(item => {
  item.name = item.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w]/g, '_'); // Espaços viram _, símbolos são removidos

    console.log(item.name)
});

    try {
      const response = await fetch('https://backend-django-2-7qpl.onrender.com/tables/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: normalizedTableName,
          fields: fields.map(field => ({
            name: field.name,
            type: field.type,
            length: ['varchar', 'char', 'decimal'].includes(field.type) ? field.length : undefined,
            constraints: field.constraints
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Erro ao criar Departamento: 
          1. Garanta que está configurando um novo Departamento;
          2. Garanta que o Nome do Departamento e dos campos sejam válidos. `);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Personalize sua Empresa</h1>
          <p className="mt-2 text-sm text-gray-600">
            Defina a estrutura da sua Empresa. O campo ID é obrigatório e configurado automaticamente.
          </p>
          <Link className='text-gray-500 mt-10 p-7 text-3xl ' href='/admin' >Ir direito para o painel</Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Tabela criada com sucesso!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Redirecionando para a lista de tabelas...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Departamento já existente
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="tableName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Departamento *
                  </label>
                  <input
                    type="text"
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    placeholder="ex: TI, recursos_humanos"
                    required
                    maxLength={64}
                    aria-label="Nome da tabela a ser criada"
                    title="Digite o nome da tabela"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Deve começar com letra ou underscore, conter apenas letras, números e underscores (max 64 chars)
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-medium text-gray-700">
                      Campos da Tabela *
                    </h2>
                    <button
                      type="button"
                      onClick={addField}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      aria-label="Adicionar novo campo"
                      title="Adicionar novo campo à tabela"
                    >
                      Adicionar Campo
                    </button>
                  </div>

                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4">
                        {field.isSystemField ? (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nome do Campo *
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                readOnly
                                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                                aria-label="Campo ID (sistema)"
                                title="Campo ID do sistema"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tipo *
                              </label>
                              <input
                                type="text"
                                value={field.type}
                                readOnly
                                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                                aria-label="Tipo do campo ID"
                                title="Tipo do campo ID"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Restrições *
                              </label>
                              <input
                                type="text"
                                value={field.constraints}
                                readOnly
                                className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 sm:text-sm p-2 border"
                                aria-label="Restrições do campo ID"
                                title="Restrições do campo ID"
                              />
                            </div>

                            <div className="flex items-end">
                              <span className="text-xs text-gray-500">
                                Campo obrigatório (ID)
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Nome do Campo *
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                                maxLength={64}
                                placeholder="nome_do_campo"
                                aria-label={`Nome do campo ${index}`}
                                title={`Digite o nome para o campo ${index}`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tipo *
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                aria-label={`Tipo do campo ${field.name || index}`}
                                title={`Selecione o tipo para o campo ${field.name || index}`}
                              >
                                {fieldTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Tamanho {['varchar', 'char', 'decimal'].includes(field.type) && '*'}
                              </label>
                              <input
                                type="number"
                                value={field.length || ''}
                                onChange={(e) => handleFieldChange(index, 'length', e.target.value ? parseInt(e.target.value) : '')}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                min="1"
                                max="65535"
                                disabled={!['varchar', 'char', 'decimal'].includes(field.type)}
                                required={['varchar', 'char', 'decimal'].includes(field.type)}
                                placeholder={
                                  field.type === 'decimal' ? 'Precisão (ex: 10)' : 'Tamanho (ex: 255)'
                                }
                                aria-label={`Tamanho para o campo ${field.name || index}`}
                                title={`Digite o tamanho para o campo ${field.name || index}`}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Restrições
                              </label>
                              <select
                                value={field.constraints || ''}
                                onChange={(e) => handleFieldChange(index, 'constraints', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                aria-label={`Restrições para o campo ${field.name || index}`}
                                title={`Selecione restrições para o campo ${field.name || index}`}
                              >
                                <option value="">Nenhuma</option>
                                {commonConstraints.map((constraint) => (
                                  <option key={constraint} value={constraint}>
                                    {constraint}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {!field.isSystemField && (
                          <button
                            type="button"
                            onClick={() => removeField(index)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-label={`Remover campo ${field.name || index}`}
                            title={`Remover campo ${field.name || index}`}
                          >
                            Remover Campo
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Cancelar criação de tabela"
                    title="Cancelar e voltar"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    aria-label="Criar tabela"
                    title="Criar tabela com os campos definidos"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Criando...
                      </>
                    ) : (
                      'Criar Tabela'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
