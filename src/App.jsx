import React, { useEffect, useState } from 'react';
import HeaderLogo from './components/Header/HeaderLogo';
import AcaiModal from './components/Body/Modal';
import Footer from './components/Footer/Footer';
import CheckoutForm from './components/Checkout/CheckoutForm';
import styled from 'styled-components';
import acaiimg from './assets/açai.jpeg';
import { createGlobalStyle } from 'styled-components';

export default function App() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedAcai, setSelectedAcai] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({
        creme: null,
        frutas: [],
        complementos: [],
        adicionais: [],
        caldas: null
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPedido, setTotalPedido] = useState(0);
    const [pedidos, setPedidos] = useState([]);

    const handleOpenModal = (acaiType) => {
        setSelectedAcai(acaiType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const handleSelectOptions = (options) => {
        const novoPedido = {
          tamanho: selectedAcai,
          ...options,
          preco: calcularPreco(selectedAcai, options)
        };
        
        // Adiciona o novo pedido à lista
        setPedidos([...pedidos, novoPedido]);
        
        // Calcula o novo total somando todos os pedidos
        const novoTotal = [...pedidos, novoPedido].reduce((total, pedido) => {
          return total + pedido.preco;
        }, 0);
        
        setTotalPrice(novoTotal);
        handleCloseModal();
      };

      const calcularPreco = (tamanho, options) => {
        const precosBase = {
          '300ml': 14,
          '400ml': 16,
          '500ml': 18,
          '700ml': 23,
          '1L': 40
        };
        return precosBase[tamanho] + (options.adicionais.length * 4);
      };

    const handleFecharPedido = () => {
        if (pedidos.length === 0) return; // Verifica se há pedidos
        setIsCheckoutOpen(true);
    };

    const handleBackFromCheckout = () => {
        setIsCheckoutOpen(false);
    };


    const handleConfirmCheckout = (cliente) => {
        let message = `🍇 *NOVO PEDIDO - AÇAÍ DO WAGÃO* 🍇\n\n`;
        message += `*Cliente:* ${cliente.nome}\n`;
        message += `*Telefone:* ${cliente.telefone}\n`;
        message += `*Endereço:* ${cliente.endereco}\n`;
        
        if (cliente.observacao) message += `*Observações:* ${cliente.observacao}\n\n`;
        
        message += `*ITENS:*\n`;
        pedidos.forEach((pedido, index) => {
          message += `\n*Item ${index + 1}:* Açaí ${pedido.tamanho} - R$ ${pedido.preco.toFixed(2)}\n`;
          if (pedido.creme) message += `• Creme: ${pedido.creme}\n`;
          if (pedido.complementos.length > 0) message += `• Complementos: ${pedido.complementos.join(', ')}\n`;
          if (pedido.adicionais.length > 0) message += `• Adicionais: ${pedido.adicionais.join(', ')}\n`;
          if (pedido.frutas.length > 0) message += `• Frutas: ${pedido.frutas.join(', ')}\n`;
          if (pedido.caldas) message += `• Calda: ${pedido.caldas}\n`;
        });
        
        message += `\n*TOTAL: R$ ${totalPrice.toFixed(2)}*\n`;
        message += `🕒 *Tempo de preparo: 20-30 minutos*`;
        
        const whatsappUrl = `https://wa.me/5561990449507?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Reseta após enviar
        resetPedido();
      };

    // const formatWhatsAppMessage = (pedido, cliente, total) => {
    //     let message = `🍇 *NOVO PEDIDO - AÇAÍ DO WAGÃO* 🍇\n\n`;
    //     message += `*Cliente:* ${cliente.nome}\n`;
    //     message += `*Telefone:* ${cliente.telefone}\n`;
    //     message += `*Endereço:* ${cliente.endereco}\n`;
    //     if (cliente.observacao) message += `*Observações:* ${cliente.observacao}\n\n`;

    //     message += `*Pedido:*\n`;
    //     message += `- Açaí ${pedido.tamanho}\n`;
    //     if (pedido.creme) message += `- Creme: ${pedido.creme}\n`;
    //     if (pedido.frutas.length > 0) message += `- Frutas: ${pedido.frutas.join(', ')}\n`;
    //     if (pedido.complementos.length > 0) message += `- Complementos: ${pedido.complementos.join(', ')}\n`;
    //     if (pedido.adicionais.length > 0) message += `- Adicionais: ${pedido.adicionais.join(', ')}\n\n`;

    //     message += `*Total: R$ ${total.toFixed(2)}*\n\n`;
    //     message += `🕒 *Tempo de preparo: 20-30 minutos*`;

    //     return message;
    // };

    const resetPedido = () => {
        setSelectedAcai(null);
        setSelectedOptions({
          creme: null,
          frutas: [],
          complementos: [],
          adicionais: [],
        });
        setPedidos([]);
        setTotalPrice(0);
        setIsCheckoutOpen(false);
    };
    const updateTotalPrice = (price) => {
        setTotalPrice(price);
    };
    console.log(selectedOptions);
    useEffect(() => {
        if (isModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isModalOpen]);
    return (
        <>
            <GlobalStyle />
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
            {isCheckoutOpen && (
                <CheckoutForm
                    pedidos={pedidos}  
                    totalPrice={totalPrice}
                    onConfirm={handleConfirmCheckout}
                    onBack={handleBackFromCheckout}
                />
            )}
            {!isModalOpen && !isCheckoutOpen && (
                <Footer
                totalPrice={totalPrice}
                fecharPedido={handleFecharPedido}
                disabled={pedidos.length === 0}
                />
            )}

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
    &.modal-open {
      overflow: hidden;
    }
  }
`;