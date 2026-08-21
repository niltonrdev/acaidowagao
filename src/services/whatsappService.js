import {
  STORE_WHATSAPP,
  STATUS_WHATSAPP_MESSAGES,
  PIX_KEY,
  PIX_NAME,
} from '../config';

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function normalizePhone(phone) {
  let digits = onlyDigits(phone);
  if (digits.length === 11) digits = `55${digits}`;
  if (digits.length === 10) digits = `55${digits}`;
  return digits;
}

function openWhatsApp(phone, text) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    window.location.href = url;
  } else {
    window.open(url, '_blank');
  }
}

function formatItemBlock(item, index) {
  const tipo = item.tipoProduto || 'Açaí';
  const isAcai = tipo === 'Açaí';
  const title = isAcai
    ? `Açaí ${item.tamanho}`
    : `${item.tamanho}${tipo === 'Bolo' ? ' (Bolo Vulcão)' : ''}`;

  const lines = [
    `*${index + 1}. ${title}* — R$ ${Number(item.preco).toFixed(2)}`,
  ];

  if (isAcai && item.creme) lines.push(`- Creme: ${item.creme}`);
  if (isAcai && item.frutas?.length)
    lines.push(`- Frutas: ${item.frutas.join(', ')}`);
  if (isAcai && item.complementos?.length)
    lines.push(`- Complementos: ${item.complementos.join(', ')}`);
  if (isAcai && item.adicionais?.length)
    lines.push(`- Adicionais: ${item.adicionais.join(', ')}`);
  if (isAcai && item.caldas) lines.push(`- Calda: ${item.caldas}`);
  if (item.observacoes) lines.push(`- Detalhes: ${item.observacoes}`);

  return lines.join('\n');
}

/** Texto completo do pedido para a loja (backup se o painel falhar) */
export function formatOrderWhatsAppText(order) {
  if (!order) return '';

  const lines = [
    `*Açaí do Wagão* — *PEDIDO ${order.code}*`,
    '',
    `Cliente: ${order.customer_name || '-'}`,
    `Telefone: ${order.customer_phone || '-'}`,
    `Endereço: ${order.address || '-'}`,
  ];

  if (order.region) lines.push(`Região: ${order.region}`);
  lines.push(`Pagamento: ${order.payment_method || '-'}`);
  if (order.notes) lines.push(`Obs: ${order.notes}`);

  lines.push('', '*ITENS*');
  (order.items || []).forEach((item, index) => {
    lines.push(formatItemBlock(item, index), '');
  });

  lines.push(
    `Subtotal: R$ ${Number(order.subtotal || 0).toFixed(2)}`,
    `Frete: R$ ${Number(order.freight || 0).toFixed(2)}`,
    `*TOTAL: R$ ${Number(order.total || 0).toFixed(2)}*`
  );

  return lines.join('\n').trim();
}

function formatPixAppendix(order) {
  const total = Number(order?.total || 0).toFixed(2);
  const keyLine = PIX_KEY
    ? `Chave PIX: *${PIX_KEY}*\nNome: ${PIX_NAME}`
    : 'A chave PIX será enviada em seguida.';

  return (
    `\n\n---\n*Pagamento via PIX*\nValor: *R$ ${total}*\n${keyLine}\n\n` +
    `Após pagar, pode mandar o comprovante aqui.`
  );
}

/** Cliente acompanha o pedido abrindo a conversa com a loja */
export function openTrackOrderWhatsApp(orderOrCode) {
  const text =
    orderOrCode && typeof orderOrCode === 'object'
      ? formatOrderWhatsAppText(orderOrCode) || `PEDIDO ${orderOrCode.code}`
      : `PEDIDO ${orderOrCode}`;
  openWhatsApp(STORE_WHATSAPP, text);
}

/** Cliente recebe a chave PIX (abre conversa com a loja já com o texto) */
export function openPixWhatsApp(orderOrCode, total) {
  if (orderOrCode && typeof orderOrCode === 'object') {
    openWhatsApp(
      STORE_WHATSAPP,
      formatOrderWhatsAppText(orderOrCode) + formatPixAppendix(orderOrCode)
    );
    return;
  }
  const code = orderOrCode;
  const keyLine = PIX_KEY
    ? `Chave PIX: *${PIX_KEY}*\nNome: ${PIX_NAME}\n`
    : 'A chave PIX será enviada em seguida.\n';
  openWhatsApp(
    STORE_WHATSAPP,
    `*Açaí do Wagão* — *PEDIDO ${code}*\n` +
      `Pagamento via PIX\n` +
      `Valor: *R$ ${Number(total).toFixed(2)}*\n\n` +
      keyLine +
      `\nApós pagar, pode mandar o comprovante aqui.`
  );
}

/**
 * Abre WhatsApp do cliente só para status que disparam mensagem
 * (em preparo / saiu para entrega).
 */
export function openStatusToCustomer(customerPhone, code, status) {
  const build = STATUS_WHATSAPP_MESSAGES[status];
  if (!build) return;

  const phone = normalizePhone(customerPhone);
  if (!phone) {
    alert('Telefone do cliente inválido.');
    return;
  }

  openWhatsApp(phone, build(code));
}

/** Pedir localização ao cliente */
export function openLocationRequest(customerPhone, code) {
  const phone = normalizePhone(customerPhone);
  if (!phone) {
    alert('Telefone do cliente inválido.');
    return;
  }
  openWhatsApp(
    phone,
    `*Açaí do Wagão*\nPara o *PEDIDO ${code}*, pode nos enviar sua localização neste chat?`
  );
}
