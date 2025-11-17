import React, { useEffect, useState } from 'react';
import HeaderLogo from './components/Header/HeaderLogo.jsx';
import AcaiModal from './components/Body/Modal.jsx'; // Seu Modal.jsx
import CakeModal from './components/Body/CakeModal.jsx'; // Novo modal de bolo
import DessertModal from './components/Body/DessertModal.jsx';
import ComboModal from './components/Body/ComboModal.jsx';
import SimpleConfirmModal from './components/Body/SimpleConfirmModal.jsx';
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
import cenoura from './assets/cenoura_chocolate.jpeg';
import ninho_nutella from './assets/ninho_nutella.jpeg'; 
import oreo from './assets/oreo.jpeg'; 
import sensacao from './assets/sensacao.jpeg'; 
import ninho_morango from './assets/ninho_morango.jpeg'; 
import kinder from './assets/kinder.jpeg'; 
import combo_01 from './assets/combo_01.jpeg'; 
import brownie from './assets/brownie.jpeg'; 
import brig_ninho_morango from './assets/brig_ninho_morango.jpeg'; 
import brig_ninho_nutella from './assets/brig_ninho_nutella.jpeg'; 
import shake from './assets/shake_acai.jpeg';  
import pudim from './assets/pudim.jpeg'; 
import surpresa_uva from './assets/surpresa_uva.jpeg'; 

