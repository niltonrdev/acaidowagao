import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

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
  const comprovanteRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  };

  const gerarComprovante = async () => {
    const canvas = await html2canvas(comprovanteRef.current, {
      scale: 2,
      logging: false,
      useCORS: true
    });
    return canvas.toDataURL('image/png');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await gerarComprovante();
    try{
            // Formata a mensagem para o WhatsApp como era antes
        let message = `🍇 NOVO PEDIDO - AÇAÍ DO WAGÃO 🍇\n\n`;
        message += `Cliente: ${cliente.nome}\n`;
        message += `Telefone: ${cliente.telefone}\n`;
        message += `Endereço: ${cliente.endereco}\n`;
        if (cliente.observacao) message += `Observações: ${cliente.observacao}\n\n`;
        
        message += `ITENS:\n\n`;
        pedidos.forEach((pedido, index) => {
          message += `Item ${index + 1}: Açaí ${pedido.tamanho} - R$ ${pedido.preco.toFixed(2)}\n`;
          if (pedido.creme) message += `* Creme: ${pedido.creme}\n`;
          if (pedido.frutas.length > 0) message += `* Frutas: ${pedido.frutas.join(', ')}\n`;
          if (pedido.complementos.length > 0) message += `* Complementos: ${pedido.complementos.join(', ')}\n`;
          if (pedido.adicionais.length > 0) message += `* Adicionais: ${pedido.adicionais.join(', ')}\n`;
          if (pedido.caldas) message += `* Calda: ${pedido.caldas}\n`;
          message += `\n`;
        });
        
        message += `TOTAL: R$ ${totalPrice.toFixed(2)}\n`;
        message += `🕒 Tempo de preparo: 20-30 minutos\n\n`;
        
        // Adiciona o link para download do comprovante
        const timestamp = new Date().getTime();
        localStorage.setItem(`comprovante-${timestamp}`, imageUrl);
        message += `📎 Comprovante para impressão: ${window.location.href}?download=${timestamp}`;
        message += `\n\n⚠️ *ATENÇÃO:* Clique em ENVIAR no WhatsApp para finalizar seu pedido!\n\n`;

        // Abertura otimizada para mobile
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          // Método para mobile
          window.location.href = `https://wa.me/5561990449507?text=${encodeURIComponent(message)}`;
        } else {
          // Método para desktop
          window.open(`https://wa.me/5561990449507?text=${encodeURIComponent(message)}`, '_blank');
        }
        // Finaliza o processo
        setTimeout(() => {
          onConfirm(cliente);
        }, 1500);
    }catch (error) {
      console.error("Erro:", error);
      alert("Ocorreu um erro. Por favor, tente novamente.");
    }

  };

  return (
    <CheckoutOverlay>
      <CheckoutContent>
        <h2>Finalizar Pedido</h2>

        {/* Lista de pedidos visível */}
        <PedidoResumo>
          <h3>Seus Pedidos:</h3>
          {pedidos.map((pedido, index) => (
            <PedidoItem key={index}>
              <p><strong>Açaí {pedido.tamanho}</strong> - R$ {pedido.preco.toFixed(2)}</p>
              {pedido.creme && <p>Creme: {pedido.creme}</p>}
              {pedido.frutas.length > 0 && <p>Frutas: {pedido.frutas.join(', ')}</p>}
              {pedido.complementos.length > 0 && <p>Complementos: {pedido.complementos.join(', ')}</p>}
              {pedido.adicionais.length > 0 && <p>Adicionais: {pedido.adicionais.join(', ')}</p>}
              {pedido.caldas && <p>Calda: {pedido.caldas}</p>}
            </PedidoItem>
          ))}
          <Total>Total: R$ {totalPrice.toFixed(2)}</Total>
        </PedidoResumo>

        {/* Formulário de dados do cliente */}
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
            <BackButton type="button" onClick={onBack}>
              Voltar
            </BackButton>
            <ConfirmButton type="submit">
              Enviar Pedido
            </ConfirmButton>
          </ButtonGroup>
        </Form>

        {/* Comprovante oculto (só para gerar a imagem) */}
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <Comprovante ref={comprovanteRef}>
            <Header>
              <h3>AÇAÍ DO WAGÃO</h3>
              <p>Pedido: #{Math.floor(Math.random() * 1000)}</p>
            </Header>

            <ClienteInfo>
              <p><strong>Cliente:</strong> {cliente.nome}</p>
              <p><strong>Telefone:</strong> {cliente.telefone}</p>
              <p><strong>Endereço:</strong> {cliente.endereco}</p>
              {cliente.observacao && <p><strong>Observações:</strong> {cliente.observacao}</p>}
            </ClienteInfo>

            <Itens>
              <h4>ITENS:</h4>
              {pedidos.map((pedido, index) => (
                <Item key={index}>
                  <p><strong>{index + 1}. Açaí {pedido.tamanho}</strong></p>
                  {pedido.creme && <p>- Creme: {pedido.creme}</p>}
                  {pedido.complementos.length > 0 && <p>- Complementos: {pedido.complementos.join(', ')}</p>}
                  {pedido.adicionais.length > 0 && <p>- Adicionais: {pedido.adicionais.join(', ')}</p>}
                  {pedido.frutas.length > 0 && <p>- Frutas: {pedido.frutas.join(', ')}</p>}
                  {pedido.caldas && <p>- Calda: {pedido.caldas}</p>}
                  <p><strong>Valor:</strong> R$ {pedido.preco.toFixed(2)}</p>
                </Item>
              ))}
            </Itens>

            <Total>
              <p><strong>TOTAL: R$ {totalPrice.toFixed(2)}</strong></p>
            </Total>

            <Footer>
              <p>{new Date().toLocaleString('pt-BR')}</p>
              <p>Obrigado pela preferência!</p>
            </Footer>
          </Comprovante>
        </div>
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

// const Total = styled.p`
//   font-weight: bold;
//   font-size: 1.2rem;
//   margin-top: 10px;
//   color: #6A3093;
// `;

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

const Comprovante = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  font-family: 'Courier New', monospace;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 15px;
  border-bottom: 2px dashed #ccc;
  padding-bottom: 10px;

  h3 {
    color: #6A3093;
    margin: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
  }
`;

const ClienteInfo = styled.div`
  margin-bottom: 15px;
  p {
    margin: 5px 0;
  }
`;

const Itens = styled.div`
  margin-bottom: 15px;

  h4 {
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
`;

const Item = styled.div`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px dotted #eee;

  p {
    margin: 3px 0;
  }
`;

const Total = styled.div`
  text-align: right;
  font-size: 1.2rem;
  margin: 15px 0;
  padding-top: 10px;
  border-top: 2px dashed #ccc;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #666;
  margin-top: 15px;
`;