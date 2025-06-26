"use client"

import * as React from "react"
import { useState, useEffect,useContext } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger  } from "@/components/ui/dialog";
import { AuthContext } from "@/app/context/AuthContext"
import { DialogContent, DialogDescription } from "@radix-ui/react-dialog"

import { APIs } from "@/api"

export type CourseUser = {
  id: number
  courses: string
  description: string
  init_date: string | null
  finish_date: string | null
  instructors: string
  requirements: string
  status: string
  is_enrolled: boolean
}

export type TraineeInterface = {
  id: number
  nome: string
  curso: string
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function EmployeeCoursesPage() {
  const [cursoseleciodado, setCursoselcionado]=useState<CourseUser | null>(null)
  const {accessToken, userId, userName} = useContext(AuthContext);
  const [courses, setCourses] = useState<CourseUser[]>([])
  const [trainees, setTrainees] = useState<TraineeInterface[] >([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [abrir, setabrir]=useState(false);
  const [mostrar, setmostrar]=useState(false);
  const [enrollingId, setEnrollingId] = useState<number | null>(null)
  const { toast } = useToast()

  async function GetTrainee() {
    try {
      await fetch(`https://new-avd.onrender.com/trainees/${userName}`).then(res => res.json())
      .then(json => {
        setTrainees(json.message || [])
        // console.log('Trainees:',trainees)
        // console.log(courses)
      })

    } catch (error) {
      console.error('Erro ao obter trainee:', error)
    }
  }

  useEffect(() => {

    GetTrainee()

  });

  // https://app-e5d29f72-5de3-4ffe-af68-81bd6fa126ea.cleverapps.io
  useEffect(() => {
    fetch('https://app-e5d29f72-5de3-4ffe-af68-81bd6fa126ea.cleverapps.io/trainings/get_courses',
      {
        method: 'GET',
        headers:  {
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        setCourses(json.message || [])
        // console.log(courses)
      })
      .catch(err => console.error('Erro ao carregar cursos em menu/formacoes:',err))
      .finally(() => setLoading(false))

  }, [courses])

  if (loading) return <p>Carregando cursos...</p>

  // const filtered = courses.filter(c => c.course_name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Seja Bem-Vindo, {userName} </h1>
        <h2 className="text-1xl font-bold mb-4">Cursos Disponíveis </h2>
      <Input
        placeholder="Buscar curso..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="mb-4 max-w-sm"
      />
      {/* <button onClick={()=> setmostrar(true)}>Adiconar Hdade</button> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Curso</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Término</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Inscrito</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell  onClick={()=> {setCursoselcionado(course)
                setabrir(true)}} className="cursor-pointer underline">{course.courses}</TableCell>
              <TableCell>{formatDate(course.init_date)}</TableCell>
              <TableCell>{formatDate(course.finish_date)}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>

                  <Button
                    size="sm"
                  >
                    {trainees.some(t => t.curso === course.courses) ? 'Sim': 'Não'}
                  </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    <Dialog open={abrir} onOpenChange={setabrir}>
      <DialogTrigger asChild>
          <DialogContent>
          <DialogHeader>

          </DialogHeader>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96 space-y-4">
          <DialogTitle>{cursoseleciodado?.courses}</DialogTitle>
          <DialogDescription>{cursoseleciodado?.description}</DialogDescription>
            <p><strong>Instrutor:</strong>{cursoseleciodado?.instructors}</p>
            <p><strong>Requisitos:</strong>{cursoseleciodado?.requirements}</p>
            <p>{}</p>
            <p>{}</p>
            </div>

          </div>
        </DialogContent>
      </DialogTrigger>

    </Dialog>

    </div>
    </div>
  )
}