// Importações do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// --- LISTA DE PRODUTOS ---
const ACAL_OPTIONS = [
    { type: '300ml', title: 'Açaí - 300 ml', price: 14.00, image: acaiimg3 },
    { type: '400ml', title: 'Açaí - 400 ml', price: 16.00, image: acaiimg2 },
    { type: '500ml', title: 'Açaí - 500 ml', price: 18.00, image: acaiimg4 },
    { type: '700ml', title: 'Açaí - 700 ml', price: 23.00, image: acaiimg5 },
    { type: '1L', title: 'Açaí - 1 Litro', price: 40.00, image: litro },
    { type: 'Barca 550ml', title: 'Barca 550ml', price: 25.00, image: barca },
];
const SHAKE_OPTION = { 
    id: 'shake1', 
    titulo: 'Shake de Açaí', 
    descricao: 'Shake de Açaí batido com ninho e paçoca', 
    preco: 16.00, 
    image: shake, 
    type: 'Shake' 
};
const IMAGE_MAP = {
    cenoura: cenoura,
    ninho_nutella: ninho_nutella,
    oreo: oreo,
    sensacao: sensacao,
    ninho_morango: ninho_morango,
    kinder: kinder,
};
const CAKE_OPTIONS = [
    { id: 'bolo1', titulo: 'Bolo de Cenoura com Brigadeiro', descricao: 'Massa fofinha de cenoura com uma generosa cobertura de brigadeiro.', preco: 20.00, image: 'cenoura', type: 'Bolo' },
    { id: 'bolo2', titulo: 'Bolo de Biscoito Oreo', descricao: 'Delicioso bolo de biscoito oreo.', preco: 20.00, image: 'oreo', type: 'Bolo' },
    { id: 'bolo3', titulo: 'Bolo de Ninho com Morango', descricao: 'Nosso bolo vulcão artesanal é composto de massa de chocolate, recheado no centro com morangos e coberto por uma calda de Ninho.', preco: 20.00, image: 'ninho_morango', type: 'Bolo' },
    { id: 'bolo4', titulo: 'Bolo de Ninho com Nutella', descricao: 'Massa super fofinha de chocolate com cobertura cremosa de Ninho com Nutella.', preco: 25.00, image: 'ninho_nutella', type: 'Bolo' },
    { id: 'bolo5', titulo: 'Bolo Sensação', descricao: 'Delicioso bolo de chocolate com cobertura de brigadeiro e pedaços de morango fresco.', preco: 20.00, image: 'sensacao', type: 'Bolo' },
    { id: 'bolo6', titulo: 'Bolo de Kinder Bueno', descricao: 'Massa de chocolate, pedaços de Kinder Bueno e cobertura.', preco: 27.00, image: 'kinder', type: 'Bolo' },
];
const COMBO_OPTIONS = [
    { 
        id: 'combo1', 
        titulo: 'Combo Especial', 
        descricao: '2 tortas de frango + 1 bolo de sua escolha + 2 refrigerantes', 
        preco: 45.00, 
        image: combo_01, 
        type: 'Combo' 
    },
];
const DESSERT_OPTIONS = [
    { id: 'dessert1', titulo: 'Brownie Tradicional', descricao: 'Delicioso Brownie tradicional', preco: 13.00, image: brownie, type: 'Sobremesa' },
    { id: 'dessert2', titulo: 'Brigadeiro de Ninho c/ Morango', descricao: 'Brigadeiro de colher de Ninho com morango', preco: 12.00, image: brig_ninho_morango, type: 'Sobremesa' },
    { 
        id: 'dessert3', 
        titulo: 'Brigadeiro de Ninho c/ Nutella', 
        descricao: 'Brigadeiro de ninho com nutella, escolha uma fruta: uva ou morango', 
        preco: 15.00, 
        image: brig_ninho_nutella,
        type: 'Sobremesa' 
    },
    { 
        id: 'dessert4', 
        titulo: 'Pudim', 
        descricao: 'Delicioso pudim de leite condensado', 
        preco: 7.00, 
        image: pudim,
        type: 'Sobremesa' 
    },
    { 
        id: 'dessert5', 
        titulo: 'Surpresa de Uva', 
        descricao: 'Creme de Ninho, Uva sem semente e chocolate cremoso', 
        preco: 7.00, 
        image: surpresa_uva,
        type: 'Sobremesa' 
    },
];
// -----------------------------

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
    
    // Estados da aplicação
    const [selectedTab, setSelectedTab] = useState('Açaí do Wagão'); 
    const [isAcaiModalOpen, setIsAcaiModalOpen] = useState(false);
    const [isCakeModalOpen, setIsCakeModalOpen] = useState(false); 
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedAcai, setSelectedAcai] = useState(null);
    const [selectedCake, setSelectedCake] = useState(null); 
    const [selectedDessert, setSelectedDessert] = useState(null); 
    const [isDessertModalOpen, setIsDessertModalOpen] = useState(false); 
    const [selectedCombo, setSelectedCombo] = useState(null); 
    const [isComboModalOpen, setIsComboModalOpen] = useState(false); 
    const [selectedRefri, setSelectedRefri] = useState('Normal');
    const [isSimpleConfirmModalOpen, setIsSimpleConfirmModalOpen] = useState(false); 
    const [itemToConfirm, setItemToConfirm] = useState(null); 
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

    // Inicialização do Firebase e autenticação (MANTIDO)
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
                await signInAnonymously(firebaseAuth);
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, [firebaseConfig]); 

     // --- NOVO: LÓGICA DE CONFIRMAÇÃO SIMPLES (SHAKE) ---
    const handleOpenSimpleConfirmModal = (item) => {
        // Esta função será chamada ao clicar em Shake, Brownie, Brigadeiro Morango.
        
        // Se for o Brownie ou Brigadeiro Ninho/Morango (que não tinham modal), 
        // a lógica de Sobremesa (handleOpenDessertModal) vai rotear para cá.
        // O Shake também roteará para cá através do renderShakeItem.

        setItemToConfirm(item);
        setIsSimpleConfirmModalOpen(true);
    };

    const handleCloseSimpleConfirmModal = () => {
        setIsSimpleConfirmModalOpen(false);
        setItemToConfirm(null);
    };

    // FUNÇÃO REVISADA: Agora esta função SÓ adiciona ao carrinho, depois de confirmado.
    const handleAddSimpleItem = (item) => {
        // Esta função é chamada PELO MODAL DE CONFIRMAÇÃO.
        const novoPedido = {
            tamanho: item.titulo, 
            preco: item.preco,
            tipoProduto: item.type,
            creme: null, frutas: [], complementos: [], adicionais: [], caldas: null 
        };

        setPedidos(prevPedidos => {
            const pedidosAtualizados = [...prevPedidos, novoPedido];
            const novoTotal = pedidosAtualizados.reduce((total, pedido) => total + pedido.preco, 0);
            setTotalPrice(novoTotal);
            return pedidosAtualizados;
        });
        // Não fechar o modal aqui, pois o modal que a chama se fecha sozinho.
    };
    
    // --- FUNÇÕES DE MANIPULAÇÃO DE PEDIDOS DE AÇAÍ ---
    // A função handleSelectAcaiOptions deve ser atualizada para usar a nova estrutura de pedido
    const handleSelectAcaiOptions = (options, newAcaiPrice) => {
        const novoPedido = {
            tamanho: selectedAcai,
            ...options,
            preco: newAcaiPrice, // O preço calculado no Modal.jsx é usado
            tipoProduto: 'Açaí' // Novo campo para diferenciar
        };

        setPedidos(prevPedidos => {
            const novosPedidos = [...prevPedidos, novoPedido];
            const novoTotal = novosPedidos.reduce((total, pedido) => total + pedido.preco, 0);
            setTotalPrice(novoTotal);
            return novosPedidos;
        });
        
        handleCloseAcaiModal();
    };

    const handleOpenAcaiModal = (acaiType) => {
        setSelectedAcai(acaiType);
        // Resetar opções para o novo açaí
        setSelectedOptions({
            creme: null,
            frutas: [],
            complementos: [],
            adicionais: [],
            caldas: null
        });
        setIsAcaiModalOpen(true);
    };

    const handleCloseAcaiModal = () => {
        setIsAcaiModalOpen(false);
    };

    // --- FUNÇÕES DE MANIPULAÇÃO DE PEDIDOS DE BOLO ---
    const handleOpenCakeModal = (cake) => {
        const cakeWithImage = {
            ...cake,
            image: IMAGE_MAP[cake.image] 
        };
        setSelectedCake(cakeWithImage);
        setIsCakeModalOpen(true);
    };

    const handleCloseCakeModal = () => {
        setIsCakeModalOpen(false);
        setSelectedCake(null); // Limpar o bolo selecionado ao fechar
    };

    const handleSelectCake = (cake, quantity) => {
        const novosPedidos = [];
        // Adiciona um pedido por item, para que possam ser removidos individualmente no futuro
        for (let i = 0; i < quantity; i++) {
             novosPedidos.push({
                tamanho: cake.titulo, // Usa o título como "tamanho" para o bolo
                preco: cake.preco,
                tipoProduto: 'Bolo',
                // Zera as outras opções para o bolo (importante para o CheckoutForm)
                creme: null, frutas: [], complementos: [], adicionais: [], caldas: null 
            });
        }
        
        setPedidos(prevPedidos => {
            const pedidosAtualizados = [...prevPedidos, ...novosPedidos];
            const novoTotal = pedidosAtualizados.reduce((total, pedido) => total + pedido.preco, 0);
            setTotalPrice(novoTotal);
            return pedidosAtualizados;
        });

        setSelectedCake(null); // Limpar após adicionar ao pedido
    };
    // ----------------------------------------------------

    // --- NOVO: FUNÇÕES DE MANIPULAÇÃO DE PEDIDOS DE COMBO ---
    const handleOpenComboModal = (combo) => {
        setSelectedCombo(combo);
        setIsComboModalOpen(true);
    };

    const handleCloseComboModal = () => {
        setIsComboModalOpen(false);
        setSelectedCombo(null);
        setSelectedRefri('Normal');
    };

    const handleSelectComboOptions = (selectedCakeOption, selectedRefriOption) => {
        const combo = selectedCombo;
        const observacoes = `Bolo: ${selectedCakeOption.titulo} | Refrigerante: ${selectedRefriOption}`;
        const novoPedido = {
            tamanho: combo.titulo, 
            preco: combo.preco,
            tipoProduto: 'Combo',
            observacoes: observacoes, 
            creme: null, frutas: [], complementos: [], adicionais: [], caldas: null 
        };
        
        setPedidos(prevPedidos => {
            const pedidosAtualizados = [...prevPedidos, novoPedido];
            const novoTotal = pedidosAtualizados.reduce((total, pedido) => total + pedido.preco, 0);
            setTotalPrice(novoTotal);
            return pedidosAtualizados;
        });
        handleCloseComboModal();
    };
    
    // --- NOVO: FUNÇÕES DE MANIPULAÇÃO DE PEDIDOS DE SOBREMESA ---
    const handleOpenDessertModal = (dessert) => {
        // Se for o item com ID 'dessert3' (Ninho/Nutella), que tem a escolha de fruta, abra o modal.
        if (dessert.id === 'dessert3') {
            setSelectedDessert(dessert);
            setIsDessertModalOpen(true);
        } else {
            // Se for Brownie ou Brigadeiro Ninho/Morango, adicione diretamente.
            handleOpenSimpleConfirmModal(dessert);
        }
    };

    const handleCloseDessertModal = () => {
        setIsDessertModalOpen(false);
        setSelectedDessert(null);
    };
    
    const handleSelectDessertOption = (fruitOption) => {
        const item = selectedDessert;
        const novoPedido = {
            tamanho: `${item.titulo} (${fruitOption})`, 
            preco: item.preco,
            tipoProduto: item.type,
            observacoes: `Fruta Escolhida: ${fruitOption}`,
            creme: null, frutas: [], complementos: [], adicionais: [], caldas: null 
        };
        
        setPedidos(prevPedidos => {
            const pedidosAtualizados = [...prevPedidos, novoPedido];
            const novoTotal = pedidosAtualizados.reduce((total, pedido) => total + pedido.preco, 0);
            setTotalPrice(novoTotal);
            return pedidosAtualizados;
        });
        
        handleCloseDessertModal();
    };
    // --- LÓGICA DE CHECKOUT E RESET (MANTIDA) ---
    const handleFecharPedido = () => {
        if (pedidos.length === 0) return;
        setIsCheckoutOpen(true);
    };

    const handleBackFromCheckout = () => {
        setIsCheckoutOpen(false);
    };

    const resetPedido = () => {
        setSelectedAcai(null);
        setSelectedCake(null);
        setSelectedDessert(null);
        setSelectedCombo(null); 
        setItemToConfirm(null);
        setIsSimpleConfirmModalOpen(false);
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
        setIsDessertModalOpen(false); 
        setIsComboModalOpen(false); 
    };

    const handleClearOrder = () => {
        resetPedido();
    };

    const handleConfirmCheckout = async () => {
        // Lógica de checkout é feita no CheckoutForm, aqui apenas reseta o estado
        resetPedido();
    };

    useEffect(() => {
        const isAnyModalOpen = isAcaiModalOpen || isCakeModalOpen || isDessertModalOpen || isComboModalOpen;
        if (isAnyModalOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isAcaiModalOpen, isCakeModalOpen, isDessertModalOpen, isComboModalOpen, isSimpleConfirmModalOpen]); 


    // Renderização do Cardápio de Açaí (Ajustado para o novo grid)
    const renderAcaiMenu = () => (
        <AcaiOptionGrid>
            {ACAL_OPTIONS.map((item) => (
                <AcaiOptionContainer key={item.type} onClick={() => handleOpenAcaiModal(item.type)}>
                    <AcaiInfo>
                        <AcaiTitle>{item.title}</AcaiTitle>
                        <AcaiPrice>R$ {item.price.toFixed(2)}</AcaiPrice>
                    </AcaiInfo>
                    <AcaiImage src={item.image} alt={item.title} />
                </AcaiOptionContainer>
            ))}
        </AcaiOptionGrid>
    );
     // Renderização do Shake
     const renderShakeItem = () => (
        <CakeMenuContainer>
            <CakeItemContainer 
                key={SHAKE_OPTION.id} 
                onClick={() => handleOpenSimpleConfirmModal(SHAKE_OPTION)} // CHAMA O MODAL
            >
                <CakeTextContent>
                    <CakeTitle>{SHAKE_OPTION.titulo}</CakeTitle>
                    <CakeDescription>{SHAKE_OPTION.descricao}</CakeDescription>
                    <CakePrice>R$ {SHAKE_OPTION.preco.toFixed(2)}</CakePrice>
                </CakeTextContent>
                <CakeImageItem src={SHAKE_OPTION.image} alt={SHAKE_OPTION.titulo} /> 
            </CakeItemContainer>
        </CakeMenuContainer>
    );

    // Renderização do Cardápio de Bolos Vulcões (NOVO)
    const renderCakeMenu = () => (
        <CakeMenuContainer>
            {CAKE_OPTIONS.map((cake) => (
                <CakeItemContainer key={cake.id} onClick={() => handleOpenCakeModal(cake)}>
                    <CakeTextContent>
                        <CakeTitle>{cake.titulo}</CakeTitle>
                        <CakeDescription>{cake.descricao}</CakeDescription>
                        <CakePrice>R$ {cake.preco.toFixed(2)}</CakePrice>
                    </CakeTextContent>
                    {/* Usando a imagem genérica importada */}
                    <CakeImageItem src={IMAGE_MAP[cake.image]} alt={cake.titulo} /> 
                </CakeItemContainer>
            ))}
        </CakeMenuContainer>
    );
     // Renderização do Cardápio de Combos (USANDO FUNÇÃO DE ABRIR MODAL)
     const renderComboMenu = () => (
        <CakeMenuContainer>
            {COMBO_OPTIONS.map((combo) => (
                <CakeItemContainer key={combo.id} onClick={() => handleOpenComboModal(combo)}>
                    <CakeTextContent>
                        <CakeTitle>{combo.titulo}</CakeTitle>
                        <CakeDescription>{combo.descricao}</CakeDescription>
                        <CakePrice>R$ {combo.preco.toFixed(2)}</CakePrice>
                    </CakeTextContent>
                    <CakeImageItem src={combo.image} alt={combo.titulo} /> 
                </CakeItemContainer>
            ))}
        </CakeMenuContainer>
    );

    // Renderização do Cardápio de Sobremesas (USANDO FUNÇÃO DE ABRIR MODAL CONDICIONAL)
    const renderDessertMenu = () => (
        <CakeMenuContainer>
            {DESSERT_OPTIONS.map((dessert) => (
                <CakeItemContainer key={dessert.id} onClick={() => handleOpenDessertModal(dessert)}>
                    <CakeTextContent>
                        <CakeTitle>{dessert.titulo}</CakeTitle>
                        <CakeDescription>{dessert.descricao}</CakeDescription>
                        <CakePrice>R$ {dessert.preco.toFixed(2)}</CakePrice>
                    </CakeTextContent>
                    <CakeImageItem src={dessert.image} alt={dessert.titulo} /> 
                </CakeItemContainer>
            ))}
        </CakeMenuContainer>
    );

    const scrollToSection = (id) => {
        // 1. Encontrar o elemento pelo ID
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (id === 'acai-section') {
            setSelectedTab('Açaí do Wagão');
        } else if (id === 'combos-section') {
            setSelectedTab('Combos');
        } else if (id === 'bolos-section') {
            setSelectedTab('Bolos Vulcões');
        } else if (id === 'sobremesas-section') {
            setSelectedTab('Sobremesas');
        }
    };
    //const menuContent = selectedTab === 'Açaí do Wagão' ? renderAcaiMenu() : renderCakeMenu();

    return (
        <>
            <GlobalStyle />
            {/* NOVO: HeaderContainer fixo com a Logo e a TabBar */}
            <HeaderContainer>
                <HeaderLogo />
                <TabBar>
                    <TabButton 
                        active={selectedTab === 'Açaí do Wagão'} 
                        onClick={() => scrollToSection('acai-section')}
                    >
                        Açaí do Wagão
                    </TabButton>
                    <TabButton 
                        active={selectedTab === 'Combos'} 
                        onClick={() => scrollToSection('combos-section')}
                    >
                        Combos
                    </TabButton>
                    <TabButton 
                        active={selectedTab === 'Bolos Vulcões'} 
                        onClick={() => scrollToSection('bolos-section')}
                    >
                        Bolos Vulcões
                    </TabButton>
                    <TabButton 
                        active={selectedTab === 'Sobremesas'} 
                        onClick={() => scrollToSection('sobremesas-section')}
                    >
                        Sobremesas
                    </TabButton>
                </TabBar>
            </HeaderContainer>

            {isDownloadPage ? (
                <Download db={db} userId={userId} appId={appId} />
            ) : (
                <>
                    <Content>
                         {/* 1. SEÇÃO AÇAÍ */}
                         <SectionContainer id="acai-section">
                            <SectionTitle>Açaí do Wagão</SectionTitle>
                            {renderAcaiMenu()}
                        </SectionContainer>
                        
                        {/* 2. ITEM SHAKE */}
                        <SectionContainer>
                            <SectionTitle>Shakes</SectionTitle>
                            {renderShakeItem()}
                        </SectionContainer>

                        {/* 3. SEÇÃO COMBOS */}
                        <SectionContainer id="combos-section">
                            <SectionTitle>Combos</SectionTitle>
                            {renderComboMenu()}
                        </SectionContainer>
                        
                        {/* 4. SEÇÃO BOLOS VULCÕES */}
                        <SectionContainer id="bolos-section">
                            <SectionTitle>Bolos Vulcões</SectionTitle>
                            {renderCakeMenu()}
                        </SectionContainer>

                        {/* 5. SEÇÃO SOBREMESAS */}
                        <SectionContainer id="sobremesas-section">
                            <SectionTitle>Sobremesas</SectionTitle>
                            {renderDessertMenu()}
                        </SectionContainer>
                    </Content>

                    {/* Modal de Açaí (Seu Modal.jsx) */}
                    <AcaiModal
                        isOpen={isAcaiModalOpen}
                        onClose={handleCloseAcaiModal}
                        onSelectOptions={handleSelectAcaiOptions}
                        selectedAcai={selectedAcai}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        // updateTotalPrice e totalPrice não são mais necessários aqui (o cálculo é interno ao modal e o resultado é passado via onSelectOptions)
                    />

                    {/* Modal de Bolo (NOVO) */}
                    <CakeModal
                        isOpen={isCakeModalOpen}
                        onClose={handleCloseCakeModal}
                        onSelectCake={handleSelectCake}
                        cake={selectedCake}
                    />
                    <DessertModal
                        isOpen={isDessertModalOpen}
                        onClose={handleCloseDessertModal}
                        onSelectOption={handleSelectDessertOption}
                        dessert={selectedDessert}
                    />

                    <ComboModal
                        isOpen={isComboModalOpen}
                        onClose={handleCloseComboModal}
                        onSelectOptions={handleSelectComboOptions}
                        combo={selectedCombo}
                        cakeOptions={CAKE_OPTIONS} 
                        selectedRefri={selectedRefri}
                        setSelectedRefri={setSelectedRefri}
                    />

                    <SimpleConfirmModal
                        isOpen={isSimpleConfirmModalOpen}
                        onClose={handleCloseSimpleConfirmModal}
                        onConfirm={handleAddSimpleItem}
                        item={itemToConfirm}
                    />

                    {isCheckoutOpen && (
                        <CheckoutForm
                            pedidos={pedidos}
                            totalPrice={totalPrice}
                            onConfirm={handleConfirmCheckout}
                            onBack={handleBackFromCheckout}
                            db={db}
                            userId={userId}
                            appId={appId}
                        />
                    )}
                     {!isAcaiModalOpen && !isCakeModalOpen && !isCheckoutOpen && !isDessertModalOpen && !isComboModalOpen && (
                        <Footer
                            totalPrice={totalPrice}
                            fecharPedido={handleFecharPedido}
                            disabled={pedidos.length === 0}
                            onClearOrder={handleClearOrder}
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
  /* Altura da Logo (150px desktop / 120px mobile) + Altura da TabBar (aprox 50px) */
`;

const TabBar = styled.div`
    display: flex;
    overflow-x: auto;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    white-space: nowrap;
    border-bottom: 1px solid #ddd;
    /* Para fixar a barra abaixo do HeaderLogo */
    position: fixed;
    width: 100%; 
    left: 0;
    top: 150px; /* Altura do LogoWrapper desktop */
    z-index: 998;
    
    @media screen and (max-width: 768px) {
        top: 120px; /* Altura do LogoWrapper mobile */
    }
`;

const TabButton = styled.button`
    padding: 15px 20px;
    border: none;
    background: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ active }) => (active ? '#8E44AD' : '#555')};
    border-bottom: 3px solid ${({ active }) => (active ? '#8E44AD' : 'transparent')};
    transition: all 0.3s;
    flex-shrink: 0;

    &:hover {
        color: #8E44AD;
    }
`;


const Content = styled.div`
  /* Ajuste o padding-top para a soma da altura da Logo e da TabBar */
  padding-top: 215px; /* Altura do HeaderLogo (150px) + TabBar (aprox 50px) + margem */
  padding-bottom: 120px;

  @media screen and (max-width: 768px) {
    padding-top: 175px; /* Altura ajustada: Logo (120px) + TabBar (aprox 50px) + margem */
    padding-bottom: 150px;
  }
`;

const AcaiOptionGrid = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 20px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 0 15px;
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
  width: calc(50% - 10px); 
  margin-bottom: 20px;
  box-sizing: border-box;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    width: 100%;
    margin: 0 auto 15px;
    flex-direction: row; 
    justify-content: space-between;
    padding: 15px;
  }
`;

const AcaiInfo = styled.div`
  flex: 1;
`;

const AcaiTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 1.3rem;

  @media screen and (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const AcaiPrice = styled.p`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const AcaiImage = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 20px;

  @media screen and (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin-left: 10px;
  }
`;

// --- NOVOS ESTILOS PARA BOLOS (similar ao AcaiOptionContainer para manter consistência visual) ---
const CakeMenuContainer = styled.div`
    padding: 20px;

    @media screen and (max-width: 768px) {
        padding: 15px;
    }
`;

const CakeItemContainer = styled.div`
    display: flex;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    align-items: flex-start;
    justify-content: space-between;

    &:hover {
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }
`;

const CakeTextContent = styled.div`
    flex: 1;
    padding-right: 10px;
`;

const CakeTitle = styled.h3`
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 1.2rem;
`;

const CakeDescription = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 10px;
    line-height: 1.4;
`;

const CakePrice = styled.p`
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const CakeImageItem = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;

    @media screen and (max-width: 768px) {
        width: 80px;
        height: 80px;
    }
`;
const SectionContainer = styled.div`
  /* Apenas um wrapper para dar o ID */
  padding-bottom: 30px; /* Espaçamento entre as seções se necessário */
`;

const SectionTitle = styled.h2`
    font-size: 1.2em;
    color: #4A148C; /* Roxo escuro para o título da seção */
    text-align: center;
    margin: 20px 0 15px;
    padding: 0 20px;
`;
