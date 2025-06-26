
"use client"

import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import Swal from 'sweetalert2'
import lucide from "lucide-react"
import {Check, X, Download, Beer} from "lucide-react"
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from "next/navigation"
export type Leave = {
  id: number
  motivo: string
  inicio: string
  fim: string
  justificativo: string 
  status: 'pendente' | 'aprovado' | 'rejeitado'
  admin_comentario: string | null
  created_at: string
  funcionario_nome?: string
}

function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  return isNaN(diffDays) ? 0 : diffDays;
}

function formatDate(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })
}
export  default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const { accessToken, userId, userName, userLoading } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
   useEffect(() => {
    if (!userLoading && !accessToken) {
      router.push("/logincomsenha");
    }
  }, [accessToken, userLoading, router]);

  useEffect(() => {
    fetch('https://backend-django-2-7qpl.onrender.com/api/leaves/all/')
      .then(res => res.json())
      .then(json => setLeaves(json.message || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

const DeleteDados = (id: number) => {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Você não poderá reverter isso!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, excluir!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Excluído!',
        'Seus dados foram excluídos.',
        'success'
      )
    }
  })
}
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };
  const handleDecision = async (id: number, decision: 'aprovado' | 'rejeitado') => {
    const comment = await Swal.fire({
      title: decision === 'aprovado' ? 'Comentário de aprovação' : 'Comentário de reprovação',
      input: 'textarea',
      showCancelButton: true
    }).then(res => res.isConfirmed ? res.value || '' : null)

    if (comment === null) return

    const mappedDecision = decision === 'rejeitado' ? 'rejeitado' : 'aprovado';

    try {
      const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/leaves/update/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: mappedDecision, admin_comentario: comment })
      })
      if (!res.ok) throw new Error()
      setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: mappedDecision as Leave["status"], admin_comentario: comment } : l))
      toast({ title:'Atualizado', description:'Status salvo.', variant:'default' })
    } catch {
      toast({ title:'Erro', description:'Não foi possível atualizar.', variant:'destructive' })
    }
  }



  return (
    <><div className="block sm:hidden space-y-4">
        <h1 className="text-2xl text-sky-500 font-bold mb-4">Pedidos de Dispensa</h1>

      {loading ? (
       <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        leaves.map(l => (
          <div key={l.id} className="flex justify-between bg-white rounded shadow p-4 space-y-2">
            <div>
              <p>Funcionário: {l.funcionario_nome}</p>
              <p>Motivo: {l.motivo}</p>
              <p>Período:<span className="text-sm text-black-800">
                        {calculateDays(l.inicio, l.fim)} dias
                      </span></p>
              <p>Status: {l.status}</p>
              <p>Justificativo:  {l.justificativo ? (
                        <a href={`https://fc46-102-218-85-18.ngrok-free.app/api/media/justificativo/${l.justificativo?.split('/').pop()}`} target="_blank"><Download/></a>
                      ) : "—"}</p>
              <p className="flex ">Ações:  {l.status === "pendente" ? (
                        <>
                            <Check className="w-4 h-4 mr-2 cursor-pointer bg-green-500 text-green-50" onClick={() => handleDecision(l.id, "aprovado")} />
                            <X className="w-4 h-4 mr-2 cursor-pointer bg-red-500 text-red-50" onClick={() => handleDecision(l.id, "rejeitado")} />
                        </>
                      ) : (
                        <span className="italic text-gray-500">Já {l.status}</span>
                      )}</p>
            </div>

            <Beer width={40} height={40} className="w-4 h-4 mr-2 cursor-pointer  text-red-500" onClick={() => DeleteDados(l.id)} />
          </div>
        ))
      )}
    </div>
    
    <div className="sm:block hidden p-6">
        <h1 className="text-2xl text-sky-500 font-bold mb-4">Pedidos de Dispensa</h1>
        {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Justificativo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaves.map(l => (
              <TableRow key={l.id}>
                <TableCell>{l.funcionario_nome || '—'}</TableCell>
                <TableCell>{l.motivo}</TableCell>
                <TableCell>
                  <span className="text-sm text-black-800">
                    {calculateDays(l.inicio, l.fim)} dias
                  </span></TableCell>
                <TableCell>{l.status}</TableCell>
                <TableCell>
                  {l.justificativo ? (
                             <a  href={`https://3b63-102-214-36-178.ngrok-free.app/api/media/justificativo/${l.justificativo?.split('/').pop()}`} target="_blank" rel="noopener noreferrer"><Download/></a>
                    
                  ) : "—"}
                </TableCell>
                <TableCell className="flex gap-2">
                  {l.status === "pendente" ? (
                    <>
                      <Check className="w-4 cursor-pointer h-4 mr-2 bg-green-500 text-green-50" onClick={() => handleDecision(l.id, "aprovado")} />
                      <X className="w-4 cursor-pointer h-4 mr-2 bg-red-500 text-red-50" onClick={() => handleDecision(l.id, "rejeitado")} />
                    </>
                  ) : (
                    <span className="italic text-gray-500">Já {l.status}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>)}
      </div></>
  )
}
