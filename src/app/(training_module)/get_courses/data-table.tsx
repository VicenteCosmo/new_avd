"use client"

import { Button } from "@/components/ui/button"
import * as React from "react"
import 'react'
import { useState } from "react"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"

import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast" 

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [formData, setFormData] = useState({
    course: '',
    description: '',
    init_date: '',
    finish_date: '',
    instructors: '',
    requirements: ''
  })
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [ isDialogOpen, setIsDialogOpen ] = useState(false) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:4000/trainings/insert_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_name: formData.course,
          course_description: formData.description,
          course_init_date: formData.init_date,
          course_finish_date: formData.finish_date,
          course_instructors: formData.instructors.split(',').map(i => i.trim()),
          course_requirements: formData.requirements.split(',').map(r => r.trim())
        })
      })

      console.log(response)

      if(response.status == 500){
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: "Alguma coisa occorreu mal!",
                      footer: 'Certifique-se de que os dados estão correctos! '
                    });  
        
      }

      if(response.status === 201){

                  setIsDialogOpen(false)     
                  setTimeout(() => {
                    Swal.fire({
                    title: "Cadastrado com sucesso!",
                    icon: "success",
                    draggable: true
                  });

                  window.location.reload()

                  // router.refresh()
                  console.log(response)

                  }, 1000)
                  
          }

      // Reset form after successful submission
      setFormData({
        course: '',
        description: '',
        init_date: '',
        finish_date: '',
        instructors: '',
        requirements: ''
      })

    } catch (error) {
      toast({
        title: 'Error',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
      router.refresh()
    }
  }

  //Handle Report

// Interface para tipagem dos cursos
interface Course {
  id: number;
  course_name: string;
  status: string;
  course_description: string;
  course_init_date: string;
  course_finish_date: string;
  course_instructors: string;
  course_requirements: string;
}

// Função robusta para formatação de datas
function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Validação mais robusta da data
  if (isNaN(date.getTime())) {
    console.error('Data inválida:', dateString);
    return 'Data inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Função para obter dados dos cursos
async function getCoursesData(): Promise<Course[]> {
  try {
    const response = await fetch('http://localhost:4000/trainings/get_courses');
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    const message = data.message || [];
    
    // Garante que sempre trabalhamos com um array
    const coursesArray = Array.isArray(message) ? message : [message];
    
    return coursesArray.map((course: any) => ({
      id: course.id || 0,
      course_name: course.courses || 'Sem nome',
      status: course.status || 'pending',
      course_description: course.description || 'Sem descrição',
      course_init_date: formatDate(course.init_date),
      course_finish_date: formatDate(course.finish_date),
      course_instructors: course.instructors || 'N/A',
      course_requirements: course.requirements || 'N/A'
    }));
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw error; // Propaga o erro para ser tratado pelo chamador
  } 
}

// Função principal para gerar o relatório
const generateReport = async () => {
  try {
    // 1. Obter os dados
    const courses = await getCoursesData();
    console.log('Dados obtidos:', courses);

    // 2. Preparar a estrutura para o relatório
    const reportData = {
      title: "Relatório de Cursos",
      headers: ["Curso", "Status", "Início", "Término", "Instrutores", "Requisitos"],
      data: courses.map(course => [
        course.course_name,
        course.status,
        course.course_init_date,
        course.course_finish_date,
        course.course_instructors,
        course.course_requirements
      ])
    };

    console.log('Enviando para o backend:', reportData);

    // 3. Enviar para o backend gerar o PDF
    const response = await fetch('http://localhost:4000/trainings/generate_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    });

    // 4. Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao gerar relatório: ${response.statusText}`);
    }

    // 5. Processar o PDF retornado
    const blob = await response.blob();
    
    // Verificar se o conteúdo é realmente um PDF
    if (!blob.type.includes('application/pdf')) {
      throw new Error('O servidor não retornou um PDF válido');
    }

    // 6. Criar o download do PDF
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_cursos_${new Date().toISOString().slice(0,10)}.pdf`;
    document.body.appendChild(a);
    a.click();

    // 7. Limpeza
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('Falha ao gerar relatório:', error);
    alert('Erro ao gerar relatório. Verifique o console para detalhes.');
  }
};

// Exemplo de uso:
// Chamar generateReport() quando necessário (em um click de botão, por exemplo)

  

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    }
  })



  return (
   <div>

     <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar curso..."
          value={(table.getColumn("course_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("course_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div>
                  <Dialog open={isDialogOpen} >
      <DialogTrigger asChild>
       <button
            // onClick={() => setShowCreateForm(true)}
            // disabled={!selectedTable}
            onClick={() => setIsDialogOpen(true)}
            className="px-4 mr-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            + Novo Registro
          </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >
        {/* <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you are done.
          </DialogDescription>
        </DialogHeader> */}
         <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Adicione um novo curso</h2>

      <div className="space-y-2">
        <Label htmlFor="course">Nome do curso</Label>
        <Input
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="init_date">Data de início</Label>
          <Input
            id="init_date"
            name="init_date"
            type="date"
            value={formData.init_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="finish_date">Data de término</Label>
          <Input
            id="finish_date"
            name="finish_date"
            type="date"
            value={formData.finish_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructors">Instructores</Label>
        <Input
          id="instructors"
          name="instructors"
          value={formData.instructors}
          onChange={handleChange}
          placeholder="John Doe, Jane Smith"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requisitos</Label>
        <Input
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Basic knowledge, Laptop, etc."
          required
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Terminar'}
      </Button>
    </form>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false)
                router.refresh()
              }}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
        
      </DialogContent>

      
    </Dialog>

           <button
            // onClick={() => setShowCreateForm(true)}
            // disabled={!selectedTable}
            onClick={() => generateReport() }
            className="px-4 mr-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Gerar relatório
          </button>
        </div>



      </div>


    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Carregando...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

   </div> 
    
  )
}
