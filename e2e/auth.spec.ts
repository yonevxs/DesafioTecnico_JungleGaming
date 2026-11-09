import { test, expect } from '@playwright/test';

test.describe('Autenticação — Login e Cadastro Mobile/Desktop', () => {
  test('deve renderizar a tela de login com layout do Figma', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('text=KURIO').first()).toBeVisible();
    await expect(page.locator('h1:has-text("Entrar")')).toBeVisible();
    await expect(page.locator('input[placeholder="contato@email.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="************"]')).toBeVisible();
    await expect(page.locator('text=Esqueceu a senha?')).toBeVisible();
    await expect(page.locator('button:has-text("Entrar")')).toBeVisible();
    await expect(page.locator('text=Continuar com Google')).toBeVisible();
    await expect(page.locator('text=Continuar com Facebook')).toBeVisible();
    await expect(page.locator('text=Novo na Kurio?')).toBeVisible();
  });

  test('deve possuir campos obrigatórios com required no login', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
    const passwordInput = page.locator('input[placeholder="************"]');
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('deve navegar de login para cadastro e renderizar tela de cadastro', async ({ page }) => {
    await page.goto('/login');

    // Clica no link do rodapé "Crie uma conta"
    await page.locator('text=Crie uma conta').click();
    await page.waitForURL('/cadastro');

    await expect(page.locator('text=KURIO').first()).toBeVisible();
    await expect(page.locator('text=Criar perfil de colecionador')).toBeVisible();
    await expect(page.locator('input[placeholder="Nome de usuário"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Digite seu e-mail"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Senha"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Confirmar senha"]')).toBeVisible();
    await expect(page.locator('button:has-text("Criar perfil")')).toBeVisible();
  });

  test('deve realizar login com sucesso e redirecionar para o perfil', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[placeholder="contato@email.com"]').fill('lucas@kurio.eth');
    await page.locator('input[placeholder="************"]').fill('senhaSegura123');
    await page.locator('button:has-text("Entrar")').click();

    // Redireciona para o perfil do colecionador
    await page.waitForURL('/perfil');
    await expect(page.locator('text=Perfil do Colecionador').or(page.locator('text=KURIO')).first()).toBeVisible();
  });
});
