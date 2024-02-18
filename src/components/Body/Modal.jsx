import React, { useState } from 'react';
import styled from 'styled-components';

export default function AcaiModal({ isOpen, onClose, onSelectOptions }) {
  if (!isOpen) return null;
 
  const [selectedCreme, setSelectedCreme] = useState(null);

  const handleToggleCreme = (creme) => {
    setSelectedCreme(selectedCreme === creme ? null : creme);
  };

  const handleSelectCreme = (creme) => {
    setSelectedCreme(creme);
  };

  const handleConfirm = () => {
    onSelectOptions({
      creme: selectedCreme,
      frutas: [], 
      complementos: [], 
      adicionais: [], 
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Escolha os extras para o seu açaí</h2>
        <ModalSection>
            <Subtitle>Creme</Subtitle>
            <SubtitleGray>Escolha até 1 opção</SubtitleGray>
            <OptionsContainer>
            <OptionItem selected={selectedCreme === 'Leite Ninho'} onClick={() => handleSelectCreme('Leite Ninho')}>
                Leite Ninho <PlusButton onClick={(e) => { e.stopPropagation(); handleSelectCreme('Leite Ninho'); }}>{selectedCreme === 'Leite Ninho' ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedCreme === 'Ovomaltine'} onClick={() => handleSelectCreme('Ovomaltine')}>
                Ovomaltine <PlusButton onClick={(e) => { e.stopPropagation(); handleSelectCreme('Ovomaltine'); }}>{selectedCreme === 'Ovomaltine' ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedCreme === 'Paçoca'} onClick={() => handleSelectCreme('Paçoca')}>
                Paçoca <PlusButton onClick={(e) => { e.stopPropagation(); handleSelectCreme('Paçoca'); }}>{selectedCreme === 'Paçoca' ? '-' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>
        <ButtonContainer>
          <ConfirmButton onClick={handleConfirm}>Confirmar</ConfirmButton>
          <CloseButton onClick={onClose}>Fechar</CloseButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fundo semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

const ModalSection = styled.div`
  margin-bottom: 20px;
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const SubtitleGray = styled.div`
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const OptionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
    color: ${({ selected }) => (selected ? 'green' : 'black')};
`;

const PlusButton = styled.div`
  cursor: pointer;
`;

const CloseButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;
