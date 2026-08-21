export const STORE_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '5561991672740';
export const PIX_KEY = import.meta.env.VITE_PIX_KEY || '';
export const PIX_NAME = import.meta.env.VITE_PIX_NAME || 'Açaí do Wagão';
export const APP_URL = import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://acaidowagao.vercel.app');

export const ORDER_STATUSES = [
  { id: 'recebido', label: 'Recebido', color: '#e67e22' },
  { id: 'preparo', label: 'Em preparo', color: '#8E44AD' },
  { id: 'saiu', label: 'Saiu para entrega', color: '#2980b9' },
  { id: 'entregue', label: 'Entregue', color: '#27ae60' },
];

export const STATUS_WHATSAPP_MESSAGES = {
  preparo: (code) =>
    `*Açaí do Wagão*\nSeu *PEDIDO ${code}* está sendo preparado com todo carinho!`,
  saiu: (code) =>
    `*Açaí do Wagão*\nSeu *PEDIDO ${code}* saiu para entrega!`,
};

/** Status que abrem WhatsApp ao clicar no painel */
export const WHATSAPP_NOTIFY_STATUSES = ['preparo', 'saiu'];

