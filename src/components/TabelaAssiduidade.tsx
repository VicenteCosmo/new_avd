'use client';

import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Registro {
  id: number;
  funcionario_nome: string;
  hora_entrada: string;
  hora_saida: string | null;
}

export default function TabelaAssiduidade() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  const fetchRegistros = () => {
    fetch('http://localhost:8000/api/assiduidade/')
      .then(res => res.json())
      .then(data => setRegistros(data));
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  const exportarPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Funcionário', 'Hora de Entrada', 'Hora de Saída']],
      body: registros.map(r => [
        r.funcionario_nome,
        r.hora_entrada,
        r.hora_saida || '---'
      ]),
    });
    doc.save('relatorio_assiduidade.pdf');
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Registros de Assiduidade</h3>
        <button onClick={exportarPDF} className="btn-primary">Exportar PDF</button>
      </div>

      <table className="w-full table-auto border-collapse shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Funcionário</th>
            <th className="p-2">Entrada</th>
            <th className="p-2">Saída</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(r => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{r.funcionario_nome}</td>
              <td className="p-2">{r.hora_entrada}</td>
              <td className="p-2">{r.hora_saida || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
