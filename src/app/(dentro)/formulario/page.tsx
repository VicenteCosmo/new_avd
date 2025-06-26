'use client'
import { useState } from "react";
import Router from "next/router";

const CompanySignup = () => {
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [repPhone, setRepPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company_name: companyName,
          cnpj,
          address,
          representative_name: repName,
          representative_email: repEmail,
          representative_phone: repPhone,
          password
        })
      });

      if (response.ok) {
        alert("Empresa cadastrada com sucesso! Verifique seu e-mail para ativar a conta.");
        Router.push("/login");
      } else {
        const data = await response.json();
        setErrorMessage(data.detail || "Falha no cadastro. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMessage("Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Cadastro de Empresa
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Nome da Empresa */}
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-700">
              Nome da Empresa
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Digite o nome da empresa"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Digite o NIF"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Digite o endereço da empresa"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              placeholder="Digite o nome do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={repEmail}
              onChange={(e) => setRepEmail(e.target.value)}
              placeholder="Digite o e-mail do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {/* Telefone do Representante */}
          <div className="mb-4">
            <label htmlFor="repPhone" className="block text-gray-700">
              Telefone do Representante
            </label>
            <input
              type="text"
              id="repPhone"
              value={repPhone}
              onChange={(e) => setRepPhone(e.target.value)}
              placeholder="Digite o telefone do representante"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          {errorMessage && (
            <p className="mb-4 text-center text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Cadastrando..." : "Cadastrar Empresa"}
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
  );
};

export default CompanySignup;
