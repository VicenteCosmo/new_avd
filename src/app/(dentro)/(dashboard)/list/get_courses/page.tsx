'use client'

import { date } from "zod";
import { columns, Courses } from "./columns"
import { DataTable } from "./data-table"

import { APIs } from "@/api";
 
import React, { useEffect, useState } from "react";

export default function DemoPage() {
  const [data, setData] = useState<Courses[]>([]);

  useEffect(() => {
    APIs.getData().then(setData);
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