import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import acailogo from '../assets/acailogo.jpg';
import { ORDER_STATUSES, WHATSAPP_NOTIFY_STATUSES } from '../config';
import { isSupabaseConfigured as supabaseOk } from '../lib/supabaseClient';
import { isStoreLoggedIn, logoutStore } from '../services/storeAuth';
import {
  listOrders,
  subscribeToOrders,
  updateOrderStatus,
} from '../services/ordersService';
import {
  openLocationRequest,
  openStatusToCustomer,
} from '../services/whatsappService';

function playAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 350);
  } catch {
    // ignore
  }
}

function statusMeta(status) {
  return ORDER_STATUSES.find((s) => s.id === status) || {
    id: status,
    label: status,
    color: '#999',
  };
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function OrderItems({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <DetailsList>
      {items.map((item, idx) => {
        const tipo = item.tipoProduto || 'Açaí';
        const isAcai = tipo === 'Açaí';
        return (
          <DetailCard key={idx}>
            <DetailTitle>
              {idx + 1}. {isAcai ? `Açaí ${item.tamanho}` : item.tamanho}
              {tipo !== 'Açaí' && (
                <span> · {tipo === 'Bolo' ? 'Bolo Vulcão' : tipo}</span>
              )}
              {item.preco != null && (
                <span> · R$ {Number(item.preco).toFixed(2)}</span>
              )}
            </DetailTitle>
            {isAcai && item.creme && (
              <DetailLine>
                <strong>Creme:</strong> {item.creme}
              </DetailLine>
            )}
            {isAcai && item.frutas?.length > 0 && (
              <DetailLine>
                <strong>Frutas:</strong> {item.frutas.join(', ')}
              </DetailLine>
            )}
            {isAcai && item.complementos?.length > 0 && (
              <DetailLine>
                <strong>Complementos:</strong> {item.complementos.join(', ')}
              </DetailLine>
            )}
            {isAcai && item.adicionais?.length > 0 && (
              <DetailLine>
                <strong>Adicionais:</strong> {item.adicionais.join(', ')}
              </DetailLine>
            )}
            {isAcai && item.caldas && (
              <DetailLine>
                <strong>Calda:</strong> {item.caldas}
              </DetailLine>
            )}
            {item.observacoes && (
              <DetailLine>
                <strong>Detalhes:</strong> {item.observacoes}
              </DetailLine>
            )}
          </DetailCard>
        );
      })}
    </DetailsList>
  );
}

function QueueItem({ order, selected, onSelect }) {
  const meta = statusMeta(order.status);
  return (
    <QueueRow
      type="button"
      $color={meta.color}
      $selected={selected}
      $done={order.status === 'entregue'}
      onClick={() => onSelect(order.id)}
    >
      <QueueTop>
        <QueueCode>#{order.code}</QueueCode>
        <QueueTime>{formatTime(order.created_at)}</QueueTime>
      </QueueTop>
      <QueueName>{order.customer_name}</QueueName>
      <QueueBottom>
        <QueuePill $color={meta.color}>{meta.label}</QueuePill>
        <QueueTotal>R$ {Number(order.total).toFixed(2)}</QueueTotal>
      </QueueBottom>
    </QueueRow>
  );
}

function OrderDetail({ order, onStatus, onBack, showBack }) {
  if (!order) {
    return (
      <EmptyDetail>
        <p>Selecione um pedido na fila ao lado.</p>
      </EmptyDetail>
    );
  }

  const meta = statusMeta(order.status);

  return (
    <DetailPane>
      {showBack && (
        <BackButton type="button" onClick={onBack}>
          ← Voltar para pedidos
        </BackButton>
      )}

      <DetailHeader>
        <div>
          <DetailCode>PEDIDO {order.code}</DetailCode>
          <DetailSub>
            {formatTime(order.created_at)}
            {order.created_at
              ? ` · ${new Date(order.created_at).toLocaleDateString('pt-BR')}`
              : ''}
          </DetailSub>
        </div>
        <StatusPill $color={meta.color}>{meta.label}</StatusPill>
      </DetailHeader>

      <MetaBlock>
        <Meta>
          <strong>{order.customer_name}</strong> · {order.customer_phone}
        </Meta>
        <Meta>{order.address}</Meta>
        {order.region && <Meta>Região: {order.region}</Meta>}
        <Meta>
          {order.payment_method} · Total R$ {Number(order.total).toFixed(2)}
        </Meta>
      </MetaBlock>

      <OrderItems items={order.items} />
      {order.notes && <Notes>Obs: {order.notes}</Notes>}

      <Actions>
        <PrintLink to={`/loja/imprimir/${order.id}`} target="_blank">
          Imprimir
        </PrintLink>
        <ActionButton
          type="button"
          onClick={() =>
            openLocationRequest(order.customer_phone, order.code)
          }
        >
          Pedir localização
        </ActionButton>
      </Actions>

      <StatusLabel>Atualizar status</StatusLabel>
      <StatusRow>
        {ORDER_STATUSES.map((s) => (
          <StatusButton
            key={s.id}
            type="button"
            $active={order.status === s.id}
            $color={s.color}
            onClick={() => onStatus(order, s.id)}
            title={
              WHATSAPP_NOTIFY_STATUSES.includes(s.id)
                ? 'Atualiza o painel e abre WhatsApp do cliente'
                : 'Atualiza só o painel'
            }
          >
            {s.label}
            {WHATSAPP_NOTIFY_STATUSES.includes(s.id) ? ' · WPP' : ''}
          </StatusButton>
        ))}
      </StatusRow>
    </DetailPane>
  );
}

export default function StorePanelPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [showDelivered, setShowDelivered] = useState(false);
  const knownIds = useRef(new Set());
  const loggedIn = isStoreLoggedIn();

  useEffect(() => {
    if (!loggedIn) return undefined;

    let mounted = true;

    const load = async () => {
      try {
        const data = await listOrders();
        if (!mounted) return;
        if (knownIds.current.size === 0) {
          data.forEach((o) => knownIds.current.add(o.id));
        } else {
          const fresh = data.filter((o) => !knownIds.current.has(o.id));
          if (fresh.length > 0) {
            playAlert();
            fresh.forEach((o) => knownIds.current.add(o.id));
            setSelectedId(fresh[0].id);
            setMobileDetail(false);
          }
        }
        setOrders(data);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os pedidos.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    const unsubscribe = subscribeToOrders((data) => {
      const fresh = data.filter((o) => !knownIds.current.has(o.id));
      if (fresh.length > 0) {
        playAlert();
        fresh.forEach((o) => knownIds.current.add(o.id));
        setSelectedId(fresh[0].id);
      }
      setOrders(data);
    });

    const poll = setInterval(load, 8000);
    return () => {
      mounted = false;
      unsubscribe();
      clearInterval(poll);
    };
  }, [loggedIn]);

  const active = useMemo(
    () => orders.filter((o) => o.status !== 'entregue'),
    [orders]
  );
  const done = useMemo(
    () => orders.filter((o) => o.status === 'entregue').slice(0, 15),
    [orders]
  );

  useEffect(() => {
    if (!selectedId && active.length > 0) {
      setSelectedId(active[0].id);
    }
  }, [active, selectedId]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedId) || null,
    [orders, selectedId]
  );

  if (!loggedIn) {
    return <Navigate to="/loja/login" replace />;
  }

  const handleStatus = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status } : o))
      );
      // Modo grátis: só Em preparo e Saiu para entrega abrem o WhatsApp
      if (WHATSAPP_NOTIFY_STATUSES.includes(status)) {
        openStatusToCustomer(order.customer_phone, order.code, status);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status.');
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setMobileDetail(true);
  };

  const handleBack = () => setMobileDetail(false);

  const handleLogout = () => {
    logoutStore();
    navigate('/loja/login');
  };

  return (
    <Page>
      <TopBar>
        <BrandBlock>
          <Logo src={acailogo} alt="Açaí do Wagão" />
          <div>
            <Brand>Açaí do Wagão</Brand>
            <Sub>Painel de pedidos</Sub>
          </div>
        </BrandBlock>
        <TopActions>
          <ModeTag>
            {supabaseOk ? 'Online (Supabase)' : 'Modo local (teste)'}
          </ModeTag>
          <Logout type="button" onClick={handleLogout}>
            Sair
          </Logout>
        </TopActions>
      </TopBar>

      {!supabaseOk && (
        <Banner>
          Sem Supabase configurado: pedidos ficam só neste navegador. Veja
          SETUP.md.
        </Banner>
      )}

      {loading && <Empty>Carregando pedidos...</Empty>}
      {error && <Empty>{error}</Empty>}

      {!loading && !error && (
        <Workspace $showDetail={mobileDetail}>
          <QueuePane>
            <QueueHeader>
              <span>Fila ativa</span>
              <QueueCount>{active.length}</QueueCount>
            </QueueHeader>

            {active.length === 0 ? (
              <QueueEmpty>Nenhum pedido em andamento.</QueueEmpty>
            ) : (
              <QueueList>
                {active.map((order) => (
                  <QueueItem
                    key={order.id}
                    order={order}
                    selected={order.id === selectedId}
                    onSelect={handleSelect}
                  />
                ))}
              </QueueList>
            )}

            <DeliveredToggle
              type="button"
              onClick={() => setShowDelivered((v) => !v)}
            >
              {showDelivered ? '▾' : '▸'} Entregues ({done.length})
            </DeliveredToggle>

            {showDelivered && (
              <QueueList $muted>
                {done.length === 0 ? (
                  <QueueEmpty>Nenhum entregue ainda.</QueueEmpty>
                ) : (
                  done.map((order) => (
                    <QueueItem
                      key={order.id}
                      order={order}
                      selected={order.id === selectedId}
                      onSelect={handleSelect}
                    />
                  ))
                )}
              </QueueList>
            )}
          </QueuePane>

          <DetailColumn>
            <OrderDetail
              order={selectedOrder}
              onStatus={handleStatus}
              onBack={handleBack}
              showBack={mobileDetail}
            />
          </DetailColumn>
        </Workspace>
      )}
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  background: #f3eef8;
  font-family: 'Poppins', sans-serif;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 12px;
  }
