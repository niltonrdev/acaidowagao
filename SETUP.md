# Açaí do Wagão — Fase 1

Cardápio online + painel da loja (pedidos, impressão, status via WhatsApp).

## Rodar local

```bash
npm install
npm run dev
```

- Cardápio: http://localhost:5173/
- Painel: http://localhost:5173/loja/login  
  Senha padrão: `wagao123` (ou `VITE_STORE_PASSWORD`)

Sem Supabase, os pedidos ficam só no navegador (**modo teste**). Celular e PC da loja só sincronizam depois de configurar o Supabase.

## Configurar Supabase (grátis)

1. Crie um projeto em https://supabase.com
2. SQL Editor → cole e rode `supabase/schema.sql`
3. Settings → API → copie URL e `anon` key
4. Crie `.env.local` a partir de `.env.example`
5. Reinicie `npm run dev`
6. No Vercel, adicione as mesmas variáveis de ambiente

## Fluxo

1. Cliente pede no site e finaliza (pedido é salvo — sem abrir WhatsApp para “enviar”)
2. Tela de sucesso → **Acompanhar meu pedido** (`PEDIDO 123` no WhatsApp)
3. Se PIX → botão/mensagem com a chave
4. PC da loja em `/loja` → alerta sonoro → **Imprimir** → botões de status abrem WhatsApp do cliente com texto pronto

## WhatsApp (modo grátis)

- **Boas-vindas + link do app:** mensagem de saudação do WhatsApp Business (grátis)
- **No painel:** só **Em preparo** e **Saiu para entrega** abrem o WhatsApp do cliente (`wa.me`) com texto pronto — a loja confirma Enviar
- Recebido / Entregue atualizam só o painel (sem abrir WhatsApp)
