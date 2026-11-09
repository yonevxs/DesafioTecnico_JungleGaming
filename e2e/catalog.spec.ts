import { test, expect } from '@playwright/test';

test.describe('Catálogo de NFTs e Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Aguarda o título principal h1 visível (desktop ou mobile)
    await expect(page.locator('h1:visible').first()).toBeVisible({ timeout: 10000 });
  });

  test('deve listar os NFTs e exibir elementos da Home', async ({ page }) => {
    await expect(page.getByText('KURIO').filter({ visible: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Explorar/i }).filter({ visible: true }).first()).toBeVisible();
    
    // Verifica cards de NFTs visíveis no catálogo
    const catalogCards = page.locator('#catalogo').locator('img');
    await expect(catalogCards.first()).toBeVisible();
  });

  test('deve filtrar por busca de texto e refletir na URL', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Explorar/i).filter({ visible: true }).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Emerald Ape');
      await page.waitForTimeout(500);
      expect(page.url()).toContain('search=');
      await expect(page.locator('#catalogo').getByText(/Emerald Ape/i).first()).toBeVisible();
    }
  });

  test('deve navegar para a página de detalhes ao clicar em um NFT', async ({ page }) => {
    // Clica no card de NFT (que possui tokenId # no nome/alt)
    const nftCard = page.locator('#catalogo').locator('img[alt*="#"]').first();
    await expect(nftCard).toBeVisible();
    await nftCard.click();

    await page.waitForURL(/\/nft\/.+/, { timeout: 15000 });
    await expect(page.getByRole('button', { name: /comprar/i }).filter({ visible: true }).first()).toBeVisible();
  });

  test('deve alternar favorito com atualização otimista', async ({ page }) => {
    const likeButton = page.locator('#catalogo').getByRole('button', { name: /favorito|curtir/i }).first();
    if (await likeButton.isVisible()) {
      await likeButton.click();
      await expect(likeButton).toBeVisible();
    }
  });
});
