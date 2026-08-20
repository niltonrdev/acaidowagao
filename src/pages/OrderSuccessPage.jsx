import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import acailogo from '../assets/acailogo.jpg';
import { PIX_KEY, PIX_NAME } from '../config';
import {
  openPixWhatsApp,
  openTrackOrderWhatsApp,
} from '../services/whatsappService';

export default function OrderSuccessPage() {
  const { code } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const isPix = (order?.payment_method || '').toUpperCase() === 'PIX';

  return (
    <Page>
      <Card>
        <LogoWrap>
          <Logo src={acailogo} alt="Açaí do Wagão" />
        </LogoWrap>
        <Badge>Pedido recebido</Badge>
        <Title>PEDIDO {code}</Title>
        <Text>
          Seu pedido já apareceu na loja. Agora é só acompanhar pelo WhatsApp.
        </Text>

        {order && (
          <Summary>
            <p>
              <strong>{order.customer_name}</strong> · {order.customer_phone}
            </p>
            <p>Total: R$ {Number(order.total).toFixed(2)}</p>
            <p>Pagamento: {order.payment_method}</p>
            {isPix && (
              <PixBox>
                {PIX_KEY ? (
                  <>
                    <p>Chave PIX ({PIX_NAME}):</p>
                    <PixKey>{PIX_KEY}</PixKey>
                  </>
                ) : (
                  <p>No WhatsApp você recebe a chave PIX da loja.</p>
                )}
              </PixBox>
            )}
          </Summary>
        )}

        <Actions>
          <PrimaryButton type="button" onClick={() => openTrackOrderWhatsApp(code)}>
            Acompanhar meu pedido
          </PrimaryButton>
          {isPix && (
            <SecondaryButton
              type="button"
              onClick={() => openPixWhatsApp(code, order?.total || 0)}
            >
              Receber chave PIX no WhatsApp
            </SecondaryButton>
          )}
          <GhostLink to="/">Fazer novo pedido</GhostLink>
        </Actions>
      </Card>
    </Page>
  );
}

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(160deg, #2d1b4e 0%, #6a3093 45%, #f5f5f5 45%);
  font-family: 'Poppins', sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  text-align: center;

  @media screen and (max-width: 480px) {
    padding: 22px 16px;
  }
`;

const LogoWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(45, 27, 78, 0.18);

  @media screen and (max-width: 480px) {
    width: 96px;
    height: 96px;
  }
`;

const Badge = styled.span`
  display: inline-block;
  background: #eafaf1;
  color: #1e8449;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
`;

const Title = styled.h1`
  margin: 16px 0 8px;
  font-size: 1.8rem;
  color: #6a3093;

  @media screen and (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Text = styled.p`
  margin: 0 0 20px;
  color: #555;
  line-height: 1.5;
`;

const Summary = styled.div`
  background: #f8f5fb;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  text-align: left;

  p {
    margin: 6px 0;
    font-size: 0.95rem;
    word-break: break-word;
  }
`;

const PixBox = styled.div`
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #d5c6e8;
`;

const PixKey = styled.code`
  display: block;
  margin-top: 6px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  word-break: break-all;
  font-size: 0.95rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  border: none;
  background: linear-gradient(to right, #6a3093, #8e44ad);
  color: #fff;
  font-weight: 600;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
`;

const SecondaryButton = styled.button`
  border: 1px solid #8e44ad;
  background: #fff;
  color: #6a3093;
  font-weight: 600;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
`;

const GhostLink = styled(Link)`
  text-align: center;
  color: #666;
  text-decoration: none;
  padding: 8px;
  font-size: 0.95rem;

  &:hover {
    color: #6a3093;
  }
`;
