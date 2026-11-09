import { test, expect } from '@playwright/test';

test.describe('Tempo Real com Socket.IO — Cenários Obrigatórios (Seção 7 e 9)', () => {
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

  test('9a. deve detectar alteração de preço em tempo real no carrinho e alertar o usuário', async ({ page }) => {
    await page.goto('/carrinho');

    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible();

    await page.evaluate(() => {
      const detail = {
        id: 'emerald-ape-042',
        priceEth: '1.45',
        priceUsd: 4950,
        version: Date.now() + 5000,
      };
      if ((window as any).__kurio_emit_nft_update) {
        (window as any).__kurio_emit_nft_update(detail);
      }
    });

    await expect(page.getByRole('button', { name: /Reconfirmar Cotação|Revalidar Cotação/i }).filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('9b. checkout deve bloquear finalização quando a cotação estiver desatualizada e liberar após revalidação', async ({ page }) => {
    await page.goto('/pagamento');

    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible();

    const prefillBtn = page.getByRole('button', { name: /Preencher dados de teste/i }).filter({ visible: true }).first();
    if (await prefillBtn.isVisible()) {
      await prefillBtn.click();
    }

    await page.evaluate(() => {
      const detail = {
        id: 'emerald-ape-042',
        priceEth: '1.80',
        priceUsd: 6100,
        version: Date.now() + 10000,
      };
      if ((window as any).__kurio_emit_nft_update) {
        (window as any).__kurio_emit_nft_update(detail);
      }
    });

    const revalidateBtn = page.getByRole('button', { name: /Revalidar Cotação|Reconfirmar Cotação/i }).filter({ visible: true }).first();
    await expect(revalidateBtn).toBeVisible({ timeout: 10000 });

    const payBtn = page.getByRole('button', { name: /Confirmar compra|Pagar com carteira/i }).filter({ visible: true }).first();
    await expect(payBtn).toBeDisabled();

    await revalidateBtn.click();

    await expect(revalidateBtn).not.toBeVisible();
    await expect(payBtn).toBeEnabled();
  });

  test('10. deve descartar eventos Socket.IO duplicados ou antigos (versão inferior) sem regredir o preço mais recente', async ({ page }) => {
    await page.goto('/carrinho');
    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible();

    const baseVersion = Date.now() + 20000;

    // 1. Emite versão mais recente (v2 = 2.00 ETH)
    await page.evaluate((v) => {
      (window as any).__kurio_emit_nft_update({
        id: 'emerald-ape-042',
        priceEth: '2.00',
        version: v,
      });
    }, baseVersion);

    // 2. Emite evento atrasado/obsoleto (v1 < v2 com 0.50 ETH) — deve ser descartado!
    await page.evaluate((v) => {
      (window as any).__kurio_emit_nft_update({
        id: 'emerald-ape-042',
        priceEth: '0.50',
        version: v - 1000,
      });
    }, baseVersion);

    // Subtotal para 2 unidades a 2.00 ETH deve permanecer 4.00 ETH (e nunca 1.00 ETH)
    await expect(page.getByText('4.00 ETH').filter({ visible: true }).first()).toBeVisible();
  });
});
