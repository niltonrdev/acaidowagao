// src/components/Body/CakeModal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

export default function CakeModal({ isOpen, onClose, onSelectCake, cake }) {
  const [quantity, setQuantity] = useState(1);
  const total = cake ? cake.preco * quantity : 0;

  if (!isOpen || !cake) return null;

  const handleConfirm = () => {
    onSelectCake(cake, quantity);
    setQuantity(1); // Resetar quantidade ao fechar
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{cake.titulo}</h2>
        <CakeImage src={cake.image} alt={cake.titulo} />
        <p>{cake.descricao}</p>
        <Price>R$ {cake.preco.toFixed(2)}</Price>

        <QuantitySelector>
          <QuantityButton onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</QuantityButton>
          <QuantityInput type="number" value={quantity} readOnly />
          <QuantityButton onClick={() => setQuantity(q => q + 1)}>+</QuantityButton>
        </QuantitySelector>
        
        <TotalDisplay>
            Total: R$ {total.toFixed(2)}
        </TotalDisplay>

        <ConfirmButton onClick={handleConfirm}>
          Adicionar ({quantity}) - R$ {total.toFixed(2)}
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
}

// Estilos dos componentes
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const CakeImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin: 15px 0;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #6A3093;
  margin: 10px 0;
`;

const QuantitySelector = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  gap: 10px;
`;

const QuantityButton = styled.button`
  background: #f1f1f1;
  color: #333;
  border: 1px solid #ddd;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 0;
  font-size: 1.1rem;
`;

const TotalDisplay = styled.p`
    font-weight: 700;
    font-size: 1.3rem;
    color: #20102A;
    margin-bottom: 20px;
`;

const ConfirmButton = styled.button`
  background: linear-gradient(to right, #6A3093, #8E44AD);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(106, 48, 147, 0.3);
  }
`;