`;

const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
  }
`;

const Brand = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  color: #6a3093;
`;

const Sub = styled.p`
  margin: 2px 0 0;
  color: #666;
  font-size: 0.85rem;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModeTag = styled.span`
  background: #fff;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.75rem;
  color: #555;

  @media (max-width: 600px) {
    display: none;
  }
`;

const Logout = styled.button`
  border: none;
  background: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

const Banner = styled.div`
  background: #fff3cd;
  color: #7d6608;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 14px;
  font-size: 0.9rem;
`;

const Empty = styled.p`
  text-align: center;
  color: #666;
  padding: 40px 10px;
`;

const Workspace = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  gap: 14px;
  align-items: start;
  min-height: calc(100vh - 120px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;

    /* mobile: lista OU detalhe */
    > *:first-child {
      display: ${(p) => (p.$showDetail ? 'none' : 'flex')};
    }
    > *:last-child {
      display: ${(p) => (p.$showDetail ? 'block' : 'none')};
    }
  }
`;

const QueuePane = styled.aside`
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  padding: 12px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 120px);
  overflow: hidden;
`;

const QueueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #2d1b4e;
  padding: 4px 4px 10px;
  font-size: 0.95rem;
`;

const QueueCount = styled.span`
  background: #6a3093;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  opacity: ${(p) => (p.$muted ? 0.85 : 1)};
  padding-bottom: 8px;
