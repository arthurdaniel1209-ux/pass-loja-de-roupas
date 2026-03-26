import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mercado Pago initialization (lazy)
  let mpClient: MercadoPagoConfig | null = null;
  const getMPClient = () => {
    if (!mpClient) {
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error('MERCADO_PAGO_ACCESS_TOKEN environment variable is required');
      }
      mpClient = new MercadoPagoConfig({ accessToken });
    }
    return mpClient;
  };

  app.use(express.json());

  // API Routes
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { items, successUrl, cancelUrl } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio ou inválido' });
      }

      const client = getMPClient();
      const preference = new Preference(client);

      // Validate and format items
      const formattedItems = items.map((item: any) => {
        const price = Number(item.price);
        const quantity = Math.floor(Number(item.quantity));

        if (isNaN(price) || price <= 0) {
          throw new Error(`Preço inválido para o item: ${item.name}`);
        }
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Quantidade inválida para o item: ${item.name}`);
        }

        return {
          id: String(item.id || Math.random().toString(36).substr(2, 9)),
          title: String(`${item.name} (${item.size} | ${item.color})`).substring(0, 256),
          unit_price: price,
          quantity: quantity,
          currency_id: 'BRL',
          picture_url: item.imageUrl,
          description: String(item.description || '').substring(0, 256),
        };
      });

      const body = {
        items: formattedItems,
        back_urls: {
          success: successUrl,
          failure: cancelUrl,
          pending: successUrl,
        },
        auto_return: 'approved' as const,
        statement_descriptor: 'LOJA DE ROUPAS',
        expires: false,
      };

      console.log('Criando preferência no Mercado Pago com corpo:', JSON.stringify(body, null, 2));
      
      const result = await preference.create({ body });

      // Mercado Pago returns init_point (production) or sandbox_init_point
      const url = process.env.NODE_ENV === 'production' ? result.init_point : (result.sandbox_init_point || result.init_point);

      console.log('Preferência criada com sucesso:', result.id);
      res.json({ id: result.id, url });
    } catch (error: any) {
      // Detailed logging for debugging
      console.error('Erro detalhado do Mercado Pago:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data || error.response,
        cause: error.cause
      });

      // Handle specific Mercado Pago error messages
      let userErrorMessage = 'Erro ao processar pagamento com Mercado Pago';
      if (error.message?.includes('UNAUTHORIZED') || error.response?.status === 401) {
        userErrorMessage = 'Token do Mercado Pago inválido ou não configurado corretamente. Verifique o MERCADO_PAGO_ACCESS_TOKEN nas configurações.';
      } else if (error.message) {
        userErrorMessage = `Erro: ${error.message}`;
      }

      res.status(500).json({ 
        error: userErrorMessage,
        details: error.response?.data || null
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
