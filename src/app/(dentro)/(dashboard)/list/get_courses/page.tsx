'use client'

import { date } from "zod";
import { columns, Courses } from "./columns"
import { DataTable } from "./data-table"

import { APIs } from "@/api";
 
import React, { useEffect, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
// Import Table components from your UI library, e.g., shadcn/ui or similar
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export type TraineeInterface = {
  id: number
  nome: string
  curso: string
}

export default function DemoPage() {
  const [data, setData] = useState<Courses[]>([]);
  const [trainees, setTrainees] = useState<TraineeInterface[] >([])

  async function GetTrainee() {
      try {
        await fetch('https://new-avd.onrender.com/trainees').then(res => res.json())
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

  useEffect(() => {
    APIs.getData().then(setData);
  }, []);

  return (
  <div className="min-h-screen bg-gray-50 p-4">
    <Tabs.Root defaultValue="account" className="max-w-6xl mx-auto">
      <Tabs.List className="flex space-x-4 border-b border-gray-200">
        <Tabs.Trigger
          value="account"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 
                   data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 
                   data-[state=active]:border-indigo-600 transition-colors"
        >
          Gerenciador de Cursos
        </Tabs.Trigger>
        <Tabs.Trigger
          value="documents"
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 
                   data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 
                   data-[state=active]:border-indigo-600 transition-colors"
        >
          Cursos em Andamento
        </Tabs.Trigger>
      </Tabs.List>

      <div className="py-6">
        <Tabs.Content value="account" className="space-y-6">
          <h1 className="text-center text-4xl font-bold py-8 
                         bg-gradient-to-r from-green-400 to-blue-500 
                         bg-clip-text text-transparent">
            Gerenciador de Cursos
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <DataTable columns={columns} data={data} />
          </div>
        </Tabs.Content>

        <Tabs.Content value="documents" className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cursos em Andamento</h2>
          <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do formando</TableHead>
            <TableHead>Curso a frequentar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainees.map(course => (
            <TableRow key={course.id}>
              <TableCell className="cursor-pointer">{course.nome}</TableCell>
              <TableCell>{course.curso}</TableCell>
              <TableCell>

                  {/* <Button
                    size="sm"
                  >
                    {trainees.some(t => t.curso === course.courses) ? 'Sim': 'Não'}
                  </Button> */}

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </Tabs.Content>
      </div>
    </Tabs.Root>
  </div>
);
}