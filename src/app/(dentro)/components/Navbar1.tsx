'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { userName, logout } = useContext(AuthContext);

  const handleLogout = () => {
    router.push('/logincomsenha');
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto h-16 flex items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">Recursos Humanos</span>
        </Link>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1 w-64 focus-within:ring-2 focus-within:ring-indigo-500">
          <Image src="/search.png" alt="Buscar" width={16} height={16} className="opacity-60" />
          <input
            type="text"
            placeholder="Buscar..."
            className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
          />
        </div>

        <nav className="flex items-center space-x-4">

          <button
            className="relative p-2 bg-white rounded-full hover:bg-gray-100 transition"
            aria-label="Mensagens"
            title="Mensagens"
          >
            <Image src="/message.png" alt="Mensagens" width={20} height={20} />
          </button>

          <button className="relative p-2 bg-white rounded-full hover:bg-gray-100 transition">
            <Image src="/announcement.png" alt="Notificações" width={20} height={20} />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-indigo-600 rounded-full">
              1
            </span>
          </button>

          <Link
            href="/formulario"
            className="hidden md:inline-block px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition"
          >
            Cadastrar Funcionario
          </Link>

          <div className="flex items-center gap-2 cursor-pointer group relative">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{userName || 'Usuário'}</p>
              <p className="text-xs text-gray-500">EU</p>
            </div>
            <Image
              src="/profile.png"
              alt="Foto do usuário"
              width={36}
              height={36}
              className="rounded-full border-2 border-gray-200"
            />

            <div className="absolute right-0 mt-12 hidden w-40 bg-white border border-gray-200 rounded-md shadow-lg group-hover:block">
              <ul className="py-2">
                <li>
                  <Link
                    href="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/personalizar"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Configurações
                  </Link>
                </li>
                <li>
                  <hr className="my-1 border-gray-200" />
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
