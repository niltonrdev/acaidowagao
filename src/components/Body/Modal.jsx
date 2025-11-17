// src/components/Body/Modal.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function AcaiModal({ isOpen, onClose, onSelectOptions, selectedAcai, selectedOptions, setSelectedOptions }) {
  if (!isOpen) return null;

  // CRÍTICO: Inicialize os estados LOCAIS com base nas props selectedOptions
  // Isso garante que, se o modal for reaberto, as últimas escolhas sejam mantidas.
  const [selectedCreme, setSelectedCreme] = useState(selectedOptions.creme || null);
  const [selectedFrutas, setSelectedFrutas] = useState(selectedOptions.frutas || []);
  const [selectedComplementos, setSelectedComplementos] = useState(selectedOptions.complementos || []);
  const [selectedAdicionais, setSelectedAdicionais] = useState(selectedOptions.adicionais || []);
  const [selectedCaldas, setSelectedCaldas] = useState(selectedOptions.caldas || null);

  const [currentTotalPrice, setCurrentTotalPrice] = useState(0); 
  
  const adicionais = ['Creme de Avelã', 'Biscoito Oreo', 'Kit Kat'];
 
  // 1. Lógica de cálculo de preço (Depende dos estados locais)
  useEffect(() => {
    const calculateTotalPrice = () => {
      let basePrice = 0;

      switch (selectedAcai) {
        case '300ml': basePrice = 14; break;
        case '400ml': basePrice = 16; break;
        case '500ml': basePrice = 18; break;
        case '700ml': basePrice = 23; break;  
        case '1L': basePrice = 40; break;    
        case 'Barca 550ml': basePrice = 25; break;
        default: basePrice = 0;
      }

      const additionalPrice = selectedAdicionais.length * 4;
      const total = basePrice + additionalPrice;
      setCurrentTotalPrice(total);
    };

    calculateTotalPrice();
  }, [selectedAcai, selectedAdicionais]);

  // 2. Lógica de sincronização com o App.jsx (Depende dos estados locais)
  useEffect(() => {
    setSelectedOptions({
      creme: selectedCreme,
      frutas: selectedFrutas,
      complementos: selectedComplementos,
      adicionais: selectedAdicionais,
      caldas: selectedCaldas
    });
  }, [selectedCreme, selectedFrutas, selectedComplementos, selectedAdicionais, selectedCaldas, setSelectedOptions]);


  // --- FUNÇÕES DE MANIPULAÇÃO CORRIGIDAS ---

  // CRÍTICO: Função de seleção única (Creme e Caldas)
  const handleSelectCreme = (creme) => {
    // Permite desmarcar
    setSelectedCreme(selectedCreme === creme ? null : creme);
  };
  const handleSelectCalda = (calda) => {
    // Permite desmarcar
    setSelectedCaldas(selectedCaldas === calda ? null : calda);
  };

  // Função de seleção de Frutas (limite de 2)
  const handleToggleFruta = (fruta) => {
    if (selectedFrutas.includes(fruta)) {
      setSelectedFrutas(selectedFrutas.filter(item => item !== fruta));
    } else {
      if (selectedFrutas.length < 2) { 
        setSelectedFrutas([...selectedFrutas, fruta]);
      } else {
        alert("Você pode escolher no máximo 2 opções de frutas.");
      }
    }
  };

  // Função de seleção de Complementos (limite para Barca)
  const handleToggleComplemento = (complemento) => {
    setSelectedComplementos(prev => {
      if (prev.includes(complemento)) {
        return prev.filter(item => item !== complemento);
      }
      if (selectedAcai === 'Barca 550ml' && prev.length >= 3) {
        alert("A Barca tem um limite de 3 complementos.");
        return prev;
      }
      return [...prev, complemento];
    });
  };

  // Função de seleção de Adicionais (sem limite)
  const handleToggleAdicional = (adicional) => {
    setSelectedAdicionais(prev => 
        prev.includes(adicional)
      ? prev.filter(item => item !== adicional)
      : [...prev, adicional]
    );
  };
  // ------------------------------------------

  const handleConfirm = () => {
    // CRÍTICO: Validação do Creme
    if (!selectedCreme) {
        alert("Por favor, selecione uma opção de creme (Obrigatório).");
        return;
    }

    // 1. Envia as opções COMPLETAS E O PREÇO FINAL para o App.jsx
    onSelectOptions({
      creme: selectedCreme,
      frutas: selectedFrutas,
      complementos: selectedComplementos,
      adicionais: selectedAdicionais,
      caldas: selectedCaldas
    }, currentTotalPrice); 
    
    // 2. Fecha o modal
    onClose(); 
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {selectedAcai && <SelectedAcai>{`Açaí de ${selectedAcai}`}</SelectedAcai>}
        <h2>Escolha os extras para o seu açaí</h2>

        <ModalSection>
          <Subtitle>Creme</Subtitle>
          <SubtitleGray>Escolha até 1 opção (Obrigatório)</SubtitleGray>
          <OptionsContainer>
            {/* CORRIGIDO: Chamando handleSelectCreme e usando selectedCreme para 'selected' */}
            <OptionItem selected={selectedCreme === 'Leite Ninho'} onClick={() => handleSelectCreme('Leite Ninho')}>
              Leite Ninho <PlusButton selected={selectedCreme === 'Leite Ninho'}>{selectedCreme === 'Leite Ninho' ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedCreme === 'Ovomaltine'} onClick={() => handleSelectCreme('Ovomaltine')}>
              Ovomaltine <PlusButton selected={selectedCreme === 'Ovomaltine'}>{selectedCreme === 'Ovomaltine' ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedCreme === 'Paçoca'} onClick={() => handleSelectCreme('Paçoca')}>
              Paçoca <PlusButton selected={selectedCreme === 'Paçoca'}>{selectedCreme === 'Paçoca' ? '✓' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Frutas</Subtitle>
          <SubtitleGray>Escolha até 2 opções</SubtitleGray>
          <OptionsContainer>
            {/* CORRIGIDO: Chamando handleToggleFruta e usando selectedFrutas.includes() */}
            <OptionItem selected={selectedFrutas.includes('Morango')} onClick={() => handleToggleFruta('Morango')}>
              Morango <PlusButton selected={selectedFrutas.includes('Morango')}>{selectedFrutas.includes('Morango') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Banana')} onClick={() => handleToggleFruta('Banana')}>
              Banana <PlusButton selected={selectedFrutas.includes('Banana')}>{selectedFrutas.includes('Banana') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Manga')} onClick={() => handleToggleFruta('Manga')}>
              Manga <PlusButton selected={selectedFrutas.includes('Manga')}>{selectedFrutas.includes('Manga') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedFrutas.includes('Uva')} onClick={() => handleToggleFruta('Uva')}>
              Uva <PlusButton selected={selectedFrutas.includes('Uva')}>{selectedFrutas.includes('Uva') ? '✓' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Complementos</Subtitle>
          <SubtitleGray>
            {selectedAcai === 'Barca 550ml' 
              ? "Escolha até 3 opções" 
              : "Escolha quantos quiser"}
          </SubtitleGray>
          <OptionsContainer>
            {/* CORRIGIDO: Chamando handleToggleComplemento */}
            <OptionItem selected={selectedComplementos.includes('Leite em pó')} onClick={() => handleToggleComplemento('Leite em pó')}>
              Leite em pó <PlusButton selected={selectedComplementos.includes('Leite em pó')}>{selectedComplementos.includes('Leite em pó') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Granola')} onClick={() => handleToggleComplemento('Granola')}>
              Granola <PlusButton selected={selectedComplementos.includes('Granola')}>{selectedComplementos.includes('Granola') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Paçoca')} onClick={() => handleToggleComplemento('Paçoca')}>
              Paçoca <PlusButton selected={selectedComplementos.includes('Paçoca')}>{selectedComplementos.includes('Paçoca') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Farinha Láctea')} onClick={() => handleToggleComplemento('Farinha Láctea')}>
              Farinha Láctea <PlusButton selected={selectedComplementos.includes('Farinha Láctea')}>{selectedComplementos.includes('Farinha Láctea') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Amendoim')} onClick={() => handleToggleComplemento('Amendoim')}>
              Amendoim <PlusButton selected={selectedComplementos.includes('Amendoim')}>{selectedComplementos.includes('Amendoim') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Confete')} onClick={() => handleToggleComplemento('Confete')}>
              Confete <PlusButton selected={selectedComplementos.includes('Confete')}>{selectedComplementos.includes('Confete') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Chocoball')} onClick={() => handleToggleComplemento('Chocoball')}>
              Chocoball <PlusButton selected={selectedComplementos.includes('Chocoball')}>{selectedComplementos.includes('Chocoball') ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedComplementos.includes('Ovomaltine')} onClick={() => handleToggleComplemento('Ovomaltine')}>
              Ovomaltine <PlusButton selected={selectedComplementos.includes('Ovomaltine')}>{selectedComplementos.includes('Ovomaltine') ? '✓' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Caldas</Subtitle>
          <SubtitleGray>Escolha até 1 opção</SubtitleGray>
          <OptionsContainer>
             {/* CORRIGIDO: Chamando handleSelectCalda */}
            <OptionItem selected={selectedCaldas === 'Leite Condensado'} onClick={() => handleSelectCalda('Leite Condensado')}>
              Leite Condensado <PlusButton selected={selectedCaldas === 'Leite Condensado'}>{selectedCaldas === 'Leite Condensado' ? '✓' : '+'}</PlusButton>
            </OptionItem>
            <OptionItem selected={selectedCaldas === 'Mel'} onClick={() => handleSelectCalda('Mel')}>
              Mel <PlusButton selected={selectedCaldas === 'Mel'}>{selectedCaldas === 'Mel' ? '✓' : '+'}</PlusButton>
            </OptionItem>
          </OptionsContainer>
        </ModalSection>

        <ModalSection>
          <Subtitle>Adicionais </Subtitle>
          <SubtitleGray>Escolha quantos quiser</SubtitleGray>
          {adicionais.map((adicional) => (
            <OptionItem key={adicional} selected={selectedAdicionais.includes(adicional)} onClick={() => handleToggleAdicional(adicional)}>
              {adicional} (+R$4,00)
              {/* CORRIGIDO: Chamando handleToggleAdicional */}
              <PlusButton selected={selectedAdicionais.includes(adicional)}>{selectedAdicionais.includes(adicional) ? '✓' : '+'}</PlusButton>
            </OptionItem>
          ))}
        </ModalSection>


        <ButtonContainer>
            <CloseButton onClick={onClose}>Fechar</CloseButton>
            <ConfirmButton onClick={handleConfirm}>
                Adicionar - R$ {currentTotalPrice.toFixed(2)}
            </ConfirmButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

// Estilos dos componentes (MANTIDOS e ajustados)

const SelectedAcai = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  font-size: 1.3rem;
  color: #6A3093;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
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
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%; 
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20px;
  padding-bottom: 100px;
  overflow-y: auto;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-height: 90vh;
  overflow-y: auto;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  position: relative; 

  h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }
`;

const ModalSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
`;

const SubtitleGray = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 12px 15px;
  border-radius: 8px;
  /* CRÍTICO: Estilo corrigido para cor roxa */
  background-color: ${({ selected }) => (selected ? '#F0E6FF' : '#f9f9f9')};
  color: ${({ selected }) => (selected ? '#6A3093' : '#333')};
  font-weight: ${({ selected }) => (selected ? '500' : '400')};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ selected }) => (selected ? '#E2D0FF' : '#f0f0f0')};
  }
`;

const PlusButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  /* CRÍTICO: Estilo corrigido para cor roxa */
  border: 1px solid ${({ selected }) => (selected ? '#6A3093' : '#ccc')};
  background-color: ${({ selected }) => (selected ? '#6A3093' : 'transparent')};
  color: ${({ selected }) => (selected ? 'white' : '#6A3093')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: #f1f1f1;
  color: #333;
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
`;