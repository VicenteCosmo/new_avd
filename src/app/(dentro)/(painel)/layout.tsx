"use client"
import Menu1 from "@/components/Menu1";
import Navbar from "@/components/Navbar1";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { AuthProvider } from "@/app/context/AuthContext";
import { useState } from "react";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const [abrirMenu, setabrirMenu]=useState(false)
  return (
    <div className="h-screen flex">
      <div className="flex-col w-[20%] bg-blue-500 md:w-[8%] hidden md:flex lg:w-[14%] xl:w-[10%] ">
        <Menu1 />
      </div>
       {abrirMenu && (
        <div className="inset-0 bg-blue-500 z-50 md:hidden w-[20%] shadow-lg p-4">
                  <Menu1/>
        </div>
              )}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-auto">
        <Navbar clicadoMenuAction={() => {setabrirMenu(!abrirMenu)}} />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
          </div>
        </div>
  );
}
