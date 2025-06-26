"use client"
import React, { SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'

const Page = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nif, setNif] = useState('')
  const [address, setAddress] = useState('')
  const [repName, setRepName] = useState('')
  const [repEmail, setRepEmail] = useState('')
  const [repCellphone, setRepCellphone] = useState('')
  const [controlSubmit, setControlSubmit] = useState(false)

  const router = useRouter()
  const url = 'https://avd-registrar-empresa.onrender.com/registrar_empresa/registrar'

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault()

    console.log('Submitting form...')

    const data = {
      nome_da_empresa: name,
      nif: nif,
      endereco: address,
      representante_legal: repName,
      email_do_representante: repEmail,
      telefone: repCellphone,
      password: password
    }

    const JSONData = JSON.stringify(data)

    // if(password === confirmPassword){
     try {

      if(confirmPassword === password){
        await fetch(url, {
          method: 'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSONData 
        }).then((res) => {
  
          console.log(JSON.stringify(res.status))
          if(res.status === 400){
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Alguma coisa occorreu mal!",
              footer: 'Certifique-se de que o NIF, e-mail e telefone estão correctos! '
            });  
          } 
  
          if(res.status === 200){
            Swal.fire({
              title: "Cadastrado com sucesso!",
              icon: "success",
              draggable: true
            });
            router.push('/login')
          }
          
          
        })
      }
      else{
        Swal.fire({
          title: "Reconfirme a password!",
          // icon: "success",
          draggable: true
        });
      }
      
     } catch (error) {
      console.error('Error:', error)
     }

    
    // }

    // else if( password !== confirmPassword){
    //   alert('As senhas não coincidem!')
    // }

  }

  return (
    <div className='w-full' >
      <div className=" py-5 " >
        <h1 className="text-white text-2xl font-bold text-center  " >
          Simplifique sua gestão de RH com o nosso software.
        </h1>

      </div>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3]  p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Cadastro de Empresa
        </h2>
        <form onSubmit={(e) => { 
          setControlSubmit(true)
          submit(e)
          setTimeout(() => {
            setControlSubmit(false)
          }, 5000)
        }}>
          {/* Nome da Empresa */}
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700">
              Nome da Empresa
            </label>
            <input
              type="text"
              id="companyName"
              placeholder="Digite o nome da empresa"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* CNPJ / NIF */}
          <div className="mb-4">
            <label htmlFor="cnpj" className="block text-gray-700">
              NIF
            </label>
            <input
              type="text"
              id="cnpj"
              placeholder="Digite o NIF"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setNif(e.target.value)}
            />
          </div>

          {/* Endereço */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              placeholder="Digite o endereço da empresa"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Nome do Representante */}
          <div className="mb-4">
            <label htmlFor="repName" className="block text-gray-700">
              Nome do Representante
            </label>
            <input
              type="text"
              id="repName"
              placeholder="Digite o nome do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setRepName(e.target.value)}
            />
          </div>

          {/* E-mail do Representante */}
          <div className="mb-4">
            <label htmlFor="repEmail" className="block text-gray-700">
              E-mail do Representante
            </label>
            <input
              type="email"
              id="repEmail"
              placeholder="Digite o e-mail do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setRepEmail(e.target.value)}
            />
          </div>

          {/* Telefone do Representante */}
          <div className="mb-4">
            <label htmlFor="repPhone" className="block text-gray-700">
              Telefone do Representante
            </label>
            <input
              type="number"
              minLength={9}
              maxLength={15}
              id="repPhone"
              placeholder="Digite o telefone do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setRepCellphone(e.target.value)}
            />
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              minLength={8}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirmar Senha */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              minLength={8}
              placeholder="Repita a senha"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>


          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
            title="Submit Form"
            disabled={
              controlSubmit           
            }
          >
            Enviar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Já possui cadastro?{" "}
          <a href="/login" className="text-green-600 hover:underline">
            Fazer Login
          </a>
        </p>
      </div>
    </div>
    </div>
  )
}

export default Page
