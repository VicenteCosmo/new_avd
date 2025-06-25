'use client';

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import {useRouter} from 'next/navigation'
const AdminDashboard = () => {
  const { accessToken } = useContext(AuthContext);
    const router=useRouter()
  const [funcionarios, setFuncionarios] = useState([]);
  const [totalDispensas, setTotalDispensas] = useState([]);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listaAssiduidade, definirListaAssiduidade] = useState([]);
useEffect(() => {
    if (!accessToken) {
      router.push('/logincomsenha') 
    }
  }, [accessToken, router])
 useEffect(() => {
  if (!accessToken) return;

  const fetchData = async () => {
    try {

      const [resFuncionarios, resDispensas, resTables] = await Promise.all([
        fetch('https://backend-django-2-7qpl.onrender.com/api/funcionarios/all/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('https://backend-django-2-7qpl.onrender.com/api/leaves/all/', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch('https://backend-django-2-7qpl.onrender.com/tables/'),
      ]);

      const funcionariosData = await resFuncionarios.json();
      const dispensaJson = await resDispensas.json();
      const tablesJson = await resTables.json();

      if (!resTables.ok) throw new Error(tablesJson.error || 'Erro ao buscar tabelas');

      setFuncionarios(funcionariosData);
      setTotalDispensas(dispensaJson.message?.length || 0);
      setDepartamentos(tablesJson.tables?.length || 0);
      carregarAssiduidade();
      console.log('Funcionários:', funcionariosData.length);
      console.log('Dispensas:', dispensaJson.message?.length || 0);
      console.log('Tabelas:', tablesJson.tables?.length || 0);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  fetchData();
}, [accessToken]);

const carregarAssiduidade = async () => {
    const resposta = await fetch('https://backend-django-2-7qpl.onrender.com/api/assiduidade/todos/');
    const dados = await resposta.json();
    definirListaAssiduidade(dados);
    setTotalPresencas(dados.length);
    setLoading(false);
  };
  if (!accessToken) return null

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="lg:text-2xl font-bold text-gray-500">Painel Administrativo</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Cadastrados', value: funcionarios.length, color: 'blue' },
          { label: 'Departamentos', value: departamentos, color: 'green' },
          { label: 'Presenças', value: totalPresencas, color: 'teal' },
          { label: 'Dispensas', value: totalDispensas, color: 'yellow' },
        ].map((item, idx) => (
          <div
            key={idx}
            className={`bg-white p-4 rounded-lg md:flex-col shadow-md border-l-4 border-${item.color}-500`}
          >
            <h2 className="lg:text-gray-500">{item.label}</h2>
            <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>


    </div>
  );
};

export default AdminDashboard;
