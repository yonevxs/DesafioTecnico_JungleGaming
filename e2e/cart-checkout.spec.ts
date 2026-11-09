import { test, expect } from '@playwright/test';

test.describe('Carrinho, Checkout e Confirmação de Pedido', () => {
  test.beforeEach(async ({ page }) => {
    // Garante estado previsível do carrinho com itens antes de cada teste
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

  test('deve exibir o carrinho com itens, subtotais e taxas de rede', async ({ page }) => {
    await page.goto('/carrinho');

    // Resumo da carteira (desktop) ou Carrinho de NFTs (mobile)
    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText('Subtotal').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByText(/Taxa de rede/).filter({ visible: true }).first()).toBeVisible();
  });

  test('deve aplicar cupom de desconto com sucesso', async ({ page }) => {
    await page.goto('/carrinho');

    const couponInput = page.getByPlaceholder(/código promocional/i).filter({ visible: true }).first();
    await expect(couponInput).toBeVisible();
    await couponInput.fill('JUNGLE10');
    const applyBtn = page.getByRole('button', { name: 'Aplicar' }).filter({ visible: true }).first();
    await applyBtn.click();

    // Deve exibir feedback de cupom aplicado
    await expect(page.getByText(/JUNGLE10|10%/).filter({ visible: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('deve realizar fluxo completo de compra da navegação ao recibo', async ({ page }) => {
    // 1. Acessa o carrinho e vai para o pagamento
    await page.goto('/carrinho');
    const checkoutButton = page.getByRole('button', { name: /Conectar e finalizar|Finalizar compra/i }).filter({ visible: true }).first();
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();

    // 2. Aguarda tela de pagamento
    await page.waitForURL(/\/pagamento/, { timeout: 10000 });
    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible();

    // 3. Preenche dados de teste se em desktop
    const prefillBtn = page.getByRole('button', { name: /Preencher dados de teste/i }).filter({ visible: true }).first();
    if (await prefillBtn.isVisible()) {
      await prefillBtn.click();
    }

    const payButton = page.getByRole('button', { name: /Confirmar compra|Pagar com carteira/i }).filter({ visible: true }).first();
    await expect(payButton).toBeVisible();
    await payButton.click();

    // 4. Deve ser redirecionado para a tela de confirmação
    await page.waitForURL(/\/confirmacao.*/, { timeout: 15000 });
    await expect(page.getByText(/Seus NFTs agora estão na sua carteira|Detalhes da transação|Etherscan/i).filter({ visible: true }).first()).toBeVisible();
  });
});
