'use client'
import { useState } from "react";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState(""); // Usando email para login
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nif, setNif] = useState('')
  const [loading, setLoading] = useState(false);

  const router = useRouter()
  const url = 'https://avd-registrar-empresa.onrender.com/registrar_empresa/login'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const data = {
        nif,
        email_do_representante: email,
        password
      }
  
      const JSONData = JSON.stringify(data)

      try {
      
            await fetch(url, {
              method: 'POST',
              headers:{
                'Content-Type':'application/json'
              },
              body: JSONData 
            }).then((res) => {

              const response = res.json()
              response.then((data) => {
                
                const res = data.message

                console.log(res)

                if(res === 'Usuário não existente!'){
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Usuário não existente!",
                        // footer: 'Certifique-se de que o NIF, e-mail e telefone estão correctos! '
                      });  
                }
                else{
                    if(res === 'Senha inválida!'){
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Verifique se sua senha ou email está correcto!",
                            // footer: 'Certifique-se de que o NIF, e-mail e telefone estão correctos! '
                          });  
                    }

                    else if(res === 'Sucesso!'){
                        router.push('/otp')
                    }
                }

              })
              if(res.status === 400){
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Alguma coisa occorreu mal!",
                  footer: 'Certifique-se de que o NIF, e-mail e telefone estão correctos! '
                });

              } 
      
            //   if(res.status === 200){
            //     Swal.fire({
            //       title: "Cadastrado com sucesso!",
            //       icon: "success",
            //       draggable: true
            //     });
            //     router.push('/login')
            //   }
              
              
            })
            
           } catch (error) {
            console.error('Error:', error)
           }

     finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#3ffc2f] to-[#2f83c3] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login - Sistema RH
        </h2>
        <form onSubmit={handleSubmit}>
            {/* Nif */}
            <div className="mb-4">
            <label htmlFor="nif" className="block text-gray-700">
              NIF
            </label>
            <input
              type="text"
              id="nif"
              value={nif}
              onChange={(e) => setNif(e.target.value)}
              placeholder="Digite o NIF"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>


          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email corporativo"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {/* Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {errorMessage && (
            <p className="mb-4 text-center text-red-500">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Ainda não tem cadastro?{" "}
          <a href="/registrar" className="text-blue-600 hover:underline">
            Cadastrar Empresa
          </a>
        </p>
        <p className="mt-4 text-center text-gray-700">
          Esqueceu a senha?{" "}
          <a href="/recuperar_senha" className="text-blue-600 hover:underline">
            Recuperar
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
