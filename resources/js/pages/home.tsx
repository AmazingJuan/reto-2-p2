import React from "react";

import QuotationButton from "../components/QuotationButton";
import Layout from "../layouts/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a Training Corporation</h1>
      </div>
      <QuotationButton />
    </Layout>
  );
}