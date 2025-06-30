'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/app/context/AuthContext';
import Swal from 'sweetalert2'
export default function LoginComSenha() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const {
    setAccessToken,
    setUserId,
    setUserName
  } = useContext(AuthContext);
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [err, setErr] = useState('');
  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setCarregando(true);

  try {
    const res = await fetch('https://backend-django-2-7qpl.onrender.com/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      const userRes = await fetch('https://backend-django-2-7qpl.onrender.com/api/funcionarios/me/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.access}`,
          'Content-Type': 'application/json',
        },
      });

      const user = await userRes.json();
      setAccessToken(data.access);   
      setUserId(user.id);            
      setUserName(user.nome);
      console.log("Dados do usuário logado:", user);
      if (!userRes.ok) throw new Error('Erro ao obter dados do usuário');

      await Swal.fire({
        title: 'Login realizado com sucesso!',
        icon: 'success',
      });

      if (user.is_admin) {
        router.push('/admin');
      } else {
        router.push('/funcionarios');
      }

    } else {
      setErr('dados inválidos. Verifique seu email e senha.');

    }
  } catch {
    setErr('Erro de conexão. Verifique sua internet ou tente novamente mais tarde.');
    alert('Erro de conexão.');
  } finally {
    setCarregando(false);
  }
}

  return (
    <div className="flex justify-center bg-white items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
      >
        <h1 className="text-2xl font-bold text-center">Entrar</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>

        <div>
          <Label htmlFor="senha">Senha</Label>
          <Input
            id="senha"
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <div className="text-right">
          <a href="/esqueci-senha" className="text-blue-500 hover:underline">
            Esqueci minha senha
          </a>
        </div>
        {err && (
          <div className="text-red-500 text-sm">
            {err}
          </div>
        )}
        <Button type="submit" className="w-full bg-blue-500" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
