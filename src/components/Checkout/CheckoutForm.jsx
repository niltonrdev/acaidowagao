import React, { useState } from 'react';
import styled from 'styled-components';

export default function CheckoutForm({ 
  pedidos, 
  totalPrice, 
  onConfirm, 
  onBack 
}) {
  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    observacao: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(cliente);
  };

  return (
    <CheckoutOverlay>
      <CheckoutContent>
        <h2>Finalizar Pedido</h2>
        
        <PedidoResumo>
          <h3>Resumo dos Pedidos:</h3>
          {pedidos.map((pedido, index) => (
            <PedidoItem key={index}>
              <p><strong>Açaí {pedido.tamanho}</strong> - R$ {pedido.preco.toFixed(2)}</p>
              {pedido.creme && <p>• Creme: {pedido.creme}</p>}
              {pedido.complementos.length > 0 && <p>• Complementos: {pedido.complementos.join(', ')}</p>}
              {pedido.adicionais.length > 0 && <p>• Adicionais: {pedido.adicionais.join(', ')}</p>}
              {pedido.frutas.length > 0 && <p>• Frutas: {pedido.frutas.join(', ')}</p>}
              {pedido.caldas && <p>• Calda: {pedido.caldas}</p>}
            </PedidoItem>
          ))}
          <Total>Total: R$ {totalPrice.toFixed(2)}</Total>
        </PedidoResumo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome:</Label>
            <Input 
              type="text" 
              name="nome" 
              value={cliente.nome} 
              onChange={handleChange} 
              required 
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Telefone:</Label>
            <Input 
              type="tel" 
              name="telefone" 
              value={cliente.telefone} 
              onChange={handleChange} 
              required 
              placeholder="(XX) XXXXX-XXXX"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Endereço:</Label>
            <Input 
              type="text" 
              name="endereco" 
              value={cliente.endereco} 
              onChange={handleChange} 
              required 
              placeholder="Rua, Número, Bairro"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Observações:</Label>
            <TextArea 
              name="observacao" 
              value={cliente.observacao} 
              onChange={handleChange} 
              placeholder="Ponto de referência, instruções especiais..."
            />
          </FormGroup>
          
          <ButtonGroup>
            <BackButton type="button" onClick={onBack}>Voltar</BackButton>
            <ConfirmButton type="submit">Enviar Pedido</ConfirmButton>
          </ButtonGroup>
        </Form>
      </CheckoutContent>
    </CheckoutOverlay>
  );
}

const CheckoutOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const CheckoutContent = styled.div`
  background-color: #fff;
  padding: 25px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const PedidoResumo = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Total = styled.p`
  font-weight: bold;
  font-size: 1.2rem;
  margin-top: 10px;
  color: #6A3093;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s;

  &:focus {
    border-color: #8E44AD;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  transition: border 0.3s;

  &:focus {
    border-color: #8E44AD;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const BackButton = styled.button`
  background: #f1f1f1;
  color: #333;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e1e1e1;
  }
`;

const ConfirmButton = styled.button`
  background: linear-gradient(to right, #6A3093, #8E44AD);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(106, 48, 147, 0.3);
  }
`;

const PedidoItem = styled.div`
    background: #f8f8f8;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 4px solid #6A3093;
    
    p {
        margin: 5px 0;
        font-size: 0.9rem;
    }
`;