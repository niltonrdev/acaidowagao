import React from 'react';
import HeaderLogo from './components/Header/HeaderLogo';
import styled from 'styled-components';
import acaiimg from './assets/açai.jpeg'

export default function App() {

  return (
    <>
      <HeaderLogo />
      <AcaiOptionContainer>
         <AcaiInfo>
           <AcaiTitle>Açaí - 300 ml</AcaiTitle>
           <AcaiPrice>R$ 12,00</AcaiPrice>
         </AcaiInfo>
         <AcaiImage src={acaiimg} alt="Açaí imagem" />
      </AcaiOptionContainer>
      <AcaiOptionContainer>
         <AcaiInfo>
           <AcaiTitle>Açaí - 400 ml</AcaiTitle>
           <AcaiPrice>R$ 14,00</AcaiPrice>
         </AcaiInfo>
         <AcaiImage src={acaiimg} alt="Açaí imagem" />
      </AcaiOptionContainer>
      <AcaiOptionContainer>
         <AcaiInfo>
           <AcaiTitle>Açaí - 500 ml</AcaiTitle>
           <AcaiPrice>R$ 16,00</AcaiPrice>
         </AcaiInfo>
         <AcaiImage src={acaiimg} alt="Açaí imagem" />
      </AcaiOptionContainer>
      <AcaiOptionContainer>
         <AcaiInfo>
           <AcaiTitle>Açaí - 700 ml</AcaiTitle>
           <AcaiPrice>R$ 20,00</AcaiPrice>
         </AcaiInfo>
         <AcaiImage src={acaiimg} alt="Açaí imagem" />
      </AcaiOptionContainer>

    </>
  )
}


export const AcaiOptionContainer = styled.div`
  background-color: #fff; /* Cor de fundo branca */
  border-radius: 10px; /* Bordas arredondadas */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra */
  padding: 20px; /* Espaçamento interno */
  display: flex;
  align-items: center;
`;

export const AcaiInfo = styled.div`
  flex: 1;
`;

export const AcaiTitle = styled.h2`
  margin: 0 0 10px; /* Margem inferior */
  font-size: 1.5rem; /* Tamanho da fonte */
`;

export const AcaiPrice = styled.p`
  margin: 0; /* Remover margem padrão */
  font-size: 1.2rem; /* Tamanho da fonte */
`;

export const AcaiImage = styled.img`
  width: 100px; /* Largura da imagem */
  height: auto; /* Altura automática */
  margin-left: 20px; /* Espaçamento à esquerda */
`;