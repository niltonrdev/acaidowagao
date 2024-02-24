import React from 'react';

export default function Footer({ totalPrice, fecharPedido }) {
  return (
    <footer>
      <div>
        <p>Total do Pedido: R$ {totalPrice.toFixed(2)}</p>
      </div>
      <div>
        <button onClick={fecharPedido}>Fechar Pedido</button>
      </div>
    </footer>
  );
}