`;

const QueueEmpty = styled.p`
  margin: 8px 4px 16px;
  color: #888;
  font-size: 0.9rem;
`;

const QueueRow = styled.button`
  width: 100%;
  text-align: left;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.$selected ? '#f3eef8' : '#fafafa')};
  border-radius: 10px;
  padding: 10px 12px;
  border-left: 5px solid ${(p) => p.$color};
  box-shadow: ${(p) =>
    p.$selected ? '0 0 0 2px rgba(106, 48, 147, 0.25)' : 'none'};
  opacity: ${(p) => (p.$done ? 0.7 : 1)};
  font-family: inherit;
  transition: background 0.15s ease;

  &:hover {
    background: #f3eef8;
  }
`;

const QueueTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const QueueCode = styled.span`
  font-weight: 700;
  color: #2d1b4e;
  font-size: 0.95rem;
`;

const QueueTime = styled.span`
  font-size: 0.75rem;
  color: #888;
`;

const QueueName = styled.p`
  margin: 4px 0 8px;
  font-size: 0.85rem;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const QueueBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const QueuePill = styled.span`
  background: ${(p) => p.$color};
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
`;

const QueueTotal = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d1b4e;
`;

const DeliveredToggle = styled.button`
  margin-top: 10px;
  border: none;
  background: #f0ebf5;
  color: #555;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  font-family: inherit;
