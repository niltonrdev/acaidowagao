import React from 'react';
import styled from 'styled-components';

export default function Footer({ totalPrice, fecharPedido, disabled, onClearOrder }) {
  return (
    <FooterContainer>
      <TopRow> {/* Novo container para a linha superior do rodapé */}
        <TotalContainer>
          <TotalText>Total do Pedido:</TotalText>
          <TotalValue>R$ {totalPrice.toFixed(2)}</TotalValue>
        </TotalContainer>
        <ClearButton
          onClick={onClearOrder}
          disabled={disabled}
        >
          Limpar Pedido
        </ClearButton>
      </TopRow>
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
  flex-direction: column; /* Sempre em coluna para organizar TopRow e CheckoutButton */
  align-items: center; /* Centraliza itens na coluna */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  gap: 10px; /* Espaçamento entre TopRow e CheckoutButton */

  @media screen and (max-width: 768px) {
    padding: 10px; /* Reduz o padding geral no mobile */
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ocupa a largura total do rodapé */
  gap: 10px; /* Espaçamento entre TotalContainer e ClearButton */

  @media screen and (max-width: 768px) {
    flex-wrap: wrap; /* Permite quebrar linha se não houver espaço */
    justify-content: center; /* Centraliza itens se quebrar linha */
    gap: 8px; /* Reduz o espaçamento no mobile */
  }
`;

const TotalContainer = styled.div`
  display: flex;
  flex-direction: row; /* Coloca texto e valor na mesma linha */
  align-items: center;
  gap: 8px; /* Espaçamento entre o texto e o valor */

  @media screen and (max-width: 768px) {
    /* Ajustes específicos para o total no mobile */
    font-size: 0.9rem; /* Reduz o tamanho da fonte */
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
  width: 100%; /* Ocupa a largura total no mobile */
  justify-content: center; /* Centraliza o texto no botão */

  &:hover {
    background: ${({ disabled }) => disabled ? '#6A3093' : '#8E44AD'};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
  }

  @media screen and (max-width: 768px) {
    padding: 10px 15px; /* Reduz o padding dos botões no mobile */
    font-size: 0.9rem; /* Reduz a fonte do botão */
  }
`;

const ClearButton = styled(CheckoutButton)`
  background: #e0e0e0;
  color: #333;
  width: auto; /* Permite que o botão de limpar tenha largura automática no desktop */

  @media screen and (max-width: 768px) {
    width: 100%; /* Ocupa a largura total no mobile se estiver em uma linha separada */
    padding: 10px 15px; /* Reduz o padding para mobile */
    font-size: 0.9rem; /* Reduz a fonte para mobile */
  }

  &:hover {
    background: ${({ disabled }) => disabled ? '#e0e0e0' : '#d0d0d0'};
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
`;
