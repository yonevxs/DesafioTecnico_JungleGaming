import { test, expect } from '@playwright/test';

test.describe('Tempo Real com Socket.IO — Cenário Obrigatório do Edital', () => {
  test.beforeEach(async ({ page }) => {
    // Garante estado do carrinho com o NFT 'emerald-ape-042'
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

  test('deve detectar alteração de preço em tempo real no carrinho e alertar o usuário', async ({ page }) => {
    await page.goto('/carrinho');

    // Aguarda carrinho carregar com itens
    await expect(page.getByText(/Resumo da carteira|Carrinho de NFTs/).filter({ visible: true }).first()).toBeVisible();

    // Dispara atualização de preço em tempo real via Socket.IO e CustomEvent
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
      window.dispatchEvent(new CustomEvent('kurio:socket:nft.updated', { detail }));
    });

    // A interface deve exibir o banner de alerta com botão de reconfirmação
    await expect(page.getByRole('button', { name: /Reconfirmar Cotação|Revalidar Cotação/i }).filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });
  });

  test('checkout deve bloquear finalização quando a cotação estiver desatualizada e liberar após revalidação', async ({ page }) => {
    await page.goto('/pagamento');

    await expect(page.getByText(/Perfil do colecionador|Pagamento com carteira/i).filter({ visible: true }).first()).toBeVisible();

    // Se houver botão de teste rápido (desktop), preenche
    const prefillBtn = page.getByRole('button', { name: /Preencher dados de teste/i }).filter({ visible: true }).first();
    if (await prefillBtn.isVisible()) {
      await prefillBtn.click();
    }

    // Simula evento nft.updated em tempo real
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
      window.dispatchEvent(new CustomEvent('kurio:socket:nft.updated', { detail }));
    });

    // Deve exibir aviso e botão de revalidação
    const revalidateBtn = page.getByRole('button', { name: /Revalidar Cotação|Reconfirmar Cotação/i }).filter({ visible: true }).first();
    await expect(revalidateBtn).toBeVisible({ timeout: 10000 });

    // O botão de pagamento deve estar desabilitado enquanto a cotação estiver desatualizada
    const payBtn = page.getByRole('button', { name: /Confirmar compra|Pagar com carteira/i }).filter({ visible: true }).first();
    await expect(payBtn).toBeDisabled();

    // Usuário clica em Revalidar Cotação
    await revalidateBtn.click();

    // O botão de revalidação deve desaparecer e o pagamento deve ser liberado
    await expect(revalidateBtn).not.toBeVisible();
    await expect(payBtn).toBeEnabled();
  });
});
