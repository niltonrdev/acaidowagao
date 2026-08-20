import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import { getOrderById } from '../services/ordersService';
import { isStoreLoggedIn } from '../services/storeAuth';

function buildTicketHtml(order) {
  const itemsHtml = (order.items || [])
    .map((item, index) => {
      const tipo = item.tipoProduto || 'Açaí';
      const isAcai = tipo === 'Açaí';
      const title = isAcai
        ? `Açaí ${item.tamanho}`
        : `${item.tamanho}${tipo === 'Bolo' ? ' (Bolo Vulcão)' : ''}`;

      const lines = [];
      if (isAcai && item.creme) lines.push(`- Creme: ${item.creme}`);
      if (isAcai && item.frutas?.length)
        lines.push(`- Frutas: ${item.frutas.join(', ')}`);
      if (isAcai && item.complementos?.length)
        lines.push(`- Complementos: ${item.complementos.join(', ')}`);
      if (isAcai && item.adicionais?.length)
        lines.push(`- Adicionais: ${item.adicionais.join(', ')}`);
      if (isAcai && item.caldas) lines.push(`- Calda: ${item.caldas}`);
      if (item.observacoes) lines.push(`- Detalhes: ${item.observacoes}`);

      return `
        <div class="item">
          <p><strong>${index + 1}. ${escapeHtml(title)}</strong></p>
          <p>R$ ${Number(item.preco).toFixed(2)}</p>
          ${lines.map((l) => `<p>${escapeHtml(l)}</p>`).join('')}
        </div>`;
    })
    .join('');

  const when = new Date(order.created_at).toLocaleString('pt-BR');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>PEDIDO ${escapeHtml(order.code)}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #000;
      font-family: "Courier New", Courier, monospace;
    }
    .ticket {
      width: 280px;
      max-width: 100%;
      padding: 8px;
      margin: 0 auto;
    }
    h1 { margin: 0; font-size: 16px; text-align: center; }
    .pedido { margin: 8px 0 4px; font-size: 20px; font-weight: 700; text-align: center; }
    .meta { margin: 4px 0; font-size: 13px; text-align: center; }
    .section { margin: 12px 0; }
    .section h2 {
      margin: 0 0 6px;
      font-size: 14px;
      border-bottom: 1px solid #000;
      padding-bottom: 4px;
    }
    .section p { margin: 3px 0; font-size: 13px; line-height: 1.3; word-break: break-word; }
    .divider { border: none; border-top: 2px dashed #000; margin: 10px 0; }
    .item { margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dotted #666; }
    .totals { text-align: right; }
    .totals p { margin: 3px 0; font-size: 13px; }
    .grand { font-size: 16px; margin-top: 6px; }
    .footer { text-align: center; margin-top: 14px; font-size: 12px; }
    @media print {
      @page { margin: 4mm; size: auto; }
      html, body { width: auto; }
      .ticket { width: 72mm; margin: 0; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="ticket">
    <h1>AÇAÍ DO WAGÃO</h1>
    <p class="pedido">PEDIDO ${escapeHtml(String(order.code))}</p>
    <p class="meta">${escapeHtml(when)}</p>
    <hr class="divider" />
    <div class="section">
      <p><strong>Cliente:</strong> ${escapeHtml(order.customer_name)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(order.customer_phone)}</p>
      <p><strong>Endereço:</strong> ${escapeHtml(order.address)}</p>
      ${
        order.region
          ? `<p><strong>Região:</strong> ${escapeHtml(order.region)}</p>`
          : ''
      }
      <p><strong>Pagamento:</strong> ${escapeHtml(order.payment_method)}</p>
      ${
        order.notes
          ? `<p><strong>Obs:</strong> ${escapeHtml(order.notes)}</p>`
          : ''
      }
    </div>
    <div class="section">
      <h2>ITENS</h2>
      ${itemsHtml}
    </div>
    <hr class="divider" />
    <div class="totals">
      <p>Subtotal: R$ ${Number(order.subtotal).toFixed(2)}</p>
      <p>Frete: R$ ${Number(order.freight).toFixed(2)}</p>
      <p class="grand"><strong>TOTAL: R$ ${Number(order.total).toFixed(2)}</strong></p>
    </div>
    <p class="footer">Obrigado pela preferência!</p>
  </div>
  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 300);
    };
  </script>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function openPrintWindow(order) {
  const html = buildTicketHtml(order);
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=420,height=720');
  if (!printWindow) {
    alert('Permita pop-ups para imprimir o pedido.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

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

  const handleSaveComprovante = async () => {
    if (!ticketRef.current || !order || saving) return;
    setSaving(true);
    try {
      // ~576px ≈ 72mm em impressora térmica 203dpi (bom para bobina 80mm)
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        width: 288,
        windowWidth: 288,
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

  if (error) return <Page>{error}</Page>;
  if (!order) return <Page>Carregando ticket...</Page>;

  return (
    <Page>
      <Toolbar>
        <button type="button" onClick={() => openPrintWindow(order)}>
          Imprimir
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
      </Toolbar>

      <Tip>
        <strong>Impressora térmica (Perto):</strong> use <em>Imprimir</em> (abre
        janela limpa). Se preferir o PNG: ao imprimir a imagem, escolha{' '}
        <em>Tamanho real / Ajustar à largura</em> — evite &quot;Preencher a
        página&quot;.
      </Tip>

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
    </Page>
  );
}

const Page = styled.div`
  font-family: 'Courier New', Courier, monospace;
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
  color: #000;
  background: #fff;
  min-height: 100vh;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

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

const Tip = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.82rem;
  color: #555;
  line-height: 1.4;
  margin: 0 0 16px;
  background: #f8f5fb;
  padding: 10px 12px;
  border-radius: 8px;
`;

const Ticket = styled.div`
  background: #fff;
  color: #000;
  width: 288px;
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
