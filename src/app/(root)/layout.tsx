'use client'

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Navbar from "./components/Navbar";
import { FooterWithLogo } from "./components/Footer";

import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Nome do teu site",
//   description: "Descrição do site",
// };


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [theme, setTheme] = React.useState<'light' | '#27282c'>('#27282c')

  const toggleTheme = () => {
    theme === 'light' ? setTheme('#27282c') : setTheme('light')
  }

  return (
    <html lang="pt">
      <body className={`${inter.className} bg-[${theme}]`}>

        <Navbar />
        <main
          className="mx-auto min-h-screen w-full max-w-7xl flex-col 
          items-center justify-center px-4 py-20 xl:px-0"
          id="globalSection"
        >

          {/* <button onClick={toggleTheme} >click</button> */}

          {children}
        </main>
        <FooterWithLogo />
      </body>
    </html>
  );
}
