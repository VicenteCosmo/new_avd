'use client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DownloadIcon } from 'lucide-react';

const Badge = ({ color, children }: { color: string, children: React.ReactNode }) => (
  <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${color}`}>
    {children}
  </span>
);

export type Leave = {
  id: number;
  motivo: string;
  inicio: string;
  fim: string;
  justificativo: string | null;
  status: "pendente" | "aprovado" | "rejeitado";
  admin_comentario: string | null;
  created_at: string;
  funcionario_nome: string;
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function DispensaFuncionario() {
  const { accessToken, userLoading } = useContext(AuthContext);
  const [dispensa, setdispensa] = useState<Leave[]>([]);
  const [motivo, setmotivo] = useState("");
  const [inicio, setinicio] = useState("");
  const [fim, setfim] = useState("");
  const [documento, setdocumento] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const exportarPDF = () => {
      const doc = new jsPDF();
      doc.text('Relatório de Dispensa', 14, 16);
      autoTable(doc, {
        head: [['Funcionário', 'Entrada', 'Saída', 'Data', 'Duração']],
        body: dispensa.map(a => [
          a.funcionario_nome,
          a.motivo,
          a.inicio || '-',
          a.fim,
        ]),
        startY: 20,
      });
      doc.save('relatorio-dispensa.pdf');
    };
  
  useEffect(() => {
    fetch("https://backend-django-2-7qpl.onrender.com/api/dispensa/my/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
     .then((j) => setdispensa(Array.isArray(j.message) ? j.message : j))
      .finally(() => setLoading(false));
  }, [accessToken]);
  useEffect(() => {
    if (!accessToken && !userLoading) {
      router.push('/logincomsenha')
    }
  }, [accessToken, router, userLoading]);
const DeletarDados = async (pk: number) => {
  try {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, cancelar!'
    });

    if (result.isConfirmed) {
      const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/deletar-dispensa/${pk}/`, {
        method: "DELETE",
      });
      await res.json();
      setdispensa((prev) => prev.filter((item) => item.id !== pk));

      Swal.fire(
        'Cancelado!',
        'Pedido Cancelado',
        'success'
      );
    }
  } catch {

  }
}
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setdocumento(e.target.files[0]);
  };
function calculateDays(start: string, end: string): number {
  const inicio = new Date(start);
  const fim = new Date(end);
  const diffTime = fim.getTime() - inicio.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  return isNaN(diffDays) ? 0 : diffDays;
}

  const handleSubmit = async (e: FormEvent) => {
     e.preventDefault();

  if (!accessToken) return Swal.fire("Erro", "Faça login primeiro", "error");

  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);
  if (inicioDate > fimDate) {
    return Swal.fire("Erro", "A data de início não pode ser posterior à data de término", "error");
  }

  let uploadcareFileUrl = null;

  if (documento) {
    const uploadData = new FormData();
    uploadData.append("UPLOADCARE_STORE", "1");
    uploadData.append("UPLOADCARE_PUB_KEY", "41450941b70f42384f1f"); // substitua pela sua PUBLIC KEY
    uploadData.append("file", documento);

    const uploadRes = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: uploadData,
    });

    const uploadJson = await uploadRes.json();

    if (!uploadRes.ok || !uploadJson.file) {
      return Swal.fire("Erro", "Falha ao enviar o documento para Uploadcare", "error");
    }

    uploadcareFileUrl = `https://ucarecdn.com/${uploadJson.file}/`;
  }

  const payload = {
    motivo,
    inicio,
    fim,
    justificativo: uploadcareFileUrl,
  };
    const res = await fetch("https://backend-django-2-7qpl.onrender.com/api/dispensa/create/", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`,
      "Content-Type":"application/json",
       },
      body:JSON.stringify(payload)
    });

    if (!res.ok) return Swal.fire("Erro", "Falha ao enviar pedido", "error");
    const json = await res.json();
    console.log(json);
    setdispensa((prev) => [json, ...prev]);
    setmotivo(""); setinicio(""); setfim(""); setdocumento(null);
    Swal.fire("Sucesso", "Pedido enviado!", "success");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos de Dispensa</h1>
      <DownloadIcon onClick={exportarPDF}/>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label>Motivo</label>
          <textarea
            value={motivo}
            onChange={(e) => setmotivo(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Data Início</label>
            <Input type="date" value={inicio} onChange={(e) => setinicio(e.target.value)} required />
          </div>
          <div>
            <label>Data Término</label>
            <Input type="date" value={fim} onChange={(e) => setfim(e.target.value)} required />
          </div>
        </div>
        <div>
          <label>Justificativa (PDF)</label>
          <Input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <Button className="bg-sky-500 text-white" type="submit">Enviar Pedido</Button>
      </form>
    
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Motivo</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Comentário</TableHead>
            <TableHead>Arquivo</TableHead>
            <TableHead>Quem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispensa.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.motivo}</TableCell>
              <TableCell>
                <span className="text-xs text-gray-500">
                  {calculateDays(l.inicio, l.fim)} dia(s)
                </span>
              </TableCell>
              <TableCell>
                {l.status === 'aprovado' ? (
                  <Badge color="bg-green-500">Aprovado</Badge>
                ) : l.status === 'rejeitado' ? (
                  <Badge color="bg-red-500">Rejeitado</Badge>
                ) : (
                  <Badge color="bg-yellow-500">Pendente</Badge>
                )}
              </TableCell>
              <TableCell>{l.admin_comentario || "—"}</TableCell>
              <TableCell>
                {l.justificativo ? (
                 <a href={l.justificativo} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                ) : "—"}
              </TableCell>
            <TableCell>
              {l.status === 'pendente' ? (
                <Button className="bg-red-600" onClick={()=>DeletarDados(l.id)} >Cancelar o Pedido</Button>
              ) : null}
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
