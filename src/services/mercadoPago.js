import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MP_ACCESS_TOKEN ?? '';

// Modo demo: ativo quando as credenciais não estão configuradas
export const DEMO_MODE = !ACCESS_TOKEN || ACCESS_TOKEN.includes('xxx');

/**
 * Cria uma preferência de pagamento no Mercado Pago (Checkout Pro).
 * Retorna a URL para redirecionar o usuário.
 */
async function criarPreferencia(valor, descricao) {
    const redirectBase = Linking.createURL('pagamento');

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
            items: [
                {
                    title: descricao,
                    quantity: 1,
                    unit_price: Number(valor),
                    currency_id: 'BRL',
                },
            ],
            back_urls: {
                success: redirectBase + '?status=approved',
                failure: redirectBase + '?status=failure',
                pending: redirectBase + '?status=pending',
            },
            auto_return: 'approved',
        }),
    });

    const data = await res.json();
    console.log('PREFERENCE RESPONSE:', JSON.stringify(data, null, 2));

    if (!res.ok || !data.sandbox_init_point) {
        throw new Error(data.message || 'Falha ao criar preferência');
    }

    return data.sandbox_init_point; // URL do checkout em modo sandbox
}

/**
 * Processa um pagamento via Mercado Pago Checkout Pro.
 * Em DEMO_MODE simula aprovação após 1,5s.
 * Com credenciais reais abre o navegador do Mercado Pago.
 *
 * @param {number} valor - Valor em reais
 * @param {string} descricao - Descrição do serviço
 * @returns {{ id, status, status_detail }}
 */
export async function processarPagamento(valor, descricao) {
    if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 1500));
        return {
            id: `DEMO-${Date.now()}`,
            status: 'approved',
            status_detail: 'accredited',
        };
    }

    const checkoutUrl = await criarPreferencia(valor, descricao);

    const result = await WebBrowser.openAuthSessionAsync(
        checkoutUrl,
        Linking.createURL('pagamento')
    );

    console.log('BROWSER RESULT:', JSON.stringify(result, null, 2));

    if (result.type === 'success') {
        const url = result.url;
        if (url.includes('status=approved')) {
            return {
                id: `MP-${Date.now()}`,
                status: 'approved',
                status_detail: 'accredited',
            };
        } else if (url.includes('status=failure')) {
            throw new Error('Pagamento recusado pelo Mercado Pago');
        } else {
            throw new Error('Pagamento pendente de confirmação');
        }
    } else if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Pagamento cancelado pelo usuário');
    } else {
        throw new Error('Erro ao abrir o checkout');
    }
}