import { http, HttpResponse, delay } from 'msw';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

// Usuário padrão inicial
const defaultUser: User = {
  id: 'usr_kurio_001',
  name: 'Lucas Neves',
  username: 'lucasneves_eth',
  email: 'contato@email.com',
  avatar: '/assets/NFT Auth Artwork 8.png',
  walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
  role: 'collector',
  createdAt: '2026-01-15T10:00:00Z',
};

// Banco simulado de usuários em memória com sincronização com localStorage
const registeredUsers = new Map<string, User>([
  ['contato@email.com', defaultUser],
  ['lucas.neves@email.com', defaultUser],
]);

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    await delay(300);

    const body = (await request.json().catch(() => ({}))) as LoginCredentials;

    // Cenário determinístico do README: Falha de autenticação
    if (body.email?.toLowerCase().includes('erro') || body.password === 'errada') {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos. Verifique suas credenciais.' },
        { status: 401 }
      );
    }

    const matchedUser = registeredUsers.get(body.email) || {
      ...defaultUser,
      email: body.email || defaultUser.email,
      name: body.email?.split('@')[0] || defaultUser.name,
    };

    const responseData: AuthResponse = {
      user: matchedUser,
      token: `kurio_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return HttpResponse.json(responseData, { status: 200 });
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    await delay(350);

    const body = (await request.json().catch(() => ({}))) as RegisterData;

    // Cenário determinístico do README: Conflito de cadastro (409 Conflict)
    if (
      body.email?.toLowerCase().includes('conflito') ||
      body.email?.toLowerCase().includes('duplicado') ||
      body.name?.toLowerCase().includes('conflito')
    ) {
      return HttpResponse.json(
        { message: 'Este e-mail ou nome de usuário já está em uso.' },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: body.name || body.username || 'Novo Colecionador',
      username: body.username || (body.email ? body.email.split('@')[0] : 'colecionador'),
      email: body.email || 'colecionador@kurio.art',
      avatar: '/assets/NFT Auth Artwork 9.png',
      walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
      role: 'collector',
      createdAt: new Date().toISOString(),
    };

    registeredUsers.set(newUser.email, newUser);

    const responseData: AuthResponse = {
      user: newUser,
      token: `kurio_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return HttpResponse.json(responseData, { status: 201 });
  }),

  // GET /api/auth/me
  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    return HttpResponse.json(defaultUser, { status: 200 });
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Sessão encerrada' });
  }),

  // PUT /api/profile
  http.put('/api/profile', async ({ request }) => {
    await delay(300);
    const body = (await request.json().catch(() => ({}))) as Partial<User>;
    const updated = { ...defaultUser, ...body };
    return HttpResponse.json(updated, { status: 200 });
  }),

  // PUT /api/profile/password
  http.put('/api/profile/password', async () => {
    await delay(300);
    return HttpResponse.json({ success: true, message: 'Senha alterada com sucesso' }, { status: 200 });
  }),

  // GET /api/wallets
  http.get('/api/wallets', async () => {
    return HttpResponse.json([
      { id: 'w1', type: 'MetaMask', address: '0x71C8360565ab8854E632310375776473060f641B', isPrimary: true },
      { id: 'w2', type: 'Coinbase Wallet', address: '0xA91F734b0291e921d7491823058912e82C', isPrimary: false },
    ]);
  }),

  // PUT /api/wallets
  http.put('/api/wallets', async ({ request }) => {
    await delay(250);
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ success: true, message: 'Carteiras atualizadas com sucesso', data: body }, { status: 200 });
  }),

  // POST /api/wallets
  http.post('/api/wallets', async ({ request }) => {
    await delay(250);
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ success: true, message: 'Carteira cadastrada com sucesso', data: body }, { status: 201 });
  }),
];
