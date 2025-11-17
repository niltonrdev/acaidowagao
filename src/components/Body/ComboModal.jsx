import React, { useState } from 'react';
import styled from 'styled-components';

export default function ComboModal({ isOpen, onClose, onSelectOptions, combo, cakeOptions }) {
  const [selectedCake, setSelectedCake] = useState(null);
  const [selectedRefri, setSelectedRefri] = useState('Normal');
  if (!isOpen || !combo || !cakeOptions) return null;

  const handleConfirm = () => {
    if (!selectedCake) {
      console.error("Por favor, selecione qual bolo você deseja no combo."); 
      return;
    }
    
    // Envia o objeto do bolo selecionado de volta para o App.jsx
    onSelectOptions(selectedCake, selectedRefri);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{combo.titulo}</h2>
        {/* Você deve usar a importação correta da imagem do combo no seu VS Code */}
        <ComboImage src={combo.image} alt={combo.titulo} /> 
        <Price>R$ {combo.preco.toFixed(2)}</Price>
        
        <ComboDescription>{combo.descricao}</ComboDescription>
        
        <OptionSelectionTitle>Escolha o Bolo do Combo:</OptionSelectionTitle>
        
        <CakeOptionList>
          {cakeOptions.map((cake) => (
            <CakeOptionItem
              key={cake.id}
              active={selectedCake && selectedCake.id === cake.id}
              onClick={() => setSelectedCake(cake)}
            >
              {cake.titulo}
            </CakeOptionItem>
          ))}
        </CakeOptionList>
        
        <OptionSelectionTitle>Escolha o Refrigerante:</OptionSelectionTitle>
        <RefriSelector>
            <RefriOption 
                selected={selectedRefri === 'Normal'}
                onClick={() => setSelectedRefri('Normal')}
            >
                Normal
            </RefriOption>
            <RefriOption 
                selected={selectedRefri === 'Zero'}
                onClick={() => setSelectedRefri('Zero')}
            >
                Zero Açúcar
            </RefriOption>
        </RefriSelector>
        
        <ConfirmButton onClick={handleConfirm} disabled={!selectedCake}>
          Adicionar Combo - R$ {combo.preco.toFixed(2)}
        </ConfirmButton>
      </ModalContent>
    </ModalOverlay>
  );
}

// --- ESTILOS ---
// Use os estilos que você já tem no projeto ou este como base:
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 450px; max-height: 90vh; overflow-y: auto; position: relative; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #333;
`;

const ComboImage = styled.img`
  width: 100%; height: auto; max-height: 200px; object-fit: cover; border-radius: 8px; margin: 15px 0;
`;

const ComboDescription = styled.p`
    font-style: italic; color: #555; margin-bottom: 20px; font-size: 0.95rem;
`;

const Price = styled.p`
  font-size: 1.5rem; font-weight: 600; color: #6A3093; margin: 10px 0;
`;

const OptionSelectionTitle = styled.p`
    font-weight: 700; font-size: 1.1rem; color: #333; margin-bottom: 10px; margin-top: 20px;
`;

const CakeOptionList = styled.div`
  display: flex; flex-direction: column; gap: 10px; margin: 15px 0 30px; padding: 0 10px;
`;

const CakeOptionItem = styled.button`
  background: ${({ active }) => (active ? '#8E44AD' : '#f1f1f1')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  border: 1px solid ${({ active }) => (active ? '#8E44AD' : '#ddd')};
  padding: 12px; border-radius: 8px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s; text-align: left;

  &:hover { background: ${({ active }) => (active ? '#6c3285' : '#e0e0e0')}; }
`;

const ConfirmButton = styled.button`
  background: linear-gradient(to right, #6A3093, #8E44AD); color: white; border: none; padding: 12px 25px; border-radius: 8px; font-weight: 600; font-size: 1rem; width: 100%; cursor: pointer; transition: all 0.3s;
  &:disabled { background: #ccc; cursor: not-allowed; }
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 10px rgba(106, 48, 147, 0.3); }
`;


const RefriSelector = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 10px;
`;

const RefriOption = styled.button`
    flex: 1;
    padding: 10px 15px;
    border-radius: 8px;
    border: 2px solid ${({ selected }) => (selected ? '#4CAF50' : '#ddd')}; 
    background-color: ${({ selected }) => (selected ? '#E8F5E9' : '#fff')};
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s;
    color: ${({ selected }) => (selected ? '#1B5E20' : '#333')};
    
    &:hover {
        background-color: #f0f0f0;
    }
`;