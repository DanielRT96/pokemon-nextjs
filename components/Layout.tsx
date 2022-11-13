import React from 'react';
import Head from 'next/head';

function Layout({ title, children }: any) {
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container mx-auto max-w-xl pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default Layout;