`;

const DetailColumn = styled.section`
  min-width: 0;
`;

const DetailPane = styled.article`
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  min-height: 320px;

  @media (min-width: 901px) {
    padding: 32px 36px;
    min-height: calc(100vh - 120px);
  }
`;

const EmptyDetail = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 48px 20px;
  text-align: center;
  color: #888;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);

  @media (min-width: 901px) {
    min-height: calc(100vh - 120px);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
  }
`;

const BackButton = styled.button`
  border: none;
  background: #f3eef8;
  color: #6a3093;
  font-weight: 600;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 14px;
  font-family: inherit;
  font-size: 0.9rem;

  @media (min-width: 901px) {
    display: none;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;

  @media (min-width: 901px) {
    margin-bottom: 22px;
  }
`;

const DetailCode = styled.h2`
  margin: 0;
  font-size: 1.45rem;
  color: #2d1b4e;

  @media (min-width: 901px) {
    font-size: 2.1rem;
  }
`;

const DetailSub = styled.p`
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #888;

  @media (min-width: 901px) {
    font-size: 1.05rem;
    margin-top: 6px;
  }
`;

const StatusPill = styled.span`
  background: ${(p) => p.$color};
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 999px;
  white-space: nowrap;

  @media (min-width: 901px) {
    font-size: 0.95rem;
    padding: 8px 16px;
  }
`;

const MetaBlock = styled.div`
  margin-bottom: 8px;

  @media (min-width: 901px) {
    margin-bottom: 16px;
  }
`;

const Meta = styled.p`
  margin: 4px 0;
  font-size: 0.95rem;
  color: #444;
  word-break: break-word;

  @media (min-width: 901px) {
    margin: 8px 0;
    font-size: 1.15rem;
    line-height: 1.45;
  }
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;

  @media (min-width: 901px) {
    gap: 12px;
    margin: 20px 0;
  }
`;

const DetailCard = styled.div`
  background: #f8f5fb;
  border-radius: 10px;
  padding: 10px 12px;

  @media (min-width: 901px) {
    padding: 16px 18px;
    border-radius: 12px;
  }
`;

const DetailTitle = styled.p`
  margin: 0 0 6px;
  font-weight: 600;
  color: #2d1b4e;
  font-size: 0.95rem;

  span {
    font-weight: 500;
    color: #666;
  }

  @media (min-width: 901px) {
    font-size: 1.15rem;
    margin-bottom: 8px;
  }
`;

const DetailLine = styled.p`
  margin: 3px 0;
  font-size: 0.88rem;
  color: #444;

  @media (min-width: 901px) {
    font-size: 1.05rem;
    margin: 5px 0;
  }
`;

const Notes = styled.p`
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #666;
  font-style: italic;

  @media (min-width: 901px) {
    font-size: 1.1rem;
    margin-bottom: 20px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: 901px) {
    gap: 12px;
    margin-bottom: 28px;
  }
`;

const PrintLink = styled(Link)`
  background: #2d1b4e;
  color: #fff;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;

  @media (min-width: 901px) {
    padding: 16px 28px;
    font-size: 1.1rem;
    border-radius: 10px;
  }
`;

const ActionButton = styled.button`
  border: 1px solid #8e44ad;
  background: #fff;
  color: #6a3093;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;

  @media (min-width: 901px) {
    padding: 16px 24px;
    font-size: 1.1rem;
    border-width: 2px;
    border-radius: 10px;
  }
`;

const StatusLabel = styled.p`
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;

  @media (min-width: 901px) {
    font-size: 1.05rem;
    margin-bottom: 12px;
  }
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (min-width: 901px) {
    gap: 12px;
  }
`;

const StatusButton = styled.button`
  border: 2px solid ${(p) => p.$color};
  background: ${(p) => (p.$active ? p.$color : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : p.$color)};
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  font-family: inherit;

  @media (min-width: 901px) {
    padding: 14px 20px;
    font-size: 1.05rem;
    border-radius: 10px;
    min-width: 140px;
  }
`;
