'use client';

import { useEffect, useState, useRef, useContext } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, LogIn, LogOut, UserPlus } from 'lucide-react';
import { AuthContext } from '@/app/context/AuthContext';
import {ToastContainer, toast, Bounce} from 'react-toastify';
import Swal from "sweetalert2"
import { FileDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
interface Assiduidade {
  id: number;
  funcionario: number;
  funcionario_nome: string;
  entrada: string;
  saida: string | null;
  data: string;
  duracao: string;
}

interface Funcionario {
  id: number;
  nome: string;
}

export default function FormModalAssiduidade() {
  const { accessToken, userLoading } = useContext(AuthContext);
  const router = useRouter();
  const aviso = () => toast.success('Baixando PDF, aguarde...', {
    position: "top-left" as const,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
transition: Bounce,
});
  const [listaFuncionarios, definirListaFuncionarios] = useState<Funcionario[]>([]);
  const [listaAssiduidade, definirListaAssiduidade] = useState<Assiduidade[]>([]);
  const [dadosFormulario, definirDadosFormulario] = useState({ funcionario: '', entrada: '', data: '' });
  const [localizar, definirLocalizar] = useState<{ lat: number | null; long: number | null }>({ lat: null, long: null });
  const [carregando, definirCarregando] = useState(false);
  const [modalAberto, definirModalAberto] = useState(false);
  const [erro, definirErro] = useState<string | null>(null);
  const [hora, setHora] = useState<string>('');
  const [idEdicao, definirIdEdicao] = useState<number | null>(null);
  const [saidaEditada, definirSaidaEditada] = useState<string>('');
  const [contando, setcontador] = useState(false);
  const [cameraAberta, definirCameraAberta] = useState(false);
  const [registrandoEntrada, definirRegistrandoEntrada] = useState(false);
  const [registrandoSaida, definirRegistrandoSaida] = useState(false);
  const [contagem, setContagem] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
  if (accessToken) {
    carregarAssiduidade();
  }
}, [accessToken])
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        definirLocalizar({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      {
        enableHighAccuracy: true, 
        timeout: 20000,            
        maximumAge: 0             
      }
    );
  }
}, []);

