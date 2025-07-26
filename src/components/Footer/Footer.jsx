import React from 'react';
import styled from 'styled-components';

export default function Footer({ totalPrice, fecharPedido, disabled }) {
  return (
    <FooterContainer>
    <TotalContainer>
      <TotalText>Total do Pedido:</TotalText>
      <TotalValue>R$ {totalPrice.toFixed(2)}</TotalValue>
    </TotalContainer>
    <CheckoutButton 
        onClick={fecharPedido}
        disabled={disabled}
      >
      Fechar Pedido
      <ArrowIcon>→</ArrowIcon>
    </CheckoutButton>
  </FooterContainer>
  );
}

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #20102A;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TotalText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #ddd;
`;

const TotalValue = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const CheckoutButton = styled.button`
  background: #6A3093;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
    
  &:hover {
    background: ${({ disabled }) => disabled ? '#6A3093' : '#8E44AD'};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
`;
