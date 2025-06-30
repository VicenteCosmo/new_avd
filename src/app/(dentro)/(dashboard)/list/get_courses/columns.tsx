'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export type Courses = {
  id: number,
  course_name: string,
  status: "pending" | "processing" | "success" | "failed",
  course_description: string,
  course_init_date: string,
  course_finish_date: string,
  course_instructors: string,
  course_requirements: string
}

async function deleteCourse(id: number) {
  const url = `https://avd-trainings.onrender.com/trainings/delete_courses/${id}`
  await fetch(url, {
    method: 'DELETE'
  }).then(() => {
    console.log('Curso excluído com sucesso!')
    window.location.reload()
  })
}

async function editCourse(id: number, updatedData: Partial<Courses>) {
  const url = `https://avd-trainings.onrender.com/trainings/update_course/${id}`
  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData)
  }).then(() => {
    console.log('Curso atualizado com sucesso!')
    window.location.reload()
  })
}

export const columns: ColumnDef<Courses>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const finishDate = row.original.course_finish_date.split('/').reverse().join('/')
      const now = new Date()

      const day = now.getDate().toString().padStart(2, '0')
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const year = now.getFullYear()

      const formatDate = `${year}/${month}/${day}`

      console.log(new Date(formatDate), typeof formatDate)
      console.log( finishDate, typeof finishDate)
      return new Date(finishDate) < new Date() ? "Concluído" : "Pendente"
    }
  },
  { accessorKey: "course_name", header: "Curso" },
  { accessorKey: "course_description", header: "Descrição" },
  { accessorKey: "course_init_date", header: "Início" },
  { accessorKey: "course_finish_date", header: "Término" },
  { accessorKey: "course_instructors", header: "Instructores" },
  { accessorKey: "course_requirements", header: "Requisitos" },
  { header: "Ações", cell: ({ row }) => <ActionsCell row={row} /> },
]

type ActionsCellProps = {
  row: any
}

function ActionsCell({ row }: ActionsCellProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() - offset)
    return date.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState<Partial<Courses>>({
    course_name: row.original.course_name,
    course_description: row.original.course_description,
    course_init_date: formatDate(row.original.course_init_date || ''),
    course_finish_date: formatDate(row.original.course_finish_date || ''),
    course_instructors: row.original.course_instructors,
    course_requirements: row.original.course_requirements,
    status: row.original.status
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields: Array<keyof Courses> = [
      'course_name',
      'course_description',
      'course_init_date',
      'course_finish_date',
      'course_instructors',
      'course_requirements',
      'status'
    ]

    requiredFields.forEach(field => {
      const value = formData[field]
      const isDate = field.includes('date')
      const isValidDate = isDate ? !isNaN(Date.parse(String(value) || '')) : true

      if (!value || (isDate && !isValidDate)) {
        newErrors[field] = 'Este campo é obrigatório'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    editCourse(row.original.id, formData)
    setIsDialogOpen(false)
  }

  const handleDelete = () => {
    deleteCourse(row.original.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="flex gap-2">
      {/* Diálogo de Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { id: 'course_name', label: 'Nome do Curso' },
              { id: 'course_description', label: 'Descrição' },
              { id: 'course_init_date', label: 'Data de Início', type: 'date' },
              { id: 'course_finish_date', label: 'Data de Término', type: 'date' },
              { id: 'course_instructors', label: 'Instrutores' },
              { id: 'course_requirements', label: 'Requisitos' },
              { id: 'status', label: 'Status' },
            ].map(({ id, label, type = 'text' }) => (
              <div key={id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={id} className="text-right">
                  {label}
                </Label>
                <div className="col-span-3 flex flex-col gap-1">
                  <Input
                    id={id}
                    name={id}
                    required
                    value={formData[id as keyof Courses] || ''}
                    onChange={handleChange}
                    className={errors[id] ? 'border-red-500' : ''}
                    type={type}
                  />
                  {errors[id] && (
                    <span className="text-red-500 text-xs">{errors[id]}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Excluir
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir o curso <strong>{row.original.course_name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
