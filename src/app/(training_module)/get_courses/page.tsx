'use client'

import { date } from "zod";
import { columns, Courses } from "./columns"
import { DataTable } from "./data-table"

function formatDate(dateString: string) : string {
  const date = new Date(dateString)

  //Validating...
  if(isNaN(date.getDate())) {
    console.error('Data inválida:', date)
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())

  const finish_date = `{day}/${month}/${year}`

  return `${day}/${month}/${year}`


}

async function getData(): Promise<Courses[]> {
  try {
    const response = await fetch('http://localhost:4000/trainings/get_courses');
    const data = await response.json();
    const message = data.message;
    
    console.log(message);

    // Handle both array and single object cases

    const date = new Date('01-02-2025')
    // console.log('Date:', date)

    

    const coursesArray = Array.isArray(message) ? message : [message];
    
    return coursesArray.map((course: any) => ({
      id: course.id,
      course_name: course.courses,
      status: "pending",
      course_description: course.description,
      course_init_date: formatDate(course.init_date),
      course_finish_date: formatDate(course.finish_date),
      course_instructors: course.instructors,
      course_requirements: course.requirements
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  } 
}
 
import React, { useEffect, useState } from "react";

export default function DemoPage() {
  const [data, setData] = useState<Courses[]>([]);

  useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <div>
       <h1 className="text-center text-4xl 
      font-bold py-10 bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3] 
      bg-clip-text text-transparent ">Gerenciador de Cursos </h1>
    <div className="container mx-auto py-10 bg-white ">
      <DataTable columns={columns} data={data} />
    </div>
    </div>
  );
}