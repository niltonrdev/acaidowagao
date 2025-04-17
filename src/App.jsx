import React, { useEffect, useState } from 'react';
import HeaderLogo from './components/Header/HeaderLogo';
import AcaiModal from './components/Body/Modal';
import Footer from './components/Footer/Footer';
import styled from 'styled-components';
import acaiimg from './assets/açai.jpeg';
import { createGlobalStyle } from 'styled-components';

export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAcai, setSelectedAcai] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    creme: null,
    frutas: [],
    complementos: [],
    adicionais: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPedido, setTotalPedido] = useState(0);
  
  const handleOpenModal = (acaiType) => {
    setSelectedAcai(acaiType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleSelectOptions = (options) => {
    setSelectedOptions(options);
    handleCloseModal();
  };

  const fecharPedido = () => {
    // Aqui você pode adicionar a lógica para fechar o pedido, como navegar para a página de detalhes do cliente
    // ou enviar os dados do pedido para a loja.
    // Neste exemplo, apenas atualizaremos o total do pedido.
    setTotalPedido(totalPedido + totalPrice);
    setSelectedAcai(null);
    setSelectedOptions({
      creme: null,
      frutas: [],
      complementos: [],
      adicionais: [],
    });
    setTotalPrice(0);
  };

  const updateTotalPrice = (price) => {
    setTotalPrice(price);
  };
  console.log(selectedOptions);

  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
      </HeaderContainer>

      <Content>
        <AcaiOptionRow>
          <AcaiOptionContainer onClick={() => handleOpenModal('300ml')}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 300 ml</AcaiTitle>
              <AcaiPrice>R$ 14,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
          <AcaiOptionContainer onClick={() => handleOpenModal('400ml')}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 400 ml</AcaiTitle>
              <AcaiPrice>R$ 16,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
        </AcaiOptionRow>
        <AcaiOptionRow>
          <AcaiOptionContainer onClick={() => handleOpenModal('500ml')}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 500 ml</AcaiTitle>
              <AcaiPrice>R$ 18,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
          <AcaiOptionContainer onClick={() => handleOpenModal('700ml')}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 700 ml</AcaiTitle>
              <AcaiPrice>R$ 23,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
        </AcaiOptionRow>
        <AcaiOptionRow>
        <AcaiOptionContainer onClick={() => handleOpenModal('1L')}>
          <AcaiInfo>
            <AcaiTitle>Açaí - 1 Litro</AcaiTitle>
            <AcaiPrice>R$ 40,00</AcaiPrice>
          </AcaiInfo>
          <AcaiImage src={acaiimg} alt="Açaí imagem" />
        </AcaiOptionContainer>
      </AcaiOptionRow>
      </Content>
      <AcaiModal 
      isOpen={isModalOpen} 
      onClose={handleCloseModal} 
      onSelectOptions={handleSelectOptions} 
      selectedAcai={selectedAcai}
      selectedOptions={selectedOptions}
      setSelectedOptions={setSelectedOptions}
      updateTotalPrice={updateTotalPrice}
      totalPrice={totalPrice}
      />
    <GlobalStyle />
    <Footer totalPrice={totalPrice} fecharPedido={fecharPedido} />
    </>
  )
}

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999; 
`;

const Content = styled.div`
  padding-top: 170px; 
`;

const AcaiOptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 50px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 5px;
  }
`;

const AcaiOptionContainer = styled.div`
  background-color: #fff; 
  border-radius: 10px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  padding: 20px; 
  display: flex;
  align-items: center;
  width: calc(50% - 60px);
  margin-bottom: 20px;

  @media screen and (max-width: 768px) {
    width: 100%; 
    margin-right: 0; 
  }
`;

const AcaiInfo = styled.div`
  flex: 1;
`;

const AcaiTitle = styled.h2`
  margin: 0 0 10px; 
  font-size: 1.5rem; 
`;

const AcaiPrice = styled.p`
  margin: 0; 
  font-size: 1.2rem; 
`;

const AcaiImage = styled.img`
  width: 100px; 
  height: auto; 
  margin-left: 20px; 

  @media screen and (max-width: 768px) {
    margin-left: 0;
    margin-top: 20px; 
  }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
`;