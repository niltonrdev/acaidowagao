import React from 'react';
import styled from 'styled-components';

export default function SimpleConfirmModal({ isOpen, onClose, onConfirm, item }) {
  if (!isOpen || !item) return null;

  const handleConfirmation = () => {
    onConfirm(item);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Image src={item.image} alt={item.titulo} />
        
        <h2>Adicionar {item.titulo}?</h2>
        <p>
          Você deseja adicionar este item ao seu pedido?
        </p>
        <Price>R$ {item.preco.toFixed(2)}</Price>

        <ButtonRow>
          <CancelButton onClick={onClose}>Cancelar</CancelButton>
          <ConfirmButton onClick={handleConfirmation}>
            Adicionar ao Pedido
          </ConfirmButton>
        </ButtonRow>
      </ModalContent>
    </ModalOverlay>
  );
}

// --- ESTILOS ---
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 350px; max-height: 90vh; overflow-y: auto; position: relative; text-align: center; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #333;
`;

const Image = styled.img`
  width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin: 15px auto;
`;

const Price = styled.p`
  font-size: 1.5rem; font-weight: 600; color: #6A3093; margin: 10px 0 20px;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const CancelButton = styled.button`
    flex: 1;
    background-color: #aaa;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover { background-color: #888; }
`;

const ConfirmButton = styled.button`
    flex: 2;
    background: linear-gradient(to right, #6A3093, #8E44AD);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 5px rgba(106, 48, 147, 0.3);
    }
`;