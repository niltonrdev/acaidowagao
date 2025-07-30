import React from 'react';
import acailogo from './../../assets/acailogo.jpg';
import styled from 'styled-components';

export default function HeaderLogo() {

  return (
    <>
      <LogoWrapper>
        <LogoContainer>
          <LogoImage src={acailogo} alt="Açaí do Wagão Logo" />
        </LogoContainer>
      </LogoWrapper>
    </>
  )
}

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LogoImage = styled.img`
  max-width: 280px;
  height: auto;
  border-radius: 50%;

  @media screen and (max-width: 768px) {
    max-width: 200px; /* Reduz o tamanho da logo no mobile */
  }
`;

export const LogoWrapper = styled.div`
  background-color: #20102A;
  width: 100%;
  height: 150px; /* Altura padrão para desktop */
  display: flex; /* Adicionado para centralizar verticalmente */
  align-items: center; /* Adicionado para centralizar verticalmente */
  justify-content: center; /* Adicionado para centralizar horizontalmente */

  @media screen and (max-width: 768px) {
    height: 120px; /* Reduz a altura do cabeçalho no mobile */
  }
`;
