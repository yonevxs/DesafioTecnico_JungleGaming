import React, { useState, useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { walletService } from '@/services/walletService';
import { WalletFormData, SecondaryWalletData } from '@/types/wallet';
import { BlockchainNetwork } from '@/types/nft';
import { WalletType } from '@/types/order';
import {
  User as UserIcon,
  MapPin,
  Clock,
  Heart,
  RotateCcw,
  Download,
  AlertTriangle,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  Plus,
  Trash2,
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
  const routerState = useRouterState();
  const { user, logout } = useAuth();

  const isCarteirasRoute = routerState.location.pathname === '/carteiras';
  const [activeTab, setActiveTab] = useState<ProfileSidebarTab>(
    isCarteirasRoute ? 'carteiras' : 'dados'
  );

  useEffect(() => {
    if (routerState.location.pathname === '/carteiras') {
      setActiveTab('carteiras');
    } else if (
      routerState.location.pathname === '/perfil' ||
      routerState.location.pathname === '/perfil-colecionador'
    ) {
      setActiveTab('dados');
    }
  }, [routerState.location.pathname]);

  // Dados do formulário de perfil
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

  // Estados específicos da Seção de Carteiras (Figma Print Desktop / Carteiras)
  const [walletForm, setWalletForm] = useState<WalletFormData>(() => {
    const saved = walletService.getPrimaryWallet();
    return (
      saved || {
        displayName: user?.name || '',
        walletNickname: '',
        network: '',
        profileName: user?.username || '',
        walletAddress: user?.walletAddress || '',
        secondaryWalletOrEns: '',
        walletType: '',
        referralCode: '',
        email: user?.email || '',
        ensName: '',
      }
    );
  });

  const [ensPrefix, setEnsPrefix] = useState('.eth');

  const [secondaryWallet, setSecondaryWallet] = useState<SecondaryWalletData>(() => {
    const saved = walletService.getSecondaryWallet();
    return (
      saved || {
        sameAsPrimary: false,
        isAdded: false,
        address: '',
        network: undefined,
        nickname: '',
      }
    );
  });

  const [isAddingSecondary, setIsAddingSecondary] = useState(false);
  const [secondaryForm, setSecondaryForm] = useState({
    nickname: '',
    network: '' as BlockchainNetwork | '',
    address: '',
    walletType: '' as WalletType | '',
  });

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

  const handleSavePrimaryWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (
      !walletForm.displayName.trim() ||
      !walletForm.walletNickname.trim() ||
      !walletForm.network ||
      !walletForm.profileName.trim() ||
      !walletForm.walletAddress.trim() ||
      !walletForm.walletType ||
      !walletForm.referralCode.trim() ||
      !walletForm.email.trim() ||
      !walletForm.ensName.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios marcados com * na carteira principal.');
      return;
    }

    try {
      await walletService.savePrimaryWallet(walletForm);
      setSuccessMessage('Carteira principal salva com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setErrorMessage('Erro ao salvar carteira principal. Tente novamente.');
    }
  };

  const handleToggleSameAsPrimary = (checked: boolean) => {
    const updated: SecondaryWalletData = {
      sameAsPrimary: checked,
      isAdded: checked,
      address: checked ? walletForm.walletAddress : '',
      network: checked ? (walletForm.network as BlockchainNetwork) : undefined,
      nickname: checked ? `${walletForm.walletNickname || 'Carteira Principal'} (Cópia)` : '',
    };
    setSecondaryWallet(updated);
    walletService.saveSecondaryWallet(updated);
    if (checked) {
      setIsAddingSecondary(false);
      setSuccessMessage('Carteira secundária sincronizada com a principal.');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSaveSecondaryWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!secondaryForm.address.trim() || !secondaryForm.network || !secondaryForm.walletType) {
      setErrorMessage('Por favor, preencha os dados da carteira secundária.');
      return;
    }

    const updated: SecondaryWalletData = {
      sameAsPrimary: false,
      isAdded: true,
      address: secondaryForm.address,
      network: secondaryForm.network as BlockchainNetwork,
      nickname: secondaryForm.nickname || 'Carteira Secundária',
    };

    try {
      await walletService.saveSecondaryWallet(updated);
      setSecondaryWallet(updated);
      setIsAddingSecondary(false);
      setSuccessMessage('Carteira secundária adicionada com sucesso!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setErrorMessage('Erro ao salvar carteira secundária.');
    }
  };

  const handleRemoveSecondaryWallet = () => {
    const updated: SecondaryWalletData = {
      sameAsPrimary: false,
      isAdded: false,
      address: '',
      network: undefined,
      nickname: '',
    };
    setSecondaryWallet(updated);
    walletService.saveSecondaryWallet(updated);
    setSuccessMessage('Carteira secundária removida.');
    setTimeout(() => setSuccessMessage(null), 3000);
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
        
        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-950/40 border border-green-800/60 text-green-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Layout Grid: Sidebar Esquerda + Conteúdo Central (Figma Print Desktop / Carteiras) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sidebar Lateral "Meu perfil" (3 colunas no Desktop) */}
          <aside className="lg:col-span-3 bg-[#241612] border border-[#38220F] rounded-xl p-5 shadow-xl space-y-4">
            
            <h2 className="text-base font-bold text-[#CFB28C] tracking-wide px-2">
              Meu perfil
            </h2>

            {/* Menu de Navegação Vertical */}
            <nav className="space-y-1 text-xs">
              
              {/* 1. Dados do perfil */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('dados');
                  navigate({ to: '/perfil' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'dados'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <UserIcon className="w-4 h-4 text-[#D28A4C]" />
                <span>Dados do perfil</span>
              </button>

              {/* 2. Carteiras (Ativo no Print Desktop / Carteiras) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('carteiras');
                  navigate({ to: '/carteiras' });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left cursor-pointer ${
                  activeTab === 'carteiras'
                    ? 'border-l-2 border-[#D28A4C] bg-[#140D0A]/60 text-[#CFB28C] font-bold'
                    : 'text-[#CFB28C]/70 hover:text-[#CFB28C] hover:bg-[#140D0A]/30'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#D28A4C]" />
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
                <Clock className="w-4 h-4 text-[#CFB28C]/60" />
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
                <RotateCcw className="w-4 h-4 text-[#CFB28C]/60" />
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
                <AlertTriangle className="w-4 h-4 text-[#CFB28C]/60" />
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

            {/* Tab: Carteiras (Figma Print Desktop / Carteiras) */}
            {activeTab === 'carteiras' && (
              <div className="space-y-10 animate-in fade-in duration-200">
                
                {/* SEÇÃO 1: Carteira Principal */}
                <div>
                  {/* Cabeçalho */}
                  <div className="flex items-center justify-between pb-1">
                    <h2 className="text-base sm:text-lg font-bold text-[#CFB28C] tracking-wide">
                      Carteira principal
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setWalletForm({
                          displayName: '',
                          walletNickname: '',
                          network: '',
                          profileName: '',
                          walletAddress: '',
                          secondaryWalletOrEns: '',
                          walletType: '',
                          referralCode: '',
                          email: '',
                          ensName: '',
                        });
                        setSuccessMessage('Formulário pronto para vincular nova carteira principal.');
                        setTimeout(() => setSuccessMessage(null), 3000);
                      }}
                      className="text-xs text-[#E89B55] hover:text-[#D28A4C] font-semibold transition-colors cursor-pointer"
                    >
                      Adicionar
                    </button>
                  </div>

                  <p className="text-xs text-[#CFB28C]/60 mb-6">
                    Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
                  </p>

                  {/* Formulário Grid 2 Colunas */}
                  <form onSubmit={handleSavePrimaryWallet} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      
                      {/* Linha 1, Coluna 1: Nome de exibição* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Nome de exibição<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={walletForm.displayName}
                          onChange={(e) => setWalletForm({ ...walletForm, displayName: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors"
                        />
                      </div>

                      {/* Linha 1, Coluna 2: Apelido da carteira* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Apelido da carteira<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={walletForm.walletNickname}
                          onChange={(e) => setWalletForm({ ...walletForm, walletNickname: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors"
                        />
                      </div>

                      {/* Linha 2, Coluna 1: Rede * (Select) */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Rede <span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={walletForm.network}
                            onChange={(e) => setWalletForm({ ...walletForm, network: e.target.value as BlockchainNetwork })}
                            className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none transition-colors appearance-none pr-8 cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#140D0A] text-[#CFB28C]/40">
                              Selecione uma rede
                            </option>
                            <option value="Ethereum" className="bg-[#140D0A] text-[#CFB28C]">Ethereum</option>
                            <option value="Polygon" className="bg-[#140D0A] text-[#CFB28C]">Polygon</option>
                            <option value="Solana" className="bg-[#140D0A] text-[#CFB28C]">Solana</option>
                            <option value="Bitcoin" className="bg-[#140D0A] text-[#CFB28C]">Bitcoin</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-[#CFB28C]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Linha 2, Coluna 2: Nome do perfil* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Nome do perfil<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={walletForm.profileName}
                          onChange={(e) => setWalletForm({ ...walletForm, profileName: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors"
                        />
                      </div>

                      {/* Linha 3, Coluna 1: Endereço da carteira* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Endereço da carteira<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Endereço 0x da carteira"
                          value={walletForm.walletAddress}
                          onChange={(e) => setWalletForm({ ...walletForm, walletAddress: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors font-mono"
                        />
                      </div>

                      {/* Linha 3, Coluna 2: ENS ou carteira secundária (opcional) */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          ENS ou carteira secundária (opcional)
                        </label>
                        <input
                          type="text"
                          value={walletForm.secondaryWalletOrEns}
                          onChange={(e) => setWalletForm({ ...walletForm, secondaryWalletOrEns: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors font-mono"
                        />
                      </div>

                      {/* Linha 4, Coluna 1: Tipo de carteira* (Select) */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Tipo de carteira<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={walletForm.walletType}
                            onChange={(e) => setWalletForm({ ...walletForm, walletType: e.target.value as WalletType })}
                            className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none transition-colors appearance-none pr-8 cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#140D0A] text-[#CFB28C]/40">
                              Selecione uma carteira
                            </option>
                            <option value="MetaMask" className="bg-[#140D0A] text-[#CFB28C]">MetaMask</option>
                            <option value="Coinbase Wallet" className="bg-[#140D0A] text-[#CFB28C]">Coinbase Wallet</option>
                            <option value="WalletConnect" className="bg-[#140D0A] text-[#CFB28C]">WalletConnect</option>
                            <option value="Phantom" className="bg-[#140D0A] text-[#CFB28C]">Phantom</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-[#CFB28C]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      {/* Linha 4, Coluna 2: Código de indicação* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Código de indicação<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          value={walletForm.referralCode}
                          onChange={(e) => setWalletForm({ ...walletForm, referralCode: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors font-mono"
                        />
                      </div>

                      {/* Linha 5, Coluna 1: E-mail* */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          E-mail<span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <input
                          type="email"
                          value={walletForm.email}
                          onChange={(e) => setWalletForm({ ...walletForm, email: e.target.value })}
                          className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors"
                        />
                      </div>

                      {/* Linha 5, Coluna 2: Nome ENS * */}
                      <div>
                        <label className="block text-xs text-[#CFB28C] mb-1.5 font-medium">
                          Nome ENS <span className="text-[#E89B55] ml-0.5">*</span>
                        </label>
                        <div className="flex">
                          <div className="relative">
                            <select
                              value={ensPrefix}
                              onChange={(e) => setEnsPrefix(e.target.value)}
                              className="bg-[#140D0A] border border-r-0 border-[#38220F] focus:border-[#D28A4C] rounded-l-lg px-3 py-2.5 text-xs text-[#CFB28C] outline-none appearance-none pr-7 cursor-pointer"
                            >
                              <option value=".eth" className="bg-[#140D0A] text-[#CFB28C]">.eth</option>
                              <option value=".sol" className="bg-[#140D0A] text-[#CFB28C]">.sol</option>
                              <option value=".crypto" className="bg-[#140D0A] text-[#CFB28C]">.crypto</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-[#CFB28C]/60 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          <input
                            type="text"
                            value={walletForm.ensName}
                            onChange={(e) => setWalletForm({ ...walletForm, ensName: e.target.value })}
                            className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-r-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/30 outline-none transition-colors"
                          />
                        </div>
                      </div>

                    </div>

                    {/* Botão Salvar Carteira */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/15 cursor-pointer"
                      >
                        Salvar carteira
                      </button>
                    </div>
                  </form>
                </div>

                {/* SEÇÃO 2: Carteira Secundária */}
                <div className="pt-8 border-t border-[#38220F]/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                    <div>
                      <h3 className="text-base font-bold text-[#CFB28C] tracking-wide">
                        Carteira secundária
                      </h3>
                      <p className="text-xs text-[#CFB28C]/60 mt-1">
                        {secondaryWallet.isAdded
                          ? `Carteira secundária vinculada (${secondaryWallet.sameAsPrimary ? 'Igual à principal' : secondaryWallet.nickname || 'Personalizada'}).`
                          : 'Você ainda não adicionou uma carteira secundária.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      {/* Radio / Círculo Igual à carteira principal */}
                      <button
                        type="button"
                        onClick={() => handleToggleSameAsPrimary(!secondaryWallet.sameAsPrimary)}
                        className="flex items-center gap-2 text-xs text-[#CFB28C] hover:text-[#E89B55] transition-colors cursor-pointer select-none"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                            secondaryWallet.sameAsPrimary
                              ? 'border-[#D28A4C] bg-[#140D0A]'
                              : 'border-[#CFB28C]/60 bg-transparent'
                          }`}
                        >
                          {secondaryWallet.sameAsPrimary && (
                            <span className="w-2 h-2 rounded-full bg-[#D28A4C]" />
                          )}
                        </span>
                        <span>Igual à carteira principal</span>
                      </button>

                      {/* Link Adicionar */}
                      <button
                        type="button"
                        onClick={() => {
                          if (secondaryWallet.sameAsPrimary) {
                            handleToggleSameAsPrimary(false);
                          }
                          setIsAddingSecondary(!isAddingSecondary);
                        }}
                        className="text-xs text-[#E89B55] hover:text-[#D28A4C] font-semibold transition-colors cursor-pointer"
                      >
                        {isAddingSecondary ? 'Cancelar' : 'Adicionar'}
                      </button>
                    </div>
                  </div>

                  {/* Formulário Inline para Carteira Secundária quando isAddingSecondary for true */}
                  {isAddingSecondary && (
                    <form onSubmit={handleSaveSecondaryWallet} className="mt-4 p-5 bg-[#241612]/60 border border-[#38220F] rounded-xl space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#CFB28C] mb-1">Apelido da carteira secundária</label>
                          <input
                            type="text"
                            placeholder="Ex: Carteira Ledger / Reserva"
                            value={secondaryForm.nickname}
                            onChange={(e) => setSecondaryForm({ ...secondaryForm, nickname: e.target.value })}
                            className="w-full bg-[#140D0A] border border-[#38220F] rounded-lg px-3 py-2 text-xs text-[#CFB28C] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#CFB28C] mb-1">Rede *</label>
                          <select
                            value={secondaryForm.network}
                            onChange={(e) => setSecondaryForm({ ...secondaryForm, network: e.target.value as BlockchainNetwork })}
                            className="w-full bg-[#140D0A] border border-[#38220F] rounded-lg px-3 py-2 text-xs text-[#CFB28C] outline-none"
                          >
                            <option value="">Selecione uma rede</option>
                            <option value="Ethereum">Ethereum</option>
                            <option value="Polygon">Polygon</option>
                            <option value="Solana">Solana</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-[#CFB28C] mb-1">Endereço da carteira secundária *</label>
                          <input
                            type="text"
                            placeholder="Endereço 0x da carteira secundária"
                            value={secondaryForm.address}
                            onChange={(e) => setSecondaryForm({ ...secondaryForm, address: e.target.value })}
                            className="w-full bg-[#140D0A] border border-[#38220F] rounded-lg px-3 py-2 text-xs text-[#CFB28C] outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#CFB28C] mb-1">Tipo de carteira *</label>
                          <select
                            value={secondaryForm.walletType}
                            onChange={(e) => setSecondaryForm({ ...secondaryForm, walletType: e.target.value as WalletType })}
                            className="w-full bg-[#140D0A] border border-[#38220F] rounded-lg px-3 py-2 text-xs text-[#CFB28C] outline-none"
                          >
                            <option value="">Selecione uma carteira</option>
                            <option value="MetaMask">MetaMask</option>
                            <option value="Coinbase Wallet">Coinbase Wallet</option>
                            <option value="WalletConnect">WalletConnect</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-5 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Salvar carteira secundária
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingSecondary(false)}
                          className="bg-transparent border border-[#38220F] hover:bg-[#38220F]/40 text-[#CFB28C] text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Fechar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Exibição da Carteira Secundária Ativa quando não for formulário */}
                  {secondaryWallet.isAdded && !isAddingSecondary && (
                    <div className="mt-4 p-4 bg-[#241612]/40 border border-[#38220F]/60 rounded-xl flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#CFB28C] font-mono">
                            {secondaryWallet.nickname || 'Carteira Secundária'}
                          </span>
                          {secondaryWallet.sameAsPrimary && (
                            <span className="text-[10px] bg-[#D28A4C]/20 text-[#E89B55] px-2 py-0.5 rounded-full border border-[#D28A4C]/30">
                              Espelho da Principal
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#CFB28C]/60 font-mono">
                          {secondaryWallet.address || walletForm.walletAddress || '0x71C8360565ab8854E632310375776473060f641B'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveSecondaryWallet}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  )}

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
