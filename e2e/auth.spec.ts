import { test, expect } from '@playwright/test';

test.describe('Autenticação — Login, Cadastro, Conflito 409 e Acessibilidade por Teclado', () => {
  test('deve renderizar a tela de login com layout do Figma e validação de campos obrigatórios', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('text=KURIO').first()).toBeVisible();
    await expect(page.locator('h1:has-text("Entrar")')).toBeVisible();
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('required', '');
    const passwordInput = page.locator('input[placeholder="************"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('deve navegar de login para cadastro e tratar conflito 409 de conta duplicada', async ({ page }) => {
    await page.goto('/login');

    await page.locator('text=Crie uma conta').click();
    await page.waitForURL('/cadastro');

    await expect(page.locator('text=Criar perfil de colecionador')).toBeVisible();
    await page.locator('input[placeholder="Nome de usuário"]').fill('conflito_user');
    await page.locator('input[placeholder="Digite seu e-mail"]').fill('conflito@kurio.eth');
    await page.locator('input[placeholder="Senha"]').fill('senha123');
    await page.locator('input[placeholder="Confirmar senha"]').fill('senha123');
    await page.locator('button:has-text("Criar perfil")').click();

    await expect(page.getByText(/já está em uso/i)).toBeVisible({ timeout: 5000 });
  });

  test('deve realizar login com sucesso e redirecionar para o perfil', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[placeholder="contato@email.com"]').fill('lucas@kurio.eth');
    await page.locator('input[placeholder="************"]').fill('senhaSegura123');
    await page.locator('button:has-text("Entrar")').click();

    await page.waitForURL('/perfil');
    await expect(page.locator('text=Perfil do Colecionador').or(page.locator('text=KURIO')).first()).toBeVisible();
  });

  test('11. deve suportar abertura de diálogo de autenticação e fechamento via tecla Escape', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      await page.goto('/login');
      await page.keyboard.press('Tab');
      await expect(page.locator('h1:has-text("Entrar")')).toBeVisible();
      return;
    }

    await page.goto('/?login=true');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
