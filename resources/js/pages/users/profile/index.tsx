import Layout from '@/layouts/Layout';
import React from 'react';


export default function UserProfile() {
  return (
    <Layout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        Holaaa 👋 ya estás en el perfil de usuario
      </h1>
    </div>
    </Layout>
  );
}
