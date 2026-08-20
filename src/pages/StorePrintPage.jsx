import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import html2canvas from 'html2canvas';
import { getOrderById } from '../services/ordersService';
import { isStoreLoggedIn } from '../services/storeAuth';

export default function StorePrintPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const ticketRef = useRef(null);
  const loggedIn = isStoreLoggedIn();

  useEffect(() => {
    if (!loggedIn) return undefined;

    let cancelled = false;
    getOrderById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setError('Pedido não encontrado.');
          return;
        }
        setOrder(data);
      })
      .catch(() => {
        if (!cancelled) setError('Erro ao carregar pedido.');
      });

    return () => {
      cancelled = true;
    };
  }, [id, loggedIn]);

  useEffect(() => {
    if (!order) return undefined;
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, [order]);

  const handleSaveComprovante = async () => {
    if (!ticketRef.current || !order || saving) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `pedido-${order.code}-acai-do-wagao.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Não foi possível salvar o comprovante. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!loggedIn) {
    const next = encodeURIComponent(`/loja/imprimir/${id}`);
    return <Navigate to={`/loja/login?next=${next}`} replace />;
  }

  if (error) return <Wrap>{error}</Wrap>;
  if (!order) return <Wrap>Carregando ticket...</Wrap>;

  return (
    <>
      <PrintStyles />
      <Wrap id="print-root">
        <Toolbar className="no-print">
          <button type="button" onClick={() => window.print()}>
            Imprimir novamente
          </button>
          <SaveButton
            type="button"
            onClick={handleSaveComprovante}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Comprovante'}
          </SaveButton>
          <button type="button" onClick={() => window.close()}>
            Fechar
          </button>
          <Hint>
            Se aparecer &quot;0 folhas&quot;, em Mais configurações escolha tamanho
            de papel A4 ou 80mm e marque &quot;Gráficos de segundo plano&quot;.
          </Hint>
        </Toolbar>

        <Ticket ref={ticketRef}>
          <Header>
            <h1>AÇAÍ DO WAGÃO</h1>
            <p className="pedido">PEDIDO {order.code}</p>
            <p>{new Date(order.created_at).toLocaleString('pt-BR')}</p>
          </Header>

          <Section>
            <p>
              <strong>Cliente:</strong> {order.customer_name}
            </p>
            <p>
              <strong>Telefone:</strong> {order.customer_phone}
            </p>
            <p>
              <strong>Endereço:</strong> {order.address}
            </p>
            {order.region && (
              <p>
                <strong>Região:</strong> {order.region}
              </p>
            )}
            <p>
              <strong>Pagamento:</strong> {order.payment_method}
            </p>
            {order.notes && (
              <p>
                <strong>Obs:</strong> {order.notes}
              </p>
            )}
          </Section>

          <Section>
            <h2>ITENS</h2>
            {(order.items || []).map((item, index) => {
              const tipo = item.tipoProduto || 'Açaí';
              const isAcai = tipo === 'Açaí';
              return (
                <Item key={index}>
                  <p className="item-title">
                    <strong>
                      {index + 1}.{' '}
                      {isAcai ? `Açaí ${item.tamanho}` : item.tamanho}
                      {!isAcai && tipo === 'Bolo' ? ' (Bolo Vulcão)' : ''}
                    </strong>
                  </p>
                  <p className="item-price">
                    R$ {Number(item.preco).toFixed(2)}
                  </p>
                  {isAcai && item.creme && <p>- Creme: {item.creme}</p>}
                  {isAcai && item.frutas?.length > 0 && (
                    <p>- Frutas: {item.frutas.join(', ')}</p>
                  )}
                  {isAcai && item.complementos?.length > 0 && (
                    <p>- Complementos: {item.complementos.join(', ')}</p>
                  )}
                  {isAcai && item.adicionais?.length > 0 && (
                    <p>- Adicionais: {item.adicionais.join(', ')}</p>
                  )}
                  {isAcai && item.caldas && <p>- Calda: {item.caldas}</p>}
                  {item.observacoes && <p>- Detalhes: {item.observacoes}</p>}
                </Item>
              );
            })}
          </Section>

          <Totals>
            <p>Subtotal: R$ {Number(order.subtotal).toFixed(2)}</p>
            <p>Frete: R$ {Number(order.freight).toFixed(2)}</p>
            <p className="grand">
              <strong>TOTAL: R$ {Number(order.total).toFixed(2)}</strong>
            </p>
          </Totals>

          <FooterNote>Obrigado pela preferência!</FooterNote>
        </Ticket>
      </Wrap>
    </>
  );
}

const PrintStyles = createGlobalStyle`
  @media print {
    @page {
      margin: 5mm;
    }

    html, body {
      background: #fff !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: auto !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      overflow: visible !important;
    }

    #root {
      display: block !important;
      width: 100% !important;
    }

    .no-print {
      display: none !important;
    }

    #print-root {
      display: block !important;
      width: 72mm !important;
      max-width: 72mm !important;
      margin: 0 !important;
      padding: 0 !important;
      color: #000 !important;
      background: #fff !important;
    }
  }
`;

const Wrap = styled.div`
  font-family: 'Courier New', Courier, monospace;
  padding: 16px;
  max-width: 320px;
  margin: 0 auto;
  color: #000;
  background: #fff;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;

  button {
    padding: 10px 14px;
    cursor: pointer;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    border-radius: 8px;
    border: 1px solid #ccc;
    background: #f5f5f5;
  }
`;

const SaveButton = styled.button`
  background: #6a3093 !important;
  color: #fff !important;
  border-color: #6a3093 !important;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Hint = styled.p`
  flex-basis: 100%;
  margin: 4px 0 0;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  color: #666;
`;

const Ticket = styled.div`
  background: #fff;
  color: #000;
  padding: 8px;
`;

const Header = styled.div`
  text-align: center;
  border-bottom: 2px dashed #000;
  padding-bottom: 10px;
  margin-bottom: 12px;

  h1 {
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: 0.5px;
  }

  .pedido {
    font-size: 1.35rem;
    font-weight: 700;
    margin: 8px 0 4px;
  }

  p {
    margin: 4px 0;
    font-size: 0.9rem;
  }
`;

const Section = styled.div`
  margin-bottom: 14px;

  h2 {
    margin: 0 0 8px;
    font-size: 1rem;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
  }

  p {
    margin: 4px 0;
    font-size: 0.92rem;
    line-height: 1.35;
    word-break: break-word;
  }
`;

const Item = styled.div`
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dotted #666;

  .item-title {
    margin-bottom: 2px;
  }

  .item-price {
    font-weight: 700;
  }
`;

const Totals = styled.div`
  border-top: 2px dashed #000;
  padding-top: 10px;
  text-align: right;

  p {
    margin: 4px 0;
    font-size: 0.95rem;
  }

  .grand {
    font-size: 1.15rem;
    margin-top: 8px;
  }
`;

const FooterNote = styled.p`
  text-align: center;
  margin-top: 16px;
  font-size: 0.85rem;
`;
