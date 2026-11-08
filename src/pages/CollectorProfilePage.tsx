import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  Shield,
  ShoppingBag,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

type ProfileSidebarTab =
  | 'dados'
  | 'carteiras'
  | 'atividade'
  | 'lista-interesse'
  | 'ofertas'
  | 'arquivos'
  | 'suporte';

export const CollectorProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<ProfileSidebarTab>('dados');

  // Dados do formulário de perfil (inicializados com dados do usuário ou valores de teste)
  const [displayName, setDisplayName] = useState(user?.name || 'Lucas Neves');
  const [username, setUsername] = useState(user?.username || 'lucasneves_eth');
  const [email, setEmail] = useState(user?.email || 'lucas.neves@email.com');
  const [ensName, setEnsName] = useState('lucasneves');
  const [walletNickname, setWalletNickname] = useState('Carteira Principal (MetaMask)');
  const [avatar, setAvatar] = useState(user?.avatar || '/assets/NFT Auth Artwork 8.png');

  // Campos para alteração de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Toggles de visualização de senha
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Estados de feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // Manipulação de troca de avatar com artworks disponíveis
  const handleCycleAvatar = () => {
    const avatars = [
      '/assets/NFT Auth Artwork 8.png',
      '/assets/NFT Auth Artwork 9.png',
      '/assets/NFT Auth Artwork 10.png',
      '/assets/NFT Auth Artwork 11.png',
    ];
    const currentIndex = avatars.indexOf(avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    setAvatar(avatars[nextIndex]);
  };

  const handleRemoveAvatar = () => {
    setAvatar('/assets/NFT Auth Artwork 8.png');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!displayName.trim() || !username.trim() || !email.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios marcados com *');
      return;
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      setErrorMessage('A nova senha e a confirmação não coincidem.');
      return;
    }

    // Sucesso ao salvar
    setSuccessMessage('Perfil atualizado com sucesso na rede Kurio!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/' });
  };

  const handleCopyWallet = () => {
    const address = user?.walletAddress || '0x71C8360565ab8854E632310375776473060f641B';
    navigator.clipboard.writeText(address);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Header */}
      <Header />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        
        {/* Layout Grid: Sidebar Esquerda + Conteúdo Central (Figma Print 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sidebar Lateral "Meu perfil" (3 colunas no Desktop) */}
          <aside className="lg:col-span-3 bg-[#241612] border border-[#38220F] rounded-xl p-5 shadow-xl space-y-4">
            
            <h2 className="text-base font-bold text-[#CFB28C] tracking-wide px-2">
              Meu perfil
            </h2>

            {/* Menu de Navegação Vertical */}
            <nav className="space-y-1 text-xs">
              
              {/* 1. Dados do perfil (Ativo no Print) */}
              <button
                type="button"
                onClick={() => setActiveTab('dados')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'dados'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <UserIcon className="w-4 h-4 text-[#D28A4C]" />
                <span>Dados do perfil</span>
              </button>

              {/* 2. Carteiras */}
              <button
                type="button"
                onClick={() => setActiveTab('carteiras')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'carteiras'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <Shield className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Carteiras</span>
              </button>

              {/* 3. Atividade */}
              <button
                type="button"
                onClick={() => setActiveTab('atividade')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'atividade'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Atividade</span>
              </button>

              {/* 4. Lista de interesse */}
              <button
                type="button"
                onClick={() => setActiveTab('lista-interesse')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'lista-interesse'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <Heart className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Lista de interesse</span>
              </button>

              {/* 5. Ofertas */}
              <button
                type="button"
                onClick={() => setActiveTab('ofertas')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'ofertas'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <Tag className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Ofertas</span>
              </button>

              {/* 6. Arquivos baixados */}
              <button
                type="button"
                onClick={() => setActiveTab('arquivos')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'arquivos'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <Download className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Arquivos baixados</span>
              </button>

              {/* 7. Suporte */}
              <button
                type="button"
                onClick={() => setActiveTab('suporte')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'suporte'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#CFB28C]/60" />
                <span>Suporte</span>
              </button>

              {/* Divisor */}
              <div className="pt-2 border-t border-[#38220F]/60" />

              {/* 8. Sair */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>

            </nav>

          </aside>

          {/* Área Principal de Conteúdo (9 colunas no Desktop) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Tab: Dados do perfil (Figma Print 2) */}
            {activeTab === 'dados' && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                <h1 className="text-base sm:text-lg font-bold text-[#CFB28C] tracking-wide">
                  Perfil do colecionador
                </h1>

                {/* Feedback Messages */}
                {successMessage && (
                  <div className="p-3.5 bg-green-950/40 border border-green-800 text-green-300 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3.5 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Grid de Campos Principais (2 Colunas) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Linha 1 - Col 1: Nome de exibição* */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      Nome de exibição<span className="text-[#E89B55]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                    />
                  </div>

                  {/* Linha 1 - Col 2: Nome de usuário* */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      Nome de usuário<span className="text-[#E89B55]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                    />
                  </div>

                  {/* Linha 2 - Col 1: E-mail* */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      E-mail<span className="text-[#E89B55]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                    />
                  </div>

                  {/* Linha 2 - Col 2: Nome ENS * (com seletor .eth ▾ à esquerda conforme Print 2) */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      Nome ENS <span className="text-[#E89B55]">*</span>
                    </label>
                    <div className="flex bg-[#140D0A] border border-[#38220F] focus-within:border-[#D28A4C] rounded-lg overflow-hidden">
                      <span className="text-xs text-[#CFB28C]/70 px-3 py-2.5 border-r border-[#38220F] flex items-center bg-[#241612]/60 select-none">
                        .eth ▾
                      </span>
                      <input
                        type="text"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        className="w-full bg-transparent px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                      />
                    </div>
                  </div>

                  {/* Linha 3 - Col 1: Apelido da carteira* */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      Apelido da carteira<span className="text-[#E89B55]">*</span>
                    </label>
                    <input
                      type="text"
                      value={walletNickname}
                      onChange={(e) => setWalletNickname(e.target.value)}
                      className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                    />
                  </div>

                  {/* Linha 3 - Col 2: Avatar (com círculo, botão Alterar e Remover) */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#CFB28C]/80 block">
                      Avatar
                    </label>
                    <div className="flex items-center gap-3">
                      {/* Avatar preview */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#241612] border border-[#38220F] shrink-0">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>

                      {/* Botão Alterar */}
                      <button
                        type="button"
                        onClick={handleCycleAvatar}
                        className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                      >
                        Alterar
                      </button>

                      {/* Botão Remover */}
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="text-xs text-[#CFB28C]/60 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                </div>

                {/* Subseção: Alterar senha (Figma Print 2) */}
                <div className="pt-4 space-y-4 max-w-md">
                  
                  <h3 className="text-xs font-bold text-[#CFB28C] tracking-wide">
                    Alterar senha
                  </h3>

                  {/* Senha atual */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] text-[#CFB28C]/80 block">
                      Senha atual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-[#CFB28C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFB28C]/50 hover:text-[#E89B55] transition-colors cursor-pointer"
                      >
                        {showCurrentPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nova senha */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] text-[#CFB28C]/80 block">
                      Nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-[#CFB28C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFB28C]/50 hover:text-[#E89B55] transition-colors cursor-pointer"
                      >
                        {showNewPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar nova senha */}
                  <div className="space-y-1.5 relative">
                    <label className="text-[11px] text-[#CFB28C]/80 block">
                      Confirmar nova senha
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 pr-10 text-xs text-[#CFB28C] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#CFB28C]/50 hover:text-[#E89B55] transition-colors cursor-pointer"
                      >
                        {showConfirmPass ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Botão Salvar (Figma Print 2) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-8 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/15 cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>

              </form>
            )}

            {/* Tab: Carteiras */}
            {activeTab === 'carteiras' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-[#CFB28C]">Carteiras Conectadas</h2>
                <div className="bg-[#241612] border border-[#38220F] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#CFB28C]/60 block">Carteira Primária (Ethereum)</span>
                      <span className="text-sm font-bold text-[#CFB28C] font-mono">
                        {user?.walletAddress || '0x71C8360565ab8854E632310375776473060f641B'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyWallet}
                      className="text-xs text-[#E89B55] hover:text-[#D28A4C] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedWallet ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedWallet ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-[#38220F]/60 flex items-center justify-between text-xs">
                    <span className="text-[#CFB28C]/70">Saldo Estimado</span>
                    <span className="font-bold text-[#E89B55] font-mono">34.82 ETH</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Atividade */}
            {activeTab === 'atividade' && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-[#CFB28C]">Histórico de Atividade</h2>
                <div className="bg-[#241612] border border-[#38220F] rounded-xl p-5 text-xs text-[#CFB28C]/70 space-y-3">
                  <p>Últimas transferências e cunhagens na rede registradas com sucesso.</p>
                  <div className="p-3 bg-[#140D0A] rounded-lg border border-[#38220F]/60 flex items-center justify-between">
                    <span>Compra de Emerald Ape #042</span>
                    <span className="text-green-400 font-bold font-mono">Confirmado</span>
                  </div>
                </div>
              </div>
            )}

            {/* Outras Abas */}
            {['lista-interesse', 'ofertas', 'arquivos', 'suporte'].includes(activeTab) && (
              <div className="bg-[#241612] border border-[#38220F] rounded-xl p-8 text-center text-xs text-[#CFB28C]/60 space-y-2">
                <p className="font-bold text-[#CFB28C] capitalize">
                  {activeTab.replace('-', ' ')}
                </p>
                <p>Nenhum registro pendente para esta seção no momento.</p>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
