// src/services/whatsappService.js
export const sendWhatsAppMessage = ({ 
  pedidos, 
  totalPrice, 
  nome, 
  telefone, 
  endereco, 
  observacao, 
  frete,
  pagamento,
  imageUrl,
  timestamp
}) => {
  let message = `🍇 NOVO PEDIDO - AÇAÍ DO WAGÃO 🍇\n\n`;
  message += `Cliente: ${nome}\n`;
  message += `Telefone: ${telefone}\n`;
  message += `Endereço: ${endereco}\n`;
  message += `Forma de Pagamento: ${pagamento}\n`;
  if (observacao) message += `📝 Observações: ${observacao}\n\n`;
  
  message += `🛒 ITENS:\n\n`;
  pedidos.forEach((pedido, index) => {
    const isAcai = pedido.tipoProduto === 'Açaí';
    const isBolo = pedido.tipoProduto === 'Bolo';

    // 1. LINHA PRINCIPAL: Define o prefixo e o item
    if (isAcai) {
        // Açaí recebe o prefixo "Açaí"
        message += `Item ${index + 1}: Açaí ${pedido.tamanho} - R$ ${pedido.preco.toFixed(2)}\n`;
    } else if (isBolo) {
        // Bolo recebe o subtítulo (para diferenciar do item simples)
        message += `Item ${index + 1}: ${pedido.tamanho} (Bolo Vulcão) - R$ ${pedido.preco.toFixed(2)}\n\n`;
        return; // Finaliza o loop para Bolo, pois não tem toppings
    } else {
        // Shake, Sobremesa e Combo recebem apenas o título (sem prefixo 'Açaí')
        message += `Item ${index + 1}: ${pedido.tamanho} - R$ ${pedido.preco.toFixed(2)}\n`;
    }
    
    // 2. DETALHES/TOPPINGS (SÓ PARA AÇAÍ E OBSERVAÇÕES DE OUTROS)
    if (isAcai) {
        if (pedido.creme) message += `   ▪️ Creme: ${pedido.creme}\n`;
        if (pedido.frutas.length > 0) message += `   ▪️ Frutas: ${pedido.frutas.join(', ')}\n`;
        if (pedido.complementos.length > 0) message += `   ▪️ Complementos: ${pedido.complementos.join(', ')}\n`;
        if (pedido.adicionais.length > 0) message += `   ▪️ Adicionais: ${pedido.adicionais.join(', ')}\n`;
        if (pedido.caldas) message += `   ▪️ Calda: ${pedido.caldas}\n`;
    }
    
    if (pedido.observacoes) {
      message += `   ▪️ Detalhes: ${pedido.observacoes}\n`;
    }
      // ---------------------------------
  });
  
  message += `Subtotal: R$ ${totalPrice.toFixed(2)}\n`;
  message += `Frete: R$ ${frete.toFixed(2)}\n`;
  message += `TOTAL A PAGAR: R$ ${(totalPrice + frete).toFixed(2)}\n\n`;
  message += `⏱️ Tempo de preparo: 20-30 minutos\n\n`;

  // Adiciona link para download se houver imagem
  if (imageUrl && timestamp) {
    const cleanUrl = window.location.origin + window.location.pathname;
    message += `📎 Comprovante para impressão: ${cleanUrl}?download=${timestamp}\n\n`;
  }

  message += `⚠️ *ATENÇÃO:* Clique em ENVIAR no WhatsApp para finalizar seu pedido!\n\n`;

  // Abre o WhatsApp 991672740
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = `https://wa.me/5561991672740?text=${encodeURIComponent(message)}`;
  } else {
    window.open(`https://wa.me/5561991672740?text=${encodeURIComponent(message)}`, '_blank');
  }
};