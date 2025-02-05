import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>AI Price Index</title>
        <meta name="description" content="Track and analyze LLM pricing across providers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">AI Price Index</h1>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-100 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2024 AI Price Index. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}; 