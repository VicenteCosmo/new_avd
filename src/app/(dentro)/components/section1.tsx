// import DashboardLayout from "./(dashboard)/layout"
"use client"

import Image from "next/image"
import Link from 'next/link'

export default function Section1(){
    console.log('Hello, I am a client component')
    return(
        <div className="  w-full h-120 bg-[#27282c] p-5 " >
            <div className="block justify-center mx-auto md:flex md:flex-row sm:flex-col align-content-center " >

                <div className=" py-5 w-1/2  " >
                    <h1 className="text-white text-5xl font-bold bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3] bg-clip-text text-transparent " >
                        Simplifique sua gestão de RH com o nosso software.
                    </h1>

                    <span className="mt-10 flex text-white " >Gerência de dados da sua instituição de forma mais eficiente</span>

                </div>

                {/* Image */}
                <div className="-my-10  md:block " >
                    <Image src='/hr.png' alt="assesment" className=" w-100 " width={400} height={400}  />
                </div>

            </div>

            {/* Buttos */}
            <div className=" gap-x-9 flex lg:ml-28  " >
                        <Link href="/registrar" className="bg-white px-10 py-5 rounded-3xl hover:bg-transparent hover:border-white
                        hover:border-2
                        " >
                            <span className="text-black hover:text-white " >Registrar agora</span>
                        </Link>
                    
                        <Link href="/login" className="bg-transparent border-2 border-white px-10 py-5 rounded-3xl hover:bg-white
                        
                        " >
                            <span className="text-white hover:text-black " >Entrar agora</span>
                        </Link>
            </div>

        </div>
    )
}