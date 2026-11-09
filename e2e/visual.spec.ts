import { test, expect } from '@playwright/test';

test.describe('Regressão Visual — Telas Principais (Seção 9)', () => {
  test.beforeEach(async ({ page }) => {
    // Congela timers ou animações e injeta dados estáveis de mock
    await page.addInitScript(() => {
      // Estado estável para o carrinho
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
          addedAt: '2026-07-29T10:00:00.000Z',
        },
      ];
      localStorage.setItem('kurio_cart_items_v2', JSON.stringify(defaultItems));
      localStorage.removeItem('kurio_cart_coupon_v2');
      localStorage.removeItem('kurio_mock_scenario');
      localStorage.removeItem('kurio_mock_like_error');
    });
  });

  test('visual: Início (Home)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#catalogo').locator('img').first()).toBeVisible({ timeout: 15000 });
    // Aguarda imagens carregarem
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-screen.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('visual: Detalhe do NFT', async ({ page }) => {
    await page.goto('/nft/emerald-ape-042');
    await expect(page.getByRole('button', { name: /comprar/i }).filter({ visible: true }).first()).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('nft-detail-screen.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('visual: Carrinho de NFTs', async ({ page }) => {
    await page.goto('/carrinho');
    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('cart-screen.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });

  test('visual: Pagamento (Checkout)', async ({ page }) => {
    await page.goto('/pagamento');
    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('checkout-screen.png', {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    });
  });
});
