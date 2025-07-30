import React from 'react';
import styled from 'styled-components';

export default function Footer({ totalPrice, fecharPedido, disabled, onClearOrder }) {
  return (
    <FooterContainer>
      <TotalContainer>
        <TotalText>Total do Pedido:</TotalText>
        <TotalValue>R$ {totalPrice.toFixed(2)}</TotalValue>
      </TotalContainer>
      <ButtonGroup>
        <ClearButton
          onClick={onClearOrder}
          disabled={disabled}
        >
          Limpar Pedido
        </ClearButton>
        <CheckoutButton
          onClick={fecharPedido}
          disabled={disabled}
        >
          Fechar Pedido
          <ArrowIcon>→</ArrowIcon>
        </CheckoutButton>
      </ButtonGroup>
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

  @media screen and (max-width: 768px) {
    flex-direction: column; /* Altera para coluna no mobile */
    padding: 10px; /* Reduz o padding geral */
  }
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: column; /* Padrão para desktop */
  margin-right: 15px;

  @media screen and (max-width: 768px) {
    flex-direction: row; /* Coloca texto e valor na mesma linha no mobile */
    justify-content: space-between; /* Espaça-os */
    width: 100%; /* Ocupa a largura total */
    margin-right: 0;
    margin-bottom: 10px; /* Adiciona margem inferior para separar dos botões */
    align-items: center;
    padding: 0 5px; /* Pequeno padding horizontal para não colar nas bordas */
  }
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

  @media screen and (max-width: 768px) {
    font-size: 1.1rem; /* Reduz um pouco o tamanho da fonte no mobile */
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column; /* Empilha os botões no mobile */
    gap: 8px;
  }
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

  @media screen and (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 10px 15px; /* Reduz o padding dos botões no mobile */
    font-size: 0.9rem; /* Reduz a fonte do botão */
  }
`;

const ClearButton = styled(CheckoutButton)`
  background: #e0e0e0;
  color: #333;

  &:hover {
    background: ${({ disabled }) => disabled ? '#e0e0e0' : '#d0d0d0'};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
`;
