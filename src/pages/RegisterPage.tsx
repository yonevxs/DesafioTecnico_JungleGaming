import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithSocial, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !email.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    try {
      await register({
        name: username.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      navigate({ to: '/perfil' });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Falha ao criar perfil. Tente novamente mais tarde.'
      );
    }
  };

  const handleSocialLogin = async (provider: 'Google' | 'Facebook') => {
    setErrorMessage(null);
    try {
      await loginWithSocial(provider);
      navigate({ to: '/perfil' });
    } catch (err: any) {
      setErrorMessage(`Falha ao conectar com ${provider}. Tente novamente.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col justify-center items-center px-4 py-8 font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Container Centralizado com formato mobile do Figma */}
      <div className="w-full max-w-[360px] sm:max-w-[390px] flex flex-col">
        
        {/* Logo KURIO com navegação para a Home */}
        <div className="text-center mt-4 sm:mt-6 mb-8 sm:mb-10">
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="inline-block transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Voltar para a página inicial"
          >
            <span className="text-2xl font-bold tracking-[0.25em] text-[#CFB28C] font-mono">
              KURIO
            </span>
          </button>
        </div>

        {/* Subtítulo: Criar perfil de colecionador */}
        <h1 className="text-base font-bold font-mono text-[#CFB28C] text-center mb-6">
          Criar perfil de colecionador
        </h1>

        {/* Mensagens de Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulário de Cadastro */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3.5">
          
          {/* Campo Nome de usuário */}
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-2xl px-5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none font-mono transition-colors"
            />
          </div>

          {/* Campo Digite seu e-mail */}
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-2xl px-5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none font-mono transition-colors"
            />
          </div>

          {/* Campo Senha com Toggle */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-2xl px-5 pr-12 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none font-mono transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CFB28C]/50 hover:text-[#E89B55] transition-colors cursor-pointer p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Campo Confirmar Senha com Toggle */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-2xl px-5 pr-12 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none font-mono transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CFB28C]/50 hover:text-[#E89B55] transition-colors cursor-pointer p-1"
              aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
            >
              {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Botão Criar perfil */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-50 text-[#140D0A] font-bold text-sm font-mono rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-[#D28A4C]/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#140D0A]" />
                  <span>Criando perfil...</span>
                </>
              ) : (
                <span>Criar perfil</span>
              )}
            </button>
          </div>

        </form>

        {/* Divisor "Ou continue com" */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#38220F]/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#140D0A] px-3 text-[#CFB28C]/60 font-mono">
              Ou continue com
            </span>
          </div>
        </div>

        {/* Botões de Redes Sociais */}
        <div className="space-y-3">
          
          {/* Continuar com Google */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialLogin('Google')}
            className="w-full h-12 bg-[#140D0A] border border-[#38220F] hover:border-[#CFB28C]/40 rounded-2xl flex items-center justify-center gap-3 text-xs text-[#CFB28C] font-mono transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>

          {/* Continuar com Facebook */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full h-12 bg-[#140D0A] border border-[#38220F] hover:border-[#CFB28C]/40 rounded-2xl flex items-center justify-center gap-3 text-xs text-[#CFB28C] font-mono transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Continuar com Facebook</span>
          </button>

        </div>

        {/* Rodapé: Já tem uma conta? Entre */}
        <div className="text-center pt-8 pb-4">
          <p className="text-xs text-[#CFB28C]/80 font-mono">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate({ to: '/login' })}
              className="text-[#CFB28C] hover:text-[#E89B55] transition-colors underline font-medium cursor-pointer"
            >
              Entre
            </button>
          </p>
        </div>

      </div>

    </div>
  );
};
