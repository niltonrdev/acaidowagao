import {
  STORE_WHATSAPP,
  STATUS_WHATSAPP_MESSAGES,
  getPixWhatsAppMessage,
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

/** Cliente acompanha o pedido abrindo a conversa com a loja */
export function openTrackOrderWhatsApp(code) {
  openWhatsApp(STORE_WHATSAPP, `PEDIDO ${code}`);
}

/** Cliente recebe a chave PIX (abre conversa com a loja já com o texto) */
export function openPixWhatsApp(code, total) {
  openWhatsApp(STORE_WHATSAPP, getPixWhatsAppMessage(code, total));
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
    `🍇 *Açaí do Wagão*\nPara o *PEDIDO ${code}*, pode nos enviar sua localização neste chat? 📍`
  );
}
