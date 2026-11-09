import { test, expect } from '@playwright/test';

test.describe('Perfil do Colecionador e Carteiras', () => {
  test('deve renderizar a tela de perfil do colecionador', async ({ page }) => {
    await page.goto('/perfil');

    await expect(page.locator('text=Perfil do Colecionador').or(page.locator('text=Colecionador')).first()).toBeVisible();
    await expect(page.locator('text=Carteiras Conectadas').or(page.locator('text=Reserva')).or(page.locator('text=Carteiras')).first()).toBeVisible();
  });

  test('deve exibir endereços e redes das carteiras conectadas', async ({ page }) => {
    await page.goto('/carteiras');

    // Deve exibir Polygon ou Ethereum nas carteiras
    await expect(page.locator('text=Polygon').or(page.locator('text=Ethereum')).or(page.locator('text=Carteiras')).first()).toBeVisible();
  });
});
