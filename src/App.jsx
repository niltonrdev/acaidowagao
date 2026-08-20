import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import StoreLoginPage from './pages/StoreLoginPage';
import StorePanelPage from './pages/StorePanelPage';
import StorePrintPage from './pages/StorePrintPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pedido/:code" element={<OrderSuccessPage />} />
        <Route path="/loja/login" element={<StoreLoginPage />} />
        <Route path="/loja" element={<StorePanelPage />} />
        <Route path="/loja/imprimir/:id" element={<StorePrintPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
