import { test, expect } from '@playwright/test';

test.describe('Carrinho, Checkout, Idempotência e Confirmação de Pedido', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const defaultItems = [
        {
          nft: {
            id: 'emerald-ape-042',
            title: 'Emerald Ape #042',
            name: 'Emerald Ape',
            tokenId: '#042',
            priceEth: '1.25',
            priceUsd: 4250,
            image: '/assets/NFT Auth Artwork 9.png',
            author: 'Studio Kurio',
            network: 'Ethereum',
            category: 'Arte Digital',
            availableQuantity: 24,
            totalQuantity: 50,
            isSoldOut: false,
          },
          quantity: 2,
          addedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('kurio_cart_items_v2', JSON.stringify(defaultItems));
      localStorage.removeItem('kurio_cart_coupon_v2');
    });
  });

  test('5. deve exibir o carrinho com itens, subtotais, taxas e persistir após refresh', async ({ page }) => {
    await page.goto('/carrinho');

    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText('Subtotal').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText(/Taxa de rede/).filter({ visible: true }).first()).toBeVisible();

    await page.reload();
    await expect(page.getByText(/Emerald Ape/i).filter({ visible: true }).first()).toBeVisible();
  });

  test('5b. deve aplicar cupom válido JUNGLE10 e rejeitar cupom EXPIRADO', async ({ page }) => {
    await page.goto('/carrinho');

    const couponInput = page.getByPlaceholder(/código promocional/i).filter({ visible: true }).first();
    await expect(couponInput).toBeVisible();

    // Testa cupom expirado primeiro
    await couponInput.fill('EXPIRADO');
    const applyBtn = page.getByRole('button', { name: 'Aplicar' }).filter({ visible: true }).first();
    await applyBtn.click();
    await expect(page.getByText(/expirou/i).filter({ visible: true }).first()).toBeVisible();

    // Testa cupom válido
    await couponInput.fill('JUNGLE10');
    await applyBtn.click();
    await expect(page.getByText(/JUNGLE10|10%/).filter({ visible: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('6. deve realizar fluxo completo de compra da navegação ao recibo confirmado', async ({ page }) => {
    await page.goto('/carrinho');
    const checkoutButton = page.getByRole('button', { name: /Conectar e finalizar|Finalizar compra/i }).filter({ visible: true }).first();
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    await page.waitForURL(/\/pagamento/, { timeout: 10000 });
    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible();

    const prefillBtn = page.getByRole('button', { name: /Preencher dados de teste/i }).filter({ visible: true }).first();
    if (await prefillBtn.isVisible()) {
      await prefillBtn.click();
    }

    const payButton = page.getByRole('button', { name: /Confirmar compra|Pagar com carteira/i }).filter({ visible: true }).first();
    await expect(payButton).toBeVisible();
    await payButton.click();

    await page.waitForURL(/\/confirmacao.*/, { timeout: 15000 });
    await expect(page.getByText(/Seus NFTs agora estão na sua carteira|Detalhes da transação|Etherscan/i).filter({ visible: true }).first()).toBeVisible();
  });

  test('7. deve validar idempotência de pedidos (mesma chave retorna mesmo pedido, chave com payload diferente retorna 409) e pagamento recusado', async ({ page }) => {
    await page.goto('/pagamento');
    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible();

    const result = await page.evaluate(async () => {
      const key = `test-idemp-${Date.now()}`;
      const basePayload = {
        idempotencyKey: key,
        collector: {
          displayName: 'Lucas',
          username: 'lucas',
          network: 'Ethereum',
          profileName: 'Lucas',
          walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
          walletType: 'MetaMask',
          email: 'lucas@kurio.eth',
        },
        items: [],
        subtotalEth: '1.25',
        discountEth: '0.00',
        networkFeeEth: '0.016',
        totalEth: '1.266',
      };

      const res1 = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify(basePayload),
      });
      const data1 = await res1.json();

      // Mesma chave e mesmo payload -> 200 com mesmo orderId
      const res2 = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify(basePayload),
      });
      const data2 = await res2.json();

      // Mesma chave com payload diferente -> 409 Conflict
      const resConflict = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
        body: JSON.stringify({ ...basePayload, totalEth: '9.999' }),
      });

      // Cenário de pagamento recusado -> 400
      const resRejected = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `${key}-rej` },
        body: JSON.stringify({
          ...basePayload,
          collector: { ...basePayload.collector, email: 'recusar@teste.com' },
        }),
      });

      return {
        status1: res1.status,
        status2: res2.status,
        sameOrderId: data1.orderId === data2.orderId,
        conflictStatus: resConflict.status,
        rejectedStatus: resRejected.status,
      };
    });

    expect(result.status1).toBe(201);
    expect(result.status2).toBe(200);
    expect(result.sameOrderId).toBe(true);
    expect(result.conflictStatus).toBe(409);
    expect(result.rejectedStatus).toBe(400);
  });
});
