'use client';
import { useEffect, useState, useRef, useContext } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
interface Assiduidade {
  id: number;
  funcionario: number;
  entrada: string;
  saida: string | null;
  data: string;
  duracao: string;
}

export default function FormModalAssiduidade() {
  const [desativado, setDesativado] = useState(false);
  const {accessToken, userId, userName, userLoading } = useContext(AuthContext);
  const router = useRouter();
  const [assiduidadeList, setAssiduidadeList] = useState<Assiduidade[]>([]);
  const [formData, setFormData] = useState({
    entrada: '',
    data: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [armazenar, setArmazenar] = useState<string[]>([]);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRegisteringFace, setIsRegisteringFace] = useState(false);

  const [contando, setContando] = useState(false);
  const [contagem, setContagem] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
   useEffect(() => {
  if (!userLoading && !accessToken) {
    router.push("/logincomsenha");
  }
}, [accessToken, userLoading, router]);
  useEffect(() => {
    if (userId) {fetchAssiduidade();}
  }, [userId]);
  const fetchAssiduidade = async () => {
    const res = await fetch(`https://backend-django-2-7qpl.onrender.com/api/assiduidade/?funcionario=${userId}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`,
      },}
    );
    const data = await res.json();
    console.log('teu ID', userId)
    setAssiduidadeList(data);
  };
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openCamera = async () => {
    setIsRegisteringFace(true);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setError('Erro ao acessar a câmera: ' + (err as Error).message);
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
  const captureImage = (): string | null => {
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

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setIsRegisteringFace(false);
    setError(null);
  };
   const armazenarImagem = () => {
    const imageData = captureImage();
    if (imageData) {
      setArmazenar(prev => [...prev, imageData]);
      Swal.fire({ icon: 'success', title: 'Foto armazenada com sucesso!' });
    } else {
      setError('Falha ao capturar imagem');
    }
  }
const registerNewFace = async () => {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    Swal.fire({ icon: 'error', title: 'Token de acesso não encontrado' });
    return;
  }

  if (!armazenar || armazenar.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Nenhuma imagem capturada' });
    return;
  }

  try {
    let erroOcorrido = false;

    for (const imageData of armazenar) {
      const formData = new FormData();
      const blob = await (await fetch(imageData)).blob();
      formData.append("image", blob, "face.jpg");

      const response = await fetch('https://3b63-102-214-36-178.ngrok-free.app/api/register_face/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        erroOcorrido = true;
        console.error("Erro ao cadastrar imagem:", data);
        Swal.fire({
          icon: 'error',
          title: `Erro ao cadastrar uma das imagens`,
          text: data.error || 'Erro desconhecido'
        });
        break;
      }
    }

    if (!erroOcorrido) {
      Swal.fire({
        icon: 'success',
        title: `${armazenar.length} imagem(ns) cadastrada(s) com sucesso!`,
      });
      closeCamera();
    }

  } catch (err) {
    console.error("Erro geral:", err);
    Swal.fire({ icon: 'error', title: 'Erro ao registrar rosto', text: String(err) });
  }
};

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="md:text-2xl font-bold">Minha Assiduidade de {userName}</h1>

      <div className="flex space-x-2">
        
        <button onClick={openCamera}  className="bg-purple-600 text-white px-4 py-2 rounded">
          Cadastrar Foto (Rosto)
        </button>
      </div>

      {isRegisteringFace && isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-4">
            <h2 className="text-xl font-semibold">Cadastrar Rosto de {userName}</h2>
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <div className="space-y-2">
            <button onClick={armazenarImagem} className="w-full bg-blue-600 text-white py-2 rounded">
            Capturar Foto
          </button>
          <button disabled={desativado} onClick={() =>{ registerNewFace(); setContando(true); setDesativado(true); }} className="w-full bg-green-600 text-white py-2 rounded">
    Salvar {armazenar.length} Foto(s)
        </button>
  <button onClick={closeCamera} className="w-full bg-gray-500 text-white py-2 rounded">
    Cancelar
  </button>
  {contando && <p className="text-green-600 text-sm">{contagem} Processando as Imagens...</p>}
</div>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      )}

      <div className="w-full overflow-x-auto bg-white rounded shadow">
        <table className="min-w-max w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left whitespace-nowrap">Entrada</th>
              <th className="p-2 text-left whitespace-nowrap">Saída</th>
              <th className="p-2 text-left whitespace-nowrap">Data</th>
              <th className="p-2 text-left whitespace-nowrap">Duração</th>  
            </tr>
          </thead>
          <tbody>
            {assiduidadeList.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2 whitespace-nowrap">{item.entrada}</td>
                <td className="p-2 whitespace-nowrap">{item.saida || '-'}</td>
                <td className="p-2 whitespace-nowrap">{item.data}</td>
                <td className="p-2 whitespace-nowrap">{item.duracao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
