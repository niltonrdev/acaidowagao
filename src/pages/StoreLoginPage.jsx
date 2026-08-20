import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { isStoreLoggedIn, loginStore } from '../services/storeAuth';

function safeNextPath(raw) {
  if (!raw || !raw.startsWith('/loja')) return '/loja';
  return raw;
}

export default function StoreLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = safeNextPath(searchParams.get('next'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isStoreLoggedIn()) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginStore(password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate(nextPath);
  };

  return (
    <Page>
      <Card as="form" onSubmit={handleSubmit}>
        <Title>Painel da Loja</Title>
        <Text>Açaí do Wagão — acesso do computador da loja</Text>
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          autoFocus
          required
        />
        {error && <Error>{error}</Error>}
        <Button type="submit">Entrar</Button>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1235;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 14px;
  padding: 28px;
`;

const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 1.5rem;
  color: #6a3093;
`;

const Text = styled.p`
  margin: 0 0 20px;
  color: #666;
  font-size: 0.9rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 12px;
`;

const Error = styled.p`
  color: #c0392b;
  margin: 0 0 10px;
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  background: linear-gradient(to right, #6a3093, #8e44ad);
  color: #fff;
  font-weight: 600;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
`;
