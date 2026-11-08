import { http, HttpResponse, delay } from 'msw';
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/auth';

// Usuário mock padrão
const mockUser: User = {
  id: 'usr_kurio_001',
  name: 'Lucas Neves',
  username: 'lucasneves_eth',
  email: 'contato@email.com',
  avatar: '/assets/NFT Auth Artwork 8.png',
  walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
  role: 'collector',
  createdAt: '2026-01-15T10:00:00Z',
};

export const authHandlers = [
  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    await delay(350);

    const body = (await request.json()) as LoginCredentials;

    // Se o email contiver "erro", simula falha
    if (body.email.toLowerCase().includes('erro') || body.password === 'errada') {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos. Verifique suas credenciais.' },
        { status: 401 }
      );
    }

    const responseData: AuthResponse = {
      user: {
        ...mockUser,
        email: body.email || mockUser.email,
      },
      token: `kurio_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };

    return HttpResponse.json(responseData, { status: 200 });
  }),

  // POST /api/auth/register
  http.post('/api/auth/register', async ({ request }) => {
    await delay(400);

    const body = (await request.json()) as RegisterData;

    const responseData: AuthResponse = {
      user: {
        id: `usr_${Date.now()}`,
        name: body.name || 'Novo Colecionador',
        username: body.username || body.email.split('@')[0],
        email: body.email,
        avatar: '/assets/NFT Auth Artwork 9.png',
        role: 'collector',
        createdAt: new Date().toISOString(),
      },
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

    return HttpResponse.json(mockUser, { status: 200 });
  }),

  // POST /api/auth/logout
  http.post('/api/auth/logout', async () => {
    await delay(150);
    return HttpResponse.json({ success: true, message: 'Sessão encerrada' });
  }),
];
