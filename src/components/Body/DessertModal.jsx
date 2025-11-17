import React, { useState } from 'react';
import styled from 'styled-components';

// Este modal é usado para sobremesas que requerem uma escolha de opção simples (Ex: Fruta)
export default function DessertModal({ isOpen, onClose, onSelectOption, dessert }) {
  // Estado para armazenar a opção selecionada (Morango ou Uva)
  const [selectedOption, setSelectedOption] = useState(null);

  // O modal só é renderizado se estiver aberto e com o objeto 'dessert'
  if (!isOpen || !dessert) return null;

  // Opções definidas para o brigadeiro de ninho com nutella
  const options = ["Morango", "Uva"];

  const handleConfirm = () => {
    if (!selectedOption) {
      // Em um projeto real, você mostraria uma mensagem de erro na interface
      console.error("Por favor, selecione uma fruta antes de adicionar ao pedido.");
      return;
    }
    
    // Envia a opção selecionada de volta para o App.jsx
    onSelectOption(selectedOption);
    setSelectedOption(null); // Resetar estado após confirmação
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{dessert.titulo}</h2>
        
        <DessertImage src={dessert.image} alt={dessert.titulo} /> 
        
        <p>{dessert.descricao}</p>
        <Price>R$ {dessert.preco.toFixed(2)}</Price>

        <OptionSelectionTitle>Escolha a sua fruta:</OptionSelectionTitle>
        
        <OptionGrid>
          {options.map((option) => (
            <OptionButton
              key={option}
              active={selectedOption === option}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </OptionButton>
          ))}
        </OptionGrid>
        
        <ConfirmButton onClick={handleConfirm} disabled={!selectedOption}>
          Adicionar ao Pedido - R$ {dessert.preco.toFixed(2)}
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
}

// --- ESTILOS ADAPTADOS DO CakeModal ---

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

const DessertImage = styled.img`
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
  margin: 10px 0 20px;
`;

const OptionSelectionTitle = styled.p`
    font-weight: 700;
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 10px;
`;

const OptionGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px 0 30px;
`;

const OptionButton = styled.button`
  background: ${({ active }) => (active ? '#8E44AD' : '#f1f1f1')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  border: 1px solid ${({ active }) => (active ? '#8E44AD' : '#ddd')};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ active }) => (active ? '#6c3285' : '#e0e0e0')};
  }
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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(106, 48, 147, 0.3);
  }
`;