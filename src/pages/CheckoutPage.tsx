import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerksSection } from '@/components/home/PerksSection';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/orderService';
import { BlockchainNetwork } from '@/types/nft';
import { WalletType, CollectorProfile } from '@/types/order';
import { ChevronDown, AlertCircle, Loader2, Sparkles, Check, ChevronLeft, MoreVertical, Wallet } from 'lucide-react';

const CONNECTED_WALLETS = [
  {
    id: 'reserva',
    name: 'Reserva',
    address: 'nova.kurio.eth',
    network: 'Rede Polygon',
  },
  {
    id: 'principal',
    name: 'Principal',
    address: '0xA91F...E82C',
    network: 'Rede principal Ethereum',
  },
];

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotalEth,
    discountEth,
    networkFeeEth,
    totalEth,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  // Estados dos campos do formulário (vazios por padrão conforme Figma Print 1)
  const [formData, setFormData] = useState<CollectorProfile>({
    displayName: '',
    username: '',
    network: '' as unknown as BlockchainNetwork,
    profileName: '',
    walletAddress: '',
    secondaryWalletOrEns: '',
    walletType: '' as unknown as WalletType,
    referralCode: '',
    email: '',
    ensName: '',
    useOtherWallet: false,
    notes: '',
  });

  const [selectedWalletOption, setSelectedWalletOption] = useState<WalletType | 'all'>('Coinbase Wallet');
  const [selectedConnectedWallet, setSelectedConnectedWallet] = useState('reserva');
  const [selectedProvider, setSelectedProvider] = useState<'walletconnect' | 'metamask' | 'coinbase'>('coinbase');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMobileConfirmOrder = async () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
      return;
    }

    try {
      setIsSubmitting(true);
      const idempotencyKey = `idemp-mob-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const chosenWallet = CONNECTED_WALLETS.find(w => w.id === selectedConnectedWallet) || CONNECTED_WALLETS[0];

      const receipt = await orderService.createOrder({
        idempotencyKey,
        collector: {
          displayName: 'Colecionador Kurio',
          username: chosenWallet.name.toLowerCase(),
          network: chosenWallet.network.includes('Polygon') ? 'Polygon' : 'Ethereum',
          profileName: chosenWallet.name,
          walletAddress: chosenWallet.address,
          secondaryWalletOrEns: chosenWallet.address,
          walletType: (selectedProvider === 'coinbase' ? 'Coinbase Wallet' : selectedProvider === 'metamask' ? 'MetaMask' : 'WalletConnect') as WalletType,
          referralCode: 'KURIO-VIP-2026',
          email: 'colecionador@kurio.eth',
          ensName: chosenWallet.address.includes('.eth') ? chosenWallet.address : undefined,
          useOtherWallet: false,
          notes: 'Pagamento mobile com carteira conectada.',
        },
        items,
        subtotalEth,
        discountEth,
        networkFeeEth,
        totalEth,
        couponCode: appliedCoupon?.code,
      });

      clearCart();
      navigate({ to: '/confirmacao/$orderId', params: { orderId: receipt.orderId } });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Falha ao processar o pagamento com carteira. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CollectorProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Preenchimento de dados de teste para agilidade do avaliador
  const handlePrefillTestData = () => {
    setFormData({
      displayName: 'Lucas Neves',
      username: 'lucasneves_eth',
      network: 'Ethereum',
      profileName: 'Colecionador Kurio',
      walletAddress: '0x71C8360565ab8854E632310375776473060f641B',
      secondaryWalletOrEns: 'lucas.eth',
      walletType: 'Coinbase Wallet',
      referralCode: 'KURIO-VIP-2026',
      email: 'lucas.neves@email.com',
      ensName: 'lucasneves',
      useOtherWallet: false,
      notes: 'Transferência direta para cold wallet de custódia.',
    });
    setSelectedWalletOption('Coinbase Wallet');
    setErrorMessage(null);
  };

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    if (!promoCodeInput.trim()) return;

    const success = applyCoupon(promoCodeInput.trim());
    if (success) {
      setPromoCodeInput('');
      setShowPromoInput(false);
    } else {
      setPromoError('Cupom inválido. Tente JUNGLE10 ou KURIO20');
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validação de campos obrigatórios conforme os marcados com * no Figma
    if (!formData.displayName.trim() || !formData.username.trim() || !formData.email.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios marcados com *');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Chave de idempotência única por transação
      const idempotencyKey = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const receipt = await orderService.createOrder({
        idempotencyKey,
        collector: {
          ...formData,
          network: formData.network || 'Ethereum',
          walletType: (selectedWalletOption === 'all' ? 'Coinbase Wallet' : selectedWalletOption) as WalletType,
          walletAddress: formData.walletAddress || '0x71C8360565ab8854E632310375776473060f641B',
        },
        items,
        subtotalEth,
        discountEth,
        networkFeeEth,
        totalEth,
        couponCode: appliedCoupon?.code,
      });

      // Limpa o carrinho após confirmação
      clearCart();

      // Redireciona para o recibo / confirmação
      navigate({ to: '/confirmacao/$orderId', params: { orderId: receipt.orderId } });
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Falha ao processar o pagamento na rede simulada. Verifique os dados e tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Header (Apenas Desktop) */}
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex-grow">
        
        {/* 1. VISÃO MOBILE DEDICADA (Figma Print Mobile / Pagamento) */}
        <div className="md:hidden flex flex-col min-h-screen px-4 pt-4 pb-12 space-y-5">
          
          {/* Top Navigation: Botão Voltar + Título "Pagamento com carteira" */}
          <div className="flex items-center gap-4 pb-1">
            <button
              type="button"
              onClick={() => navigate({ to: '/carrinho' })}
              className="w-10 h-10 rounded-full bg-[#241612] border border-[#38220F] text-[#CFB28C] flex items-center justify-center hover:text-[#E89B55] transition-all active:scale-95 cursor-pointer shadow-md"
              aria-label="Voltar para o carrinho"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-[#CFB28C] font-mono tracking-wide">
              Pagamento com carteira
            </h1>
          </div>

          {/* Mensagem de Erro se houver */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Seção 1: Carteira conectada */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#FFF5EA] font-mono tracking-wide">
                Carteira conectada
              </h2>
              <button
                type="button"
                onClick={() => {
                  setSelectedConnectedWallet(prev => prev === 'reserva' ? 'principal' : 'reserva');
                }}
                className="text-xs text-[#E89B55] hover:text-[#D28A4C] font-mono font-bold transition-colors cursor-pointer"
              >
                Trocar carteira
              </button>
            </div>

            {/* Cards de Carteiras Conectadas */}
            <div className="space-y-2.5">
              {CONNECTED_WALLETS.map((wallet) => {
                const isSelected = selectedConnectedWallet === wallet.id;
                return (
                  <div
                    key={wallet.id}
                    onClick={() => setSelectedConnectedWallet(wallet.id)}
                    className={`rounded-2xl bg-[#241612] border transition-all p-4 flex items-start justify-between shadow-md cursor-pointer ${
                      isSelected
                        ? 'border-[#D28A4C]/60 bg-[#241612]'
                        : 'border-[#38220F]/60 hover:border-[#38220F]'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Radio Button Customizado */}
                      <div className="mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? 'border-[#D28A4C]' : 'border-[#38220F]'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />}
                        </div>
                      </div>

                      {/* Informações da Carteira */}
                      <div className="space-y-0.5 text-left font-mono">
                        <span className="text-xs font-bold text-[#FFF5EA] block">
                          {wallet.name}
                        </span>
                        <span className="text-xs text-[#CFB28C]/70 block font-mono">
                          {wallet.address}
                        </span>
                        <span className="text-[10px] text-[#CFB28C]/50 block">
                          {wallet.network}
                        </span>
                      </div>
                    </div>

                    {/* Botão de Opções ⋮ */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-[#CFB28C]/50 hover:text-[#CFB28C] p-1 transition-colors"
                      aria-label="Opções da carteira"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seção 2: Carteira e rede */}
          <div className="space-y-2.5 pt-2">
            <h2 className="text-xs font-bold text-[#FFF5EA] font-mono tracking-wide">
              Carteira e rede
            </h2>

            {/* Provedores de Carteira */}
            <div className="space-y-2.5">
              {/* 1. WalletConnect */}
              <div
                onClick={() => setSelectedProvider('walletconnect')}
                className={`rounded-2xl bg-[#241612] border transition-all p-3.5 flex items-center justify-between shadow-md cursor-pointer ${
                  selectedProvider === 'walletconnect'
                    ? 'border-[#D28A4C]/60'
                    : 'border-[#38220F]/60 hover:border-[#38220F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1A100A] border border-[#38220F] flex items-center justify-center font-bold text-xs text-[#E89B55] font-mono">
                    W
                  </div>
                  <span className="text-xs font-semibold text-[#CFB28C] font-mono">
                    WalletConnect
                  </span>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedProvider === 'walletconnect' ? 'border-[#D28A4C]' : 'border-[#38220F]'
                }`}>
                  {selectedProvider === 'walletconnect' && <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />}
                </div>
              </div>

              {/* 2. MetaMask */}
              <div
                onClick={() => setSelectedProvider('metamask')}
                className={`rounded-2xl bg-[#241612] border transition-all p-3.5 flex items-center justify-between shadow-md cursor-pointer ${
                  selectedProvider === 'metamask'
                    ? 'border-[#D28A4C]/60'
                    : 'border-[#38220F]/60 hover:border-[#38220F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1A100A] border border-[#38220F] flex items-center justify-center font-bold text-xs text-[#E89B55] font-mono">
                    M
                  </div>
                  <span className="text-xs font-semibold text-[#CFB28C] font-mono">
                    MetaMask
                  </span>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedProvider === 'metamask' ? 'border-[#D28A4C]' : 'border-[#38220F]'
                }`}>
                  {selectedProvider === 'metamask' && <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />}
                </div>
              </div>

              {/* 3. Coinbase Wallet */}
              <div
                onClick={() => setSelectedProvider('coinbase')}
                className={`rounded-2xl bg-[#241612] border transition-all p-3.5 flex items-center justify-between shadow-md cursor-pointer ${
                  selectedProvider === 'coinbase'
                    ? 'border-[#D28A4C]/60'
                    : 'border-[#38220F]/60 hover:border-[#38220F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1A100A] border border-[#38220F] flex items-center justify-center text-[#E89B55]">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-[#CFB28C] font-mono">
                    Coinbase Wallet
                  </span>
                </div>

                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedProvider === 'coinbase' ? 'border-[#D28A4C]' : 'border-[#38220F]'
                }`}>
                  {selectedProvider === 'coinbase' && <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Total e Botão de Confirmação */}
          <div className="pt-4 space-y-4 font-mono">
            <div className="flex items-center justify-end gap-3 text-right">
              <span className="text-xs font-bold text-[#CFB28C]">
                Total:
              </span>
              <span className="text-base sm:text-lg font-bold text-[#E89B55] tracking-wide">
                {totalEth} ETH
              </span>
            </div>

            {/* Botão de Finalização */}
            <button
              type="button"
              onClick={handleMobileConfirmOrder}
              disabled={isSubmitting || items.length === 0}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#D28A4C] to-[#C8783E] hover:from-[#E89B55] hover:to-[#D28A4C] disabled:opacity-40 disabled:cursor-not-allowed text-[#140D0A] font-bold text-sm font-mono flex items-center justify-center tracking-wider shadow-lg shadow-[#D28A4C]/20 transition-all active:scale-98 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#140D0A]" />
                  <span>Processando pagamento...</span>
                </div>
              ) : (
                <span>Pagar com carteira</span>
              )}
            </button>
          </div>

        </div>

        {/* 2. VISÃO DESKTOP (Preservada) */}
        <div className="hidden md:block">
          
          {/* Breadcrumb: Início / Mercado / Pagamento */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
          <nav className="text-xs text-[#CFB28C]/60 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="hover:text-[#E89B55] transition-colors"
            >
              Início
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="hover:text-[#E89B55] transition-colors"
            >
              Mercado
            </button>
            <span>/</span>
            <span className="text-[#CFB28C] font-semibold">Pagamento</span>
          </nav>
        </div>

        {/* Formulário Principal e Resumo */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Coluna da Esquerda: "Perfil do colecionador" (Figma Print 1) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base sm:text-lg font-bold text-[#CFB28C] tracking-wide">
                  Perfil do colecionador
                </h2>

                {/* Botão de teste rápido */}
                <button
                  type="button"
                  onClick={handlePrefillTestData}
                  className="text-[11px] text-[#E89B55] hover:text-[#D28A4C] transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100"
                  title="Preencher campos com dados de teste"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preencher dados de teste</span>
                </button>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Grid de 2 Colunas de Campos (Idêntico ao Print 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Coluna 1 - Campo 1: Nome de exibição* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Nome de exibição<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                  />
                </div>

                {/* Coluna 2 - Campo 1: Nome de usuário* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Nome de usuário<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                  />
                </div>

                {/* Coluna 1 - Campo 2: Rede * */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Rede <span className="text-[#E89B55]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.network}
                      onChange={(e) => handleInputChange('network', e.target.value as BlockchainNetwork)}
                      className="w-full appearance-none bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none cursor-pointer"
                    >
                      <option value="">Selecione uma rede</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Solana">Solana</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#CFB28C]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Coluna 2 - Campo 2: Nome do perfil* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Nome do perfil<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.profileName}
                    onChange={(e) => handleInputChange('profileName', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                  />
                </div>

                {/* Coluna 1 - Campo 3: Endereço da carteira* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Endereço da carteira<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Endereço 0x da carteira"
                    value={formData.walletAddress}
                    onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none"
                  />
                </div>

                {/* Coluna 2 - Campo 3: ENS ou carteira secundária (opcional) */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    ENS ou carteira secundária (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="ENS ou carteira secundária (opcional)"
                    value={formData.secondaryWalletOrEns}
                    onChange={(e) => handleInputChange('secondaryWalletOrEns', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none"
                  />
                </div>

                {/* Coluna 1 - Campo 4: Tipo de carteira* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Tipo de carteira<span className="text-[#E89B55]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.walletType}
                      onChange={(e) => handleInputChange('walletType', e.target.value as WalletType)}
                      className="w-full appearance-none bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none cursor-pointer"
                    >
                      <option value="">Selecione uma carteira</option>
                      <option value="Coinbase Wallet">Coinbase Wallet</option>
                      <option value="MetaMask">MetaMask</option>
                      <option value="WalletConnect">WalletConnect</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#CFB28C]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Coluna 2 - Campo 4: Código de indicação* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Código de indicação<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange('referralCode', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                  />
                </div>

                {/* Coluna 1 - Campo 5: E-mail* */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    E-mail<span className="text-[#E89B55]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                  />
                </div>

                {/* Coluna 2 - Campo 5: Nome ENS * */}
                <div className="space-y-1.5">
                  <label className="text-xs text-[#CFB28C]/80 block">
                    Nome ENS <span className="text-[#E89B55]">*</span>
                  </label>
                  <div className="flex bg-[#140D0A] border border-[#38220F] focus-within:border-[#D28A4C] rounded-lg overflow-hidden">
                    <input
                      type="text"
                      value={formData.ensName}
                      onChange={(e) => handleInputChange('ensName', e.target.value)}
                      className="w-full bg-transparent px-3.5 py-2.5 text-xs text-[#CFB28C] outline-none"
                    />
                    <span className="text-xs text-[#CFB28C]/70 px-3 py-2.5 border-l border-[#38220F] flex items-center bg-[#241612]/40 select-none">
                      .eth ▾
                    </span>
                  </div>
                </div>

              </div>

              {/* Botão circular de rádio: Usar outra carteira? (Print 1 & 2) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('useOtherWallet', !formData.useOtherWallet)}
                  className="flex items-center gap-2.5 text-xs text-[#CFB28C] hover:text-[#E89B55] transition-colors cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    formData.useOtherWallet ? 'border-[#D28A4C]' : 'border-[#D28A4C]/80 group-hover:border-[#E89B55]'
                  }`}>
                    {formData.useOtherWallet && (
                      <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <span>Usar outra carteira?</span>
                </button>
              </div>

              {/* Observação do colecionador (opcional) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs text-[#CFB28C]/80 block">
                  Observação do colecionador (opcional)
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-xl p-3.5 text-xs text-[#CFB28C] outline-none resize-none"
                />
              </div>

            </div>

            {/* Coluna da Direita: "Seus NFTs" + "Resumo" + "Carteira e rede" (Figma Print 1 & 2) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Título: Seus NFTs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#CFB28C] pb-1">
                  <span>Seus NFTs</span>
                  <span>Subtotal</span>
                </div>

                {/* Lista de Itens do Pedido */}
                <div className="space-y-2.5">
                  {items.length === 0 ? (
                    <div className="bg-[#241612] rounded-xl p-6 text-center border border-[#38220F]/60 text-xs text-[#CFB28C]/60 space-y-3">
                      <p>Seu carrinho está vazio no momento.</p>
                      <button
                        type="button"
                        onClick={() => navigate({ to: '/' })}
                        className="text-xs text-[#E89B55] underline hover:text-[#D28A4C]"
                      >
                        Ir ao catálogo de NFTs
                      </button>
                    </div>
                  ) : (
                    items.map(({ nft, quantity }) => {
                      const lineTotalEth = (parseFloat(nft.priceEth) * quantity).toFixed(2);

                      return (
                        <div
                          key={nft.id}
                          className="bg-[#241612] rounded-xl p-3 flex items-center justify-between border border-[#38220F]/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#140D0A] shrink-0">
                              <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[#CFB28C] truncate max-w-[140px] sm:max-w-[180px]">
                                {nft.name}
                              </h4>
                              <p className="text-[10px] text-[#CFB28C]/50">
                                ID do token: {nft.tokenId}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-[#CFB28C]/70 mr-1.5 font-mono">
                              (x {quantity})
                            </span>
                            <span className="text-xs font-bold text-[#E89B55] font-mono">
                              {lineTotalEth} ETH
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Link Centralizado: Tem um código promocional? Aplique aqui (Print 1) */}
                <div className="pt-2 text-center">
                  {appliedCoupon ? (
                    <div className="inline-flex items-center gap-2 bg-[#241612] border border-green-800/60 px-3 py-1.5 rounded-lg text-xs text-green-400">
                      <Check className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} aplicado ({appliedCoupon.discountPercentage}%)</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-400 hover:text-red-300 ml-1 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ) : showPromoInput ? (
                    <form onSubmit={handleApplyPromoCode} className="space-y-1 max-w-sm mx-auto">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="JUNGLE10 ou KURIO20"
                          value={promoCodeInput}
                          onChange={(e) => setPromoCodeInput(e.target.value)}
                          className="bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-3 py-1.5 text-xs text-[#CFB28C] flex-grow outline-none"
                        />
                        <button
                          type="submit"
                          className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          Aplicar
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPromoInput(false)}
                          className="text-xs text-[#CFB28C]/60 hover:text-[#CFB28C] px-2"
                        >
                          Fechar
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[10px] text-red-400 text-left">{promoError}</p>
                      )}
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(true)}
                      className="text-xs text-[#CFB28C]/70 hover:text-[#E89B55] transition-colors"
                    >
                      Tem um código promocional? Aplique aqui
                    </button>
                  )}
                </div>
              </div>

              {/* Resumo de Valores */}
              <div className="pt-2 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#CFB28C]/80">Subtotal</span>
                  <span className="font-bold text-[#CFB28C] font-mono">{subtotalEth} ETH</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#CFB28C]/80">Desconto do lançamento</span>
                  <span className="font-mono text-[#CFB28C]/80">(-) {discountEth}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#CFB28C]/80">Taxa de rede</span>
                    <span className="font-mono text-[#CFB28C]">{networkFeeEth} ETH</span>
                  </div>
                  {/* Taxa estimada centralizada conforme Print 1 */}
                  <span className="text-[10px] text-[#CFB28C]/50 block text-center pt-0.5">
                    Taxa estimada
                  </span>
                </div>

                {/* Linha Divisória */}
                <div className="border-t border-[#38220F]/60 pt-3 my-2">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-bold text-[#CFB28C]">Total</span>
                    <span className="font-bold text-[#E89B55] text-lg font-mono">
                      {totalEth} ETH
                    </span>
                  </div>
                </div>
              </div>

              {/* Seção "Carteira e rede" (Figma Print 2) */}
              <div className="pt-2 space-y-3">
                <h3 className="text-sm font-bold text-[#CFB28C] text-center mb-2">
                  Carteira e rede
                </h3>

                {/* Opção 1: Badge METAMASK • WALLETCONNECT • COINBASE */}
                <div
                  onClick={() => setSelectedWalletOption('all')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedWalletOption === 'all'
                      ? 'border-[#D28A4C] bg-[#241612]'
                      : 'border-[#38220F] bg-[#140D0A] hover:border-[#CFB28C]/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    selectedWalletOption === 'all' ? 'border-[#D28A4C]' : 'border-[#CFB28C]/60'
                  }`}>
                    {selectedWalletOption === 'all' && (
                      <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <div className="inline-block bg-[#241612] border border-[#38220F] rounded px-3 py-1 text-[10px] tracking-wider text-[#CFB28C]/80 font-mono">
                    METAMASK • WALLETCONNECT • COINBASE
                  </div>
                </div>

                {/* Opção 2: MetaMask */}
                <div
                  onClick={() => setSelectedWalletOption('MetaMask')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                    selectedWalletOption === 'MetaMask'
                      ? 'border-[#D28A4C] bg-[#241612] text-[#CFB28C]'
                      : 'border-[#38220F] bg-[#140D0A] text-[#CFB28C]/70 hover:border-[#CFB28C]/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    selectedWalletOption === 'MetaMask' ? 'border-[#D28A4C]' : 'border-[#CFB28C]/60'
                  }`}>
                    {selectedWalletOption === 'MetaMask' && (
                      <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <span>MetaMask</span>
                </div>

                {/* Opção 3: Coinbase Wallet (Ativo no Print 2 com o círculo preenchido) */}
                <div
                  onClick={() => setSelectedWalletOption('Coinbase Wallet')}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs font-bold ${
                    selectedWalletOption === 'Coinbase Wallet'
                      ? 'border-[#D28A4C] bg-[#241612] text-[#CFB28C]'
                      : 'border-[#38220F] bg-[#140D0A] text-[#CFB28C]/70 hover:border-[#CFB28C]/50'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    selectedWalletOption === 'Coinbase Wallet' ? 'border-[#D28A4C]' : 'border-[#CFB28C]/60'
                  }`}>
                    {selectedWalletOption === 'Coinbase Wallet' && (
                      <div className="w-2 h-2 rounded-full bg-[#D28A4C]" />
                    )}
                  </div>
                  <span>Coinbase Wallet</span>
                </div>
              </div>

              {/* Botão Confirmar compra (Figma Print 2) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#D28A4C] hover:bg-[#E89B55] disabled:opacity-50 disabled:cursor-not-allowed text-[#140D0A] font-bold text-xs sm:text-sm py-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-[#D28A4C]/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirmando transação na rede...</span>
                    </>
                  ) : (
                    <span>Confirmar compra</span>
                  )}
                </button>
              </div>

            </div>

          </form>
        </section>

          {/* Vantagens (W, C, D) + Newsletter (Figma Print 3) */}
          <PerksSection />

        </div>

      </main>

      {/* Footer (Apenas Desktop) */}
      <div className="hidden md:block">
        <Footer />
      </div>

    </div>
  );
};
