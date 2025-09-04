import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const DetalhesPage = React.lazy(() => import("./pages/DetalhesPage"));

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Header />

      <main className="bg-gray-100 min-h-screen">
        <Suspense
          fallback={<div className="text-center p-8">Carregando...</div>}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pessoa/:id" element={<DetalhesPage />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
