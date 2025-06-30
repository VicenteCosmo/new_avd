'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


function traduzirErroServidor(payload: any) {
  if (payload.error?.includes('OTP inválido')) return 'OTP inválido. Verifique o código e tente novamente.';
  if (payload.detail?.includes('not found')) return 'E-mail não encontrado no sistema.';
  if (payload.error?.includes('senha')) return 'Erro na criação da senha.';
  if (payload.error?.includes('6')) return 'A senha deve ter pelo menos 6 caracteres.';
  return payload.error || payload.detail || 'Ocorreu um erro. Tente novamente.';
}

export default function VerificarOTP() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [etapa, setEtapa] = useState<'otp' | 'senha'>('otp');
  const [otp, setOtp] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);

  useEffect(() => {
    const emailQuery = searchParams.get('email');
    if (emailQuery) setEmail(emailQuery);
  }, [searchParams]);

  async function handleVerificarOtp(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    try {
      const res = await fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/verify-otp/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const payload = await res.json();
      if (res.ok) {
        setEtapa('senha');
      } else {
        Swal.fire({ icon: 'error', title: 'Erro', text: traduzirErroServidor(payload) });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Erro de conexão', text: 'Não foi possível verificar o OTP.' });
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriarSenha(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      Swal.fire({ icon: 'error', title: 'Erro', text: 'As senhas não coincidem.' });
      return;
    }
    setCarregando(true);

    try {
      const res = await fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/set-password/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const payload = await res.json();
      if (res.ok) {
        await Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Senha criada com sucesso!' });
        const tokenRes = await fetch("https://backend-django-2-7qpl.onrender.com/api/token/", {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: senha }),
        });
        const data = await tokenRes.json();
        if (!tokenRes.ok) throw new Error('Token inválido');

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        const meRes = await fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/me/", {
          headers: { 'Authorization': `Bearer ${data.access}` },
        });
        const user = await meRes.json();
        if (!meRes.ok) throw new Error('Falha ao obter dados do usuário');

        router.replace(user.is_admin ? '/admin' : '/funcionarios');
      } else {
        Swal.fire({ icon: 'error', title: 'Erro', text: traduzirErroServidor(payload) });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Erro de conexão', text: 'Não foi possível criar a senha.' });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {etapa === 'otp' ? (
        <form onSubmit={handleVerificarOtp} className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center">Verificar Código OTP</h1>
          <p className="text-center text-gray-600">Enviamos um código para: {email}</p>

          <div>
            <Label htmlFor="otp">Código OTP</Label>
            <Input id="otp" type="text" required value={otp} onChange={e => setOtp(e.target.value)} placeholder="Digite o código" disabled={carregando} />
          </div>

          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? 'Verificando...' : 'Verificar OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCriarSenha} className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-bold text-center">Criar Nova Senha</h1>

          <div>
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" required value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua nova senha" disabled={carregando} />
          </div>

          <div>
            <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
            <Input id="confirmarSenha" type="password" required value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="Repita a senha" disabled={carregando} />
          </div>

          <Button type="submit" className="w-full" disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar Senha'}
          </Button>
        </form>
      )}
    </div>
  );
}
