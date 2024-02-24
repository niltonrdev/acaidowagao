import React, { useState } from 'react';
import HeaderLogo from './components/Header/HeaderLogo';
import AcaiModal from './components/Body/Modal';
import styled from 'styled-components';
import acaiimg from './assets/açai.jpeg';


export default function App() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    creme: null,
    frutas: [],
    complementos: [],
    adicionais: [],
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const handleSelectOptions = (options) => {
    setSelectedOptions(options);
    handleCloseModal();
  };

  console.log(selectedOptions);

  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
      </HeaderContainer>

      <Content>
        <AcaiOptionRow>
          <AcaiOptionContainer onClick={handleOpenModal}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 300 ml</AcaiTitle>
              <AcaiPrice>R$ 12,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
          <AcaiOptionContainer onClick={handleOpenModal}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 400 ml</AcaiTitle>
              <AcaiPrice>R$ 14,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
        </AcaiOptionRow>
        <AcaiOptionRow>
          <AcaiOptionContainer onClick={handleOpenModal}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 500 ml</AcaiTitle>
              <AcaiPrice>R$ 16,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
          <AcaiOptionContainer onClick={handleOpenModal}>
            <AcaiInfo>
              <AcaiTitle>Açaí - 700 ml</AcaiTitle>
              <AcaiPrice>R$ 20,00</AcaiPrice>
            </AcaiInfo>
            <AcaiImage src={acaiimg} alt="Açaí imagem" />
          </AcaiOptionContainer>
        </AcaiOptionRow>
      </Content>
      <AcaiModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectOptions={handleSelectOptions} />
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