'use client';
import dynamic from "next/dynamic";
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import {useRouter} from 'next/navigation'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { table } from "console";

type DataItem = {
  departamento: string;
  presencas: number;
};
const AdminDashboard = () => {

  const { accessToken, userName, userLoading } = useContext(AuthContext);
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState(0);
  const [totalDispensas, setTotalDispensas] = useState([]);
  const [totalPresencas, setTotalPresencas] = useState(0);
  const [departamentos, setDepartamentos] = useState(0);
  const [nomeDepartamento,setnomeDepartamento]=useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [listaAssiduidade, definirListaAssiduidade] = useState([]);
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    setData([
      { departamento: 'TI', presencas: 21 },
      { departamento: 'RH', presencas: 17 },
      { departamento: 'Marketing', presencas: 14 },
    ]);
  }, []);
  const colorClasses = {
  blue: 'border-blue-500 text-blue-600',
  green: 'border-green-500 text-green-600',
  yellow: 'border-yellow-500 text-yellow-600',
  red: 'border-red-500 text-red-600',
  default: 'border-gray-300 text-gray-600',
};
useEffect(() => {
  if (!userLoading && !accessToken) {
    router.push("/logincomsenha");
  }
}, [accessToken, userLoading, router]);
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
      console.log('Tabelas:', tablesJson);
      setnomeDepartamento(tablesJson.tables);
      setFuncionarios(funcionariosData.length || 0);
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
  if (!accessToken) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <h1 className="lg:text-2xl font-bold text-blue-500">Painel Administrativo</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      )  :(
      <>
        <div className="bg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Cadastrados', value: funcionarios, color: 'blue' },
            { label: 'Departamentos', value: departamentos, color: 'green' },
            { label: 'Presenças', value: totalPresencas, color: 'red' },
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
        <div className="w-full h-80 bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Assiduidade por Departamento
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="departamento" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="presencas" name="Presenças" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>
    )
    }
       

    </div>
  );
};

export default AdminDashboard;
