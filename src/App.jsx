import React, { useEffect, useState } from 'react';
import HeaderLogo from './components/Header/HeaderLogo.jsx'; 
import AcaiModal from './components/Body/Modal.jsx'; 
import Footer from './components/Footer/Footer.jsx'; 
import CheckoutForm from './components/Checkout/CheckoutForm.jsx'; 
import Download from './components/Download/Download.jsx'; 
import styled, { createGlobalStyle } from 'styled-components';
import acaiimg2 from './assets/acai2.jpeg';
import acaiimg3 from './assets/acai3.jpeg';
import acaiimg4 from './assets/acai4.jpeg';
import acaiimg5 from './assets/acai5.jpeg';
import barca from './assets/barca.jpeg';
import litro from './assets/litro.jpeg';

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';

export default function App() {
    // Variáveis globais do Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyDvJcPc0Z3chL_JsLucYg7-li1B2d2lxTs",
      authDomain: "acaidowagaobsb.firebaseapp.com",
      projectId: "acaidowagaobsb",
      storageBucket: "acaidowagaobsb.firebasestorage.app",
      messagingSenderId: "761926054075",
      appId: "1:761926054075:web:c04dd9aa43ead362d6b99e"
    };
    const appId = firebaseConfig.appId;
    const initialAuthToken = null;
    // Estados da aplicação
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
    const [pedidos, setPedidos] = useState([]);
    const { pathname, search } = window.location;
    const isDownloadPage = pathname === '/download' || search.includes('download=');

    // Estados do Firebase
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Inicialização do Firebase e autenticação
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                if (initialAuthToken) {
                    try {
                        await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    } catch (error) {
                        console.error("Erro ao autenticar com token personalizado:", error);
                        await signInAnonymously(firebaseAuth);
                    }
                } else {
                    await signInAnonymously(firebaseAuth);
                }
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, [firebaseConfig, initialAuthToken]);

    // Funções de manipulação de estado
    const handleOpenModal = (acaiType) => {
        setSelectedAcai(acaiType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const calcularPreco = (tamanho, options) => {
        const precosBase = {
            '300ml': 14,
            '400ml': 16,
            '500ml': 18,
            'Barca 550ml': 25,
            '700ml': 23,
            '1L': 40
        };
        return precosBase[tamanho] + (options.adicionais.length * 4);
    };

    const handleSelectOptions = (options) => {
        const novoPedido = {
            tamanho: selectedAcai,
            ...options,
            preco: calcularPreco(selectedAcai, options)
        };

        setPedidos([...pedidos, novoPedido]);

        const novoTotal = [...pedidos, novoPedido].reduce((total, pedido) => {
            return total + pedido.preco;
        }, 0);

        setTotalPrice(novoTotal);
        handleCloseModal();
    };

    const handleFecharPedido = () => {
        if (pedidos.length === 0) return;
        setIsCheckoutOpen(true);
    };

    const handleBackFromCheckout = () => {
        setIsCheckoutOpen(false);
    };

    const resetPedido = () => {
        setSelectedAcai(null);
        setSelectedOptions({
            creme: null,
            frutas: [],
            complementos: [],
            adicionais: [],
            caldas: null
        });
        setPedidos([]);
        setTotalPrice(0);
        setIsCheckoutOpen(false);
    };

    // Função para confirmar o checkout e salvar o comprovante no Firestore
    const handleConfirmCheckout = async ({ nome, telefone, endereco, observacao, regiao, frete, imageUrl, timestamp }) => {
        if (!db || !userId) {
            console.error("Firestore não inicializado ou usuário não autenticado.");
            return;
        }

        try {
            // Salva a imagem no Firestore
            const comprovanteRef = doc(db, `artifacts/${appId}/public/data/comprovantes/${timestamp}`);
            await setDoc(comprovanteRef, {
                imageUrl: imageUrl,
                timestamp: timestamp,
                userId: userId,
                pedidoDetails: {
                    nome,
                    telefone,
                    endereco,
                    observacao,
                    regiao,
                    frete,
                    pedidos,
                    totalPrice
                }
            });
            console.log("Comprovante salvo no Firestore com ID:", timestamp);
        } catch (error) {
            console.error("Erro ao salvar comprovante no Firestore:", error);
        }

        resetPedido();
    };

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
            {isDownloadPage ? (
                <Download db={db} userId={userId} appId={appId} />
            ) : (
                <>
                    <Content>
                        <AcaiOptionRow>
                            <AcaiOptionContainer onClick={() => handleOpenModal('300ml')}>
                                <AcaiInfo>
                                    <AcaiTitle>Açaí - 300 ml</AcaiTitle>
                                    <AcaiPrice>R$ 14,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={acaiimg3} alt="Açaí imagem" />
                            </AcaiOptionContainer>
                            <AcaiOptionContainer onClick={() => handleOpenModal('400ml')}>
                                <AcaiInfo>
                                    <AcaiTitle>Açaí - 400 ml</AcaiTitle>
                                    <AcaiPrice>R$ 16,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={acaiimg2} alt="Açaí imagem" />
                            </AcaiOptionContainer>
                        </AcaiOptionRow>
                        <AcaiOptionRow>
                            <AcaiOptionContainer onClick={() => handleOpenModal('500ml')}>
                                <AcaiInfo>
                                    <AcaiTitle>Açaí - 500 ml</AcaiTitle>
                                    <AcaiPrice>R$ 18,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={acaiimg4} alt="Açaí imagem" />
                            </AcaiOptionContainer>
                            <AcaiOptionContainer onClick={() => handleOpenModal('700ml')}>
                                <AcaiInfo>
                                    <AcaiTitle>Açaí - 700 ml</AcaiTitle>
                                    <AcaiPrice>R$ 23,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={acaiimg5} alt="Açaí imagem" />
                            </AcaiOptionContainer>
                        </AcaiOptionRow>
                        <AcaiOptionRow>
                            <AcaiOptionContainer onClick={() => handleOpenModal('1L')}>
                                <AcaiInfo>
                                    <AcaiTitle>Açaí - 1 Litro</AcaiTitle>
                                    <AcaiPrice>R$ 40,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={litro} alt="Açaí imagem" />
                            </AcaiOptionContainer>
                            <AcaiOptionContainer onClick={() => handleOpenModal('Barca 550ml')}>
                                <AcaiInfo>
                                    <AcaiTitle>Barca 550ml</AcaiTitle>
                                    <AcaiPrice>R$ 25,00</AcaiPrice>
                                </AcaiInfo>
                                <AcaiImage src={barca} alt="Barca de açaí" />
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
                        updateTotalPrice={setTotalPrice} // Passa setTotalPrice diretamente
                        totalPrice={totalPrice}
                    />
                    {isCheckoutOpen && (
                        <CheckoutForm
                            pedidos={pedidos}
                            totalPrice={totalPrice}
                            onConfirm={handleConfirmCheckout}
                            onBack={handleBackFromCheckout}
                            db={db} // Passa o db para o CheckoutForm
                            userId={userId} // Passa o userId para o CheckoutForm
                            appId={appId} // Passa o appId para o CheckoutForm
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
            )}
        </>
    );
}

// Estilos globais
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

// Estilos dos componentes principais
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
  padding: 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 15px; 
    width: 100%;
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
  width: calc(50% - 15px);
  margin-bottom: 15px;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    width: 92%;
    margin: 0 auto 15px;
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

