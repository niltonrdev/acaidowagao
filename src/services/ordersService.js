import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const LOCAL_KEY = 'acai-orders';

function readLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeLocalOrders(orders) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('acai-orders-updated'));
}

function generateCode(existingCodes = []) {
  let code;
  do {
    code = String(Math.floor(100 + Math.random() * 900));
  } while (existingCodes.includes(code));
  return code;
}

export async function createOrder(payload) {
  const base = {
    customer_name: payload.nome,
    customer_phone: payload.telefone,
    address: payload.endereco,
    region: payload.regiao || '',
    freight: Number(payload.frete) || 0,
    payment_method: payload.pagamento,
    notes: payload.observacao || '',
    items: payload.pedidos,
    subtotal: Number(payload.totalPrice) || 0,
    total: Number(payload.totalPrice) + (Number(payload.frete) || 0),
    status: 'recebido',
  };

  if (!isSupabaseConfigured) {
    const local = readLocalOrders();
    const code = generateCode(local.map((o) => o.code));
    const order = {
      id: crypto.randomUUID(),
      code,
      ...base,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    writeLocalOrders([order, ...local]);
    return order;
  }

  const { data: recent } = await supabase
    .from('orders')
    .select('code')
    .order('created_at', { ascending: false })
    .limit(50);

  const code = generateCode((recent || []).map((o) => o.code));

  const { data, error } = await supabase
    .from('orders')
    .insert({ ...base, code })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listOrders() {
  if (!isSupabaseConfigured) {
    return readLocalOrders().sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function getOrderById(id) {
  if (!isSupabaseConfigured) {
    return readLocalOrders().find((o) => o.id === id) || null;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id, status) {
  if (!isSupabaseConfigured) {
    const local = readLocalOrders();
    const next = local.map((o) =>
      o.id === id
        ? { ...o, status, updated_at: new Date().toISOString() }
        : o
    );
    writeLocalOrders(next);
    return next.find((o) => o.id === id);
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function subscribeToOrders(onChange) {
  if (!isSupabaseConfigured) {
    const handler = async () => {
      onChange(await listOrders());
    };
    window.addEventListener('acai-orders-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('acai-orders-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }

  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      async () => {
        onChange(await listOrders());
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