console.log('Localização atual:', localizar);
  const carregarAssiduidade = async () => {
    const resposta = await fetch('https://backend-django-2-7qpl.onrender.com/api/assiduidade/todos/');
    const dados = await resposta.json();
    definirListaAssiduidade(dados);
    setLoading(false);
  };

  const aoMudarInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    definirDadosFormulario(prev => ({ ...prev, [name]: value }));
  };

  const registrarEntrada = async (p0: { funcionario: any; entrada: string; data: string; }) => {
    
    try{
      const  resposta = await fetch('https://backend-django-2-7qpl.onrender.com/api/assiduidade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(p0),
      });
      if (!resposta.ok) throw new Error('Erro ao registrar entrada');
      await carregarAssiduidade();
    }catch(erro:any){

    }
  };
 useEffect(() => {
  let intervalo: ReturnType<typeof setInterval>;

  if (contando) {
    intervalo = setInterval(() => {
      setContagem(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(intervalo);
}, [contando]);
  const editarSaida = async (id: number, saida: string) => {
    definirCarregando(true);
    try {
      const resposta = await fetch(`https://backend-django-2-7qpl.onrender.com/api/assiduidade/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saida }),
      });

      if (!resposta.ok) {
        const erroDados = await resposta.json();
        throw new Error(erroDados.error || 'Erro ao registrar saída');
      }

      await carregarAssiduidade();
      definirIdEdicao(null);
      definirSaidaEditada('');
    } catch (err: any) {
      definirErro(err.message);
    } finally {
      definirCarregando(false);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Assiduidade', 14, 16);
    autoTable(doc, {
      head: [['Funcionário', 'Entrada', 'Saída', 'Data', 'Duração']],
      body: listaAssiduidade.map(a => [
        a.funcionario_nome,
        a.entrada,
        a.saida || '-',
        a.data,
        a.duracao || '-',
      ]),
      startY: 20,
    });
    doc.save('relatorio-assiduidade.pdf');
  };

  const abrirCamera = async () => {
    definirCameraAberta(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      definirErro('Erro ao acessar a câmera: ' + (err as Error).message);
    }
  };
  

  const capturarImagem = (): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg');
    }
    return null;
  };

  const fecharCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setContagem(0);
    setcontador(false);
    definirCameraAberta(false);
    definirRegistrandoEntrada(false);
    definirRegistrandoSaida(false);
  };
  useEffect(() => {
  if (!userLoading && !accessToken) {
    router.push("/logincomsenha");
  }
}, [accessToken, userLoading, router]);

const reconhecerFace = async () => {
  const imagem = capturarImagem();
  if (!imagem) {
    definirErro('Falha ao capturar imagem');
    return;
  }
  console.log('imagem capturada:');
  try {
    
    const resposta = await fetch('https://3b63-102-214-36-178.ngrok-free.app/api/facial/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imagem }),
    });

    if (!resposta.ok) {
    const erroData = await resposta.json().catch(() => ({}));
  Swal.fire('Erro', erroData?.error || 'Funcionário não reconhecido', 'error');
  return;
}

const dados = await resposta.json();

if (!dados.funcionario_id) {
  Swal.fire('Erro', 'Funcionário não identificado na imagem.', 'error');
  return;
}

    const agora = new Date();
    const hora = agora.toTimeString().slice(0, 5);
    const dataAtual = agora.toISOString().split('T')[0];

    if (registrandoSaida) {
  const registroAberto = listaAssiduidade.find(
    item => item.funcionario.toString() === dados.funcionario_id.toString()
      && item.data === dataAtual
      && item.saida === null
  );
  if (!registroAberto) {
    Swal.fire('Erro', 'Não há entrada registrada hoje para esse funcionário.', 'warning');
    return;
  }

  await registrarSaida(dados.funcionario_id, hora);
  Swal.fire('Sucesso', 'Saída registrada com sucesso!', 'success');
} else {
  const entradaExistente = listaAssiduidade.find(
    item => item.funcionario.toString() === dados.funcionario_id.toString()
      && item.data === dataAtual
  );
  if (entradaExistente) {
    Swal.fire('Erro', 'Este funcionário já tem entrada registrada hoje.', 'warning');
    return;
  }

  await registrarEntrada({
    funcionario: dados.funcionario_id.toString(),
    entrada: hora,
    data: dataAtual
  });
  Swal.fire('Sucesso', 'Entrada registrada com sucesso!', 'success');
}

    await carregarAssiduidade();
    definirModalAberto(false);
    definirDadosFormulario({ funcionario: '', entrada: '', data: '' });
    definirCarregando(true);
  } catch (err: any) {
    definirErro('Erro: ' + err.message);
    Swal.fire('Erro', err.message, 'error');
  } finally {
    fecharCamera();
   
    definirCarregando(false);
  }
};


  async function registrarSaida(funcionarioId: number, horaSaida: string) {
    try {
      const existente = listaAssiduidade.find(item => item.funcionario.toString() === funcionarioId.toString() && item.saida === null);
      if (existente) {
        await editarSaida(existente.id, horaSaida);
      } else {
        const agora = new Date();
        const dataAtual = agora.toISOString().split('T')[0];
        const resposta = await fetch('https://backend-django-2-7qpl.onrender.com/api/assiduidade/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ funcionario: funcionarioId, entrada: '00:00', saida: horaSaida, data: dataAtual }),
        });
        if (!resposta.ok) {
          Swal.fire('Ops..', 'Tente Novamente ou verifique se o serviço está ativo!', 'error');
        }
        if (resposta.ok) {
          Swal.fire('Sucesso', 'Saida registrada com sucesso!', 'success');
        }
        await carregarAssiduidade();
      }
    } catch (err: any) {
      definirErro(err.message);
    }
  }

  const abrirModalEntrada = async () => {
    definirRegistrandoEntrada(true);
    definirModalAberto(true);
    await abrirCamera();
  };

  const abrirModalSaida = async () => {
    definirRegistrandoSaida(true);
    await abrirCamera();
  };
  
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
     {/* <h1>
        Localização: {localizar.lat !== null && localizar.long !== null
          ? `Lat: ${localizar.lat}, Long: ${localizar.long}`
          : 'Localização não disponível'}
      </h1> */}
      {/* <a href={`https://www.google.com/maps?q=${localizar.lat},${localizar.long}`}>Ver A localização no mapa</a> */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-sky-500">Gestão de Assiduidade</h1>


        <FileDown className="w-5 h-5 text-blue-500 cursor-pointer" size={50} onClick={() => {exportarPDF(); aviso()}} />
        <ToastContainer />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={abrirModalEntrada} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[48px] w-full sm:w-auto">
          <LogIn className="w-5 h-5" />
          Registrar Entrada
        </button>
        <button onClick={abrirModalSaida} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300 min-h-[48px] w-full sm:w-auto">
          <LogOut className="w-5 h-5" />
          Registrar Saída
        </button>
      </div>

      <div className="block sm:hidden space-y-4">
        {listaAssiduidade.length===0 && (
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500 text-center">Nenhum registro encontrado</p>
          </div>
        )}
        {loading && (
          <div className="bg-white rounded shadow p-4">
            <p className="text-gray-500 text-center">Carregando...</p>
          </div>
        )}
        {listaAssiduidade.map(item => (
          <div key={item.id} className="bg-white rounded shadow p-4 space-y-2">
            <p><strong>Funcionário:</strong> {item.funcionario_nome}</p>
            <p><strong>Entrada:</strong> {item.entrada}</p>
            <p><strong>Saída:</strong> {idEdicao === item.id ? (
              <input type="time" className="border px-2 py-1 rounded" value={saidaEditada} onChange={e => definirSaidaEditada(e.target.value)} />
            ) : (item.saida || '-')}</p>
            <p><strong>Data:</strong> {item.data}</p>
            <p><strong>Duração:</strong> {item.duracao || '-'}</p>
          </div>
        ))}
      </div>

      <div className="hidden sm:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">Funcionário</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Entrada</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Saída</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Data</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Duração</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listaAssiduidade.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
            {listaAssiduidade.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">{item.funcionario_nome}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.entrada}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.saida || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.data}</td>
                <td className="px-4 py-2 whitespace-nowrap">{item.duracao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && registrandoEntrada && cameraAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Nova Entrada</h2>
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto border rounded" />
            <div className="flex gap-2">
              <button onClick={() =>{ reconhecerFace(); setcontador(true);}} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">Reconhecer</button>
              <button onClick={fecharCamera}  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">Cancelar</button>
            </div>
            {contando && <p className="text-green-600 text-sm">{contagem}</p>}
          </div>
        </div>
      )}

      {registrandoSaida && cameraAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Registrar Saída</h2>
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto border rounded" />
            <div className="flex gap-2">
              <button onClick={() =>{ reconhecerFace(); setcontador(true);}} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded">Reconhecer</button>
              <button onClick={fecharCamera} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">Cancelar</button>
            </div>
            {contando && <p className="text-green-600 text-sm">{contagem}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
