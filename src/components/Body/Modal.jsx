import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function AcaiModal({ isOpen, onClose, onSelectOptions, selectedAcai, selectedOptions, setSelectedOptions, updateTotalPrice, totalPrice}) {
  if (!isOpen) return null;

  const [selectedCreme, setSelectedCreme] = useState(null);
  const [selectedFrutas, setSelectedFrutas] = useState([]);
  const [selectedComplementos, setSelectedComplementos] = useState([]);
  const [selectedAdicionais, setSelectedAdicionais] = useState([]);

  const adicionais = ['Creme de Avelã', 'Biscoito Oreo', 'Kit Kat'];
 

  useEffect(() => {

    const calculateTotalPrice = () => {
      let basePrice = 0;

      switch (selectedAcai) {
        case '300ml':
          basePrice = 14;
          break;
        case '400ml':
          basePrice = 16;
          break;
        case '500ml':
          basePrice = 18;
          break;
        case '700ml':
          basePrice = 23;
          break;  
        case '1L':
          basePrice = 40;
          break;    
        default:
          basePrice = 0;
      }



      const additionalPrice = selectedOptions.adicionais.length * 4;

      const totalPrice = basePrice + additionalPrice;
       updateTotalPrice(totalPrice);
    };

    calculateTotalPrice();
  }, [selectedAcai, selectedOptions]);

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
    const updatedAdicionais = selectedAdicionais.includes(adicional)
      ? selectedAdicionais.filter(item => item !== adicional)
      : [...selectedAdicionais, adicional];
  
    setSelectedAdicionais(updatedAdicionais);

    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      adicionais: updatedAdicionais,
    }));
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
      {selectedAcai && <SelectedAcai>{`Açaí de ${selectedAcai}`}</SelectedAcai>}
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
              {adicional} (+R$4,00)
              <PlusButton>{selectedAdicionais.includes(adicional) ? '-' : '+'}</PlusButton>
            </OptionItem>
          ))}
        </ModalSection>


        <ButtonContainer>
          <ConfirmButton onClick={handleConfirm}>Confirmar</ConfirmButton>
          <p>{`Preço Total: R$ ${totalPrice.toFixed(2)}`}</p>
          <CloseButton onClick={onClose}>Fechar</CloseButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

const SelectedAcai = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  background: linear-gradient(to right, #6A3093, #8E44AD);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(106, 48, 147, 0.4);
  }
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 15px;
  max-height: calc(80vh - 90px);
  overflow-y: auto;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
  margin-bottom: 12px;
  padding: 12px 15px;
  border-radius: 8px;
  background-color: ${({ selected }) => (selected ? '#F0E6FF' : '#f9f9f9')};
  color: ${({ selected }) => (selected ? '#6A3093' : '#333')};
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#E2D0FF' : '#f0f0f0')};
  }
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
