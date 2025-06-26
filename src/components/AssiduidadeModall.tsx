'use client';

import { useState, useEffect } from "react";

interface AssiduidadeFormData {
  funcionario: number; // Envia o ID do funcionário
  entrada: string;
  saida?: string;
  data: string;
}

interface AssiduidadeModalProps {
  type: "create" | "edit";
  existingData?: (AssiduidadeFormData & { id: number });
  onSuccess: (updatedData?: any) => void;
  onClose: () => void;
}

export default function AssiduidadeModal({
  type,
  existingData,
  onSuccess,
  onClose,
}: AssiduidadeModalProps) {
  const [formData, setFormData] = useState<AssiduidadeFormData>({
    funcionario: existingData ? existingData.funcionario : 0,
    entrada: existingData ? existingData.entrada : "",
    saida: existingData ? existingData.saida : "",
    data: existingData ? existingData.data : "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  // Buscar a lista de funcionários para o select, se necessário
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/funcionarios/")
      .then((res) => res.json())
      .then((data) => setFuncionarios(data))
      .catch((err) => console.error("Erro ao buscar funcionários:", err));
  }, []);

  // Preenche os campos se houver existingData no modo de edição
  useEffect(() => {
    if (existingData && type === "edit") {
      setFormData({
        funcionario: existingData.funcionario,
        entrada: existingData.entrada,
        saida: existingData.saida || "",
        data: existingData.data,
      });
    }
  }, [existingData, type]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "funcionario") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = type === "edit" ? "PUT" : "POST";
      const url =
        type === "edit" && existingData
          ? `http://127.0.0.1:8000/api/assiduidade/${existingData.id}/`
          : "http://127.0.0.1:8000/api/assiduidade/";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Erro ao salvar assiduidade");
      }

      const data = await res.json();
      alert("Assiduidade salva com sucesso!");
      onSuccess(data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === "create" ? "Registrar Check-In" : "Registrar Check-Out"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-2xl leading-none focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "create" && (
            <>
              <div>
                <label htmlFor="funcionario-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Funcionário
                </label>
                <select
                  id="funcionario-select"
                  name="funcionario"
                  value={formData.funcionario || ""}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Funcionário"
                >
                  <option value="">Selecione o Funcionário</option>
                  {funcionarios.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Entrada
                </label>
                <input
                  type="time"
                  name="entrada"
                  value={formData.entrada}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  title="Informe a hora de entrada"
                  placeholder="Informe a hora de entrada"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  title="Informe a hora de entrada"
                  placeholder="Informe a hora de entrada"
                />
              </div>
            </>
          )}
          {type === "edit" && (
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                title="Informe a hora de saída"
              >
                Hora de Saída
              </label>
              <input
                type="time"
                name="saida"
                value={formData.saida || ""}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Informe a hora de saída"
                title="Informe a hora de saída"
              />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm">
              <strong>{error}</strong>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {loading
              ? "Salvando..."
              : type === "create"
              ? "Registrar Check-In"
              : "Registrar Check-Out"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
