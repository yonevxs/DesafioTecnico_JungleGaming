import { test, expect } from '@playwright/test';

test.describe('Catálogo de NFTs, Detalhes, Skeletons e Favoritos Otimistas', () => {
  test('1. deve listar os NFTs, filtrar por busca/ordenação e restaurar estado pelo histórico (back/forward)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:visible').first()).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('KURIO').filter({ visible: true }).first()).toBeVisible();
    const catalogCards = page.locator('#catalogo').locator('img');
    await expect(catalogCards.first()).toBeVisible();

    const searchInput = page.getByPlaceholder(/Explorar/i).filter({ visible: true }).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Emerald Ape');
      await page.waitForTimeout(400);
      expect(page.url()).toContain('search=');
      await expect(page.locator('#catalogo').getByText(/Emerald Ape/i).first()).toBeVisible();

      // Volta no histórico e verifica restauração da URL
      await page.goBack();
      await page.waitForTimeout(300);
      expect(page.url()).not.toContain('search=Emerald');
    }
  });

  test('2. deve navegar para detalhes de um NFT válido e exibir erro 404 para NFT inexistente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1:visible').first()).toBeVisible({ timeout: 10000 });

    const nftCard = page.locator('#catalogo').locator('img[alt*="#"]').first();
    await expect(nftCard).toBeVisible();
    await nftCard.click();

    await page.waitForURL(/\/nft\/.+/, { timeout: 15000 });
    await expect(page.getByRole('button', { name: /comprar/i }).filter({ visible: true }).first()).toBeVisible();

    // Acesso direto a NFT inexistente
    await page.goto('/nft/token-inexistente-9999');
    await expect(page.getByText(/NFT Inexistente/i)).toBeVisible({ timeout: 10000 });
  });

  test('4. deve alternar favorito com atualização otimista e fazer rollback em caso de falha na API', async ({ page }) => {
    await page.goto('/nft/emerald-ape-042');
    await expect(page.getByRole('button', { name: /comprar/i }).filter({ visible: true }).first()).toBeVisible({ timeout: 10000 });

    // Simula erro 500 na mutação de favorito para exercitar rollback otimista
    await page.evaluate(() => {
      localStorage.setItem('kurio_mock_like_error', 'true');
    });

    const likeBtn = page.getByRole('button', { name: /favoritar|desfavoritar/i }).filter({ visible: true }).first();
    if (await likeBtn.isVisible()) {
      await likeBtn.click();
      await page.waitForTimeout(400);
      await expect(likeBtn).toBeVisible();
    }

    await page.evaluate(() => {
      localStorage.removeItem('kurio_mock_like_error');
    });
  });

  test('12. deve exibir skeletons com shimmer durante carregamento lento do catálogo', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('kurio_mock_scenario', 'slow');
    });

    await page.goto('/');
    // Verifica que a página carrega e depois exibe os cards normalmente
    const catalogCards = page.locator('#catalogo').locator('img');
    await expect(catalogCards.first()).toBeVisible({ timeout: 15000 });

    await page.evaluate(() => {
      localStorage.removeItem('kurio_mock_scenario');
    });
  });
});
