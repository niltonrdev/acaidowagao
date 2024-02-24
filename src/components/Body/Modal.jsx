import React, { useState } from 'react';
import styled from 'styled-components';

export default function AcaiModal({ isOpen, onClose, onSelectOptions }) {
  if (!isOpen) return null;

  const [selectedCreme, setSelectedCreme] = useState(null);
  const [selectedFrutas, setSelectedFrutas] = useState([]);
  const [selectedComplementos, setSelectedComplementos] = useState([]);
  const [selectedAdicionais, setSelectedAdicionais] = useState([]);

  const adicionais = ['Creme de Avelã', 'Biscoito Oreo', 'Kit Kat'];

  const handleToggleCreme = (creme) => {
    setSelectedCreme(selectedCreme === creme ? null : creme);
  };

  const handleSelectCreme = (creme) => {
    setSelectedCreme(creme);
  };

  const handleToggleFruta = (fruta) => {
    if (selectedFrutas.includes(fruta)) {
      setSelectedFrutas(selectedFrutas.filter(item => item !== fruta));
    } else {
      if (selectedFrutas.length < 2) {
        setSelectedFrutas([...selectedFrutas, fruta]);
      }
    }
  };

  const handleToggleComplemento = (complemento) => {
    setSelectedComplementos(prevComplementos => {
      if (prevComplementos.includes(complemento)) {
        return prevComplementos.filter(item => item !== complemento);
      } else {
        return [...prevComplementos, complemento];
      }
    });
  };

  const handleToggleAdicional = (adicional) => {
    const index = selectedAdicionais.indexOf(adicional);
    if (index !== -1) {
      setSelectedAdicionais((prevAdicionais) => [
        ...prevAdicionais.slice(0, index),
        ...prevAdicionais.slice(index + 1),
      ]);
    } else {
      setSelectedAdicionais((prevAdicionais) => [...prevAdicionais, adicional]);
    }
  };

  const handleConfirm = () => {
    onSelectOptions({
      creme: selectedCreme,
      frutas: selectedFrutas,
      complementos: selectedComplementos,
      adicionais: selectedAdicionais,
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

        <ModalSection>
          <Subtitle>Frutas</Subtitle>
          <SubtitleGray>Escolha até 2 opções</SubtitleGray>
          <OptionsContainer>
            <OptionItem selected={selectedFrutas.includes('Morango')} onClick={() => handleToggleFruta('Morango')}>
              Morango <PlusButton>{selectedFrutas.includes('Morango') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Banana')} onClick={() => handleToggleFruta('Banana')}>
              Banana <PlusButton>{selectedFrutas.includes('Banana') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Manga')} onClick={() => handleToggleFruta('Manga')}>
              Manga <PlusButton>{selectedFrutas.includes('Manga') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Uva')} onClick={() => handleToggleFruta('Uva')}>
              Uva <PlusButton>{selectedFrutas.includes('Uva') ? '-' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Complementos</Subtitle>
          <SubtitleGray>Escolha quantos quiser</SubtitleGray>
          <OptionsContainer>
            <OptionItem selected={selectedComplementos.includes('Leite em pó')} onClick={() => handleToggleComplemento('Leite em pó')}>
              Leite em pó <PlusButton>{selectedComplementos.includes('Leite em pó') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Granola')} onClick={() => handleToggleComplemento('Granola')}>
              Granola <PlusButton>{selectedComplementos.includes('Granola') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Paçoca')} onClick={() => handleToggleComplemento('Paçoca')}>
              Paçoca <PlusButton>{selectedComplementos.includes('Paçoca') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Farinha Láctea')} onClick={() => handleToggleComplemento('Farinha Láctea')}>
              Farinha Láctea <PlusButton>{selectedComplementos.includes('Farinha Láctea') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Amendoim')} onClick={() => handleToggleComplemento('Amendoim')}>
              Amendoim <PlusButton>{selectedComplementos.includes('Amendoim') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Confete')} onClick={() => handleToggleComplemento('Confete')}>
              Confete <PlusButton>{selectedComplementos.includes('Confete') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Sucrilhos')} onClick={() => handleToggleComplemento('Sucrilhos')}>
              Sucrilhos <PlusButton>{selectedComplementos.includes('Sucrilhos') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Ovomaltine')} onClick={() => handleToggleComplemento('Ovomaltine')}>
              Ovomaltine <PlusButton>{selectedComplementos.includes('Ovomaltine') ? '-' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Leite Condensado')} onClick={() => handleToggleComplemento('Leite Condensado')}>
              Leite Condensado <PlusButton>{selectedComplementos.includes('Leite Condensado') ? '-' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Adicionais </Subtitle>
          <SubtitleGray>Escolha quantos quiser</SubtitleGray>
          {adicionais.map((adicional) => (
            <OptionItem key={adicional} selected={selectedAdicionais.includes(adicional)} onClick={() => handleToggleAdicional(adicional)}>
              {adicional} (+R$2,00)
              <PlusButton>{selectedAdicionais.includes(adicional) ? '-' : '+'}</PlusButton>
            </OptionItem>
          ))}
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
  max-height: calc(100vh - 200px); 
  overflow-y: auto;
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
