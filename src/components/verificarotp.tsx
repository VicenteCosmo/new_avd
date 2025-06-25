  'use client';
  export const dynamic = "force-dynamic";
  import { useState, useEffect } from "react";
  import { useSearchParams, useRouter } from "next/navigation";
  import Swal from "sweetalert2";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Button } from "@/components/ui/button";

  export default function VerificarOTP() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [etapa, setEtapa] = useState<"otp" | "senha">("otp");
    const [otp, setOtp] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [confirmarSenha, setConfirmarSenha] = useState<string>("");
    const [carregando, setCarregando] = useState<boolean>(false);

    useEffect(() => {
      const emailQuery = searchParams.get("email");
      if (emailQuery) {
        setEmail(emailQuery);
      }
    }, [searchParams]);

    async function handleVerificarOtp(e: React.FormEvent) {
      e.preventDefault();
      setCarregando(true);

      try {
        const res = await fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/verify-otp/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });

        if (res.ok) {
          setEtapa("senha");
        } else {
          const erro = await res.json();
          alert("OTP inválido: " + JSON.stringify(erro));
        }
      } catch (err) {
        console.error("Erro ao verificar OTP:", err);
        alert("Erro de conexão ao verificar OTP.");
      } finally {
        setCarregando(false);
      }
    }

    async function handleCriarSenha(e: React.FormEvent) {
      e.preventDefault();
      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
      }
      setCarregando(true);

      try {
        const res = await fetch("https://backend-django-2-7qpl.onrender.com/api/funcionarios/set-password/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        if (res.ok) {
          alert("Senha criada com sucesso! Faça login com email e senha.");
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

      } 
        } else {
          const erro = await res.json();
          alert("Erro ao criar senha: " + JSON.stringify(erro));
        }
      } catch (err) {
        console.error("Erro ao criar senha:", err);
        alert("Erro de conexão ao criar senha.");
      } finally {
        setCarregando(false);
      }
    }

    return (
      <div className="flex justify-center items-center min-h-screen">
        {etapa === "otp" ? (
          <form
            onSubmit={handleVerificarOtp}
            className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
          >
            <h1 className="text-2xl font-bold text-center">Verificar Código OTP</h1>
            <p className="text-center">Enviamos um código para: {email}</p>

            <div>
              <Label htmlFor="otp">Código OTP</Label>
              <Input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Digite o código recebido"
              />
            </div>

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Verificando..." : "Verificar OTP"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleCriarSenha}
            className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow"
          >
            <h1 className="text-2xl font-bold text-center">Criar Nova Senha</h1>

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

            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
              <Input
                id="confirmarSenha"
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita sua senha"
              />
            </div>

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? "Criando..." : "Criar Senha"}
            </Button>
          </form>
        )}
      </div>
    );
  }