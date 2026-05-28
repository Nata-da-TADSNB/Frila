const PUBLIC_KEY = process.env.EXPO_PUBLIC_MP_PUBLIC_KEY ?? '';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_MP_ACCESS_TOKEN ?? '';

// Modo demo: ativo quando as credenciais não estão configuradas
export const DEMO_MODE = !PUBLIC_KEY || !ACCESS_TOKEN
    || PUBLIC_KEY.includes('xxx')
    || ACCESS_TOKEN.includes('xxx');

// Cartão de teste Mercado Pago (sandbox) - Alterado para nunca constar como vencido
const TEST_CARD = {
    card_number: '5031755734530604',
    security_code: '123',
    expiration_month: 11,
    expiration_year: new Date().getFullYear() + 1,
    cardholder_name: 'APRO',
    payment_method_id: 'master',
    payer_email: 'test_user_buyer@testuser.com',
};

async function tokenizarCartao() {
    const res = await fetch(
        `https://api.mercadopago.com/v1/card_tokens?public_key=${PUBLIC_KEY}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sandbox': 'true',            // ← adicionado
            },
            body: JSON.stringify({
                card_number: TEST_CARD.card_number,
                security_code: TEST_CARD.security_code,
                expiration_month: TEST_CARD.expiration_month,
                expiration_year: TEST_CARD.expiration_year,
                cardholder: {
                    name: TEST_CARD.cardholder_name,
                    identification: { type: 'CPF', number: '19119119100' },
                },
            }),
        }
    );

    const data = await res.json();
    if (!res.ok || !data.id) {
        throw new Error(data.message || 'Falha ao tokenizar cartão');
    }
    return data.id;
}

/**
 * Processa um pagamento via Mercado Pago.
 * Em DEMO_MODE simula aprovação após 1,5s.
 * Com credenciais reais realiza tokenização + criação de pagamento no sandbox.
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

    const token = await tokenizarCartao();

    const res = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'X-Idempotency-Key': `frila-${Date.now()}`,
            'X-Sandbox': 'true',                // ← adicionado
        },
        body: JSON.stringify({
            transaction_amount: Number(valor),
            token,
            description: descricao,
            installments: 1,
            payment_method_id: TEST_CARD.payment_method_id,
            payer: { email: TEST_CARD.payer_email },
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Falha na criação do pagamento');
    }
    if (data.status !== 'approved') {
        throw new Error(`Pagamento ${data.status}: ${data.status_detail}`);
    }

    return data;
}