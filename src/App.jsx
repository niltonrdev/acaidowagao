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

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const downloadTimestamp = params.get('download');
        
        if (downloadTimestamp) {
          const imageUrl = localStorage.getItem(`comprovante-${downloadTimestamp}`);
          if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `comprovante-acai-${downloadTimestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Limpa o localStorage após o download
            localStorage.removeItem(`comprovante-${downloadTimestamp}`);
            
            // Remove o parâmetro da URL sem recarregar a página
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }, []);
      
    const handleConfirmCheckout = async ({ nome, telefone, endereco, observacao, regiao, frete, imageUrl }) => {
        // Mensagem básica para o WhatsApp
        let message = `🍇 NOVO PEDIDO - AÇAÍ DO WAGÃO 🍇\n\n`;
        message += `👤 Cliente: ${nome}\n`;
        message += `📞 Telefone: ${telefone}\n`;
        message += `📍 Endereço: ${endereco}\n`;
        message += `🏷️ Região: ${regiao}\n`;
        if (observacao) message += `📝 Observações: ${observacao}\n\n`;
        message += `🛒 ITENS:\n\n`;
        pedidos.forEach((pedido, index) => {
          message += `🍧 Item ${index + 1}: Açaí ${pedido.tamanho} - R$ ${pedido.preco.toFixed(2)}\n`;
          if (pedido.creme) message += `   ▪️ Creme: ${pedido.creme}\n`;
          if (pedido.frutas.length > 0) message += `   ▪️ Frutas: ${pedido.frutas.join(', ')}\n`;
          if (pedido.complementos.length > 0) message += `   ▪️ Complementos: ${pedido.complementos.join(', ')}\n`;
          if (pedido.adicionais.length > 0) message += `   ▪️ Adicionais: ${pedido.adicionais.join(', ')}\n`;
          if (pedido.caldas) message += `   ▪️ Calda: ${pedido.caldas}\n`;
          message += `\n`;
        });
        
        message += `💰 Subtotal: R$ ${totalPrice.toFixed(2)}\n`;
        message += `🚚 Frete: R$ ${frete.toFixed(2)}\n`;
        message += `💳 TOTAL A PAGAR: R$ ${(totalPrice + frete).toFixed(2)}\n\n`;
        message += `⏱️ Tempo de preparo: 20-30 minutos\n\n`;

        // Abre o WhatsApp com a mensagem
        const whatsappUrl = `https://wa.me/5561990449507?text=${encodeURIComponent(message)}`;
        const newWindow = window.open(whatsappUrl, '_blank');
        
        // Se gerou a imagem, abre em nova aba para impressão
        if (imageUrl) {
          setTimeout(() => {
            const imgWindow = window.open('', '_blank');
            imgWindow.document.write(`
              <html>
                <head>
                  <title>Comprovante Açaí do Wagão</title>
                  <style>
                    body { text-align: center; padding: 20px; }
                    img { max-width: 100%; height: auto; }
                    button { 
                      padding: 10px 20px; 
                      background: #6A3093; 
                      color: white; 
                      border: none; 
                      border-radius: 5px; 
                      margin: 20px; 
                      cursor: pointer;
                    }
                  </style>
                </head>
                <body>
                  <img src="${imageUrl}" alt="Comprovante de Pedido">
                  <br>
                  <button onclick="window.print()">Imprimir Comprovante</button>
                </body>
              </html>
            `);
          }, 1000);
        }
        
        // Reseta após enviar
        resetPedido();
      };


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
  padding: 20px; /* Reduzi o padding geral */

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 15px; 
    width: 100%; /* Garante uso total da largura */
    box-sizing: border-box; 
  }
`;

const AcaiOptionContainer = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  align-items: center;
  width: calc(50% - 15px); /* Cards mais próximos no desktop */
  margin-bottom: 15px;
  box-sizing: border-box; /* Crucial para mobile */

  @media screen and (max-width: 768px) {
    width: 92%; /* O segredo está aqui! */
    margin: 0 auto 15px; /* Centraliza com margem automática */
    flex-direction: column;
    padding: 15px;
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