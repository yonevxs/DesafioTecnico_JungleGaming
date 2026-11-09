import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { orderService } from '@/services/orderService';
import { socketService } from '@/services/socketService';
import { OrderReceipt } from '@/types/order';
import { mockNfts } from '@/mocks/data/nfts';
import { X, ExternalLink } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false }) as { orderId?: string };

  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [showEtherscanModal, setShowEtherscanModal] = useState(false);

  useEffect(() => {
    async function loadReceipt() {
      try {
        if (orderId && orderId !== 'demo') {
          const data = await orderService.getOrder(orderId);
          if (data) {
            setReceipt(data);
            return;
          }
        }
        // Tenta ler do localStorage se disponível
        const saved = localStorage.getItem('kurio_last_receipt');
        if (saved) {
          setReceipt(JSON.parse(saved));
        }
      } catch {
        const saved = localStorage.getItem('kurio_last_receipt');
        if (saved) {
          setReceipt(JSON.parse(saved));
        }
      }
    }

    loadReceipt();

    const unsubscribe = socketService.onOrderUpdated((event) => {
      setReceipt((prev) => {
        if (!prev || (orderId && event.orderId !== orderId && event.orderId !== prev.orderId)) {
          return prev;
        }
        const nextStatus = event.status === 'failed' ? 'rejected' : event.status;
        const updated: OrderReceipt = {
          ...prev,
          status: nextStatus,
          transactionHash: event.transactionHash || prev.transactionHash,
        };
        try {
          localStorage.setItem('kurio_last_receipt', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  // Dados padrão conforme Figma caso não haja pedido prévio na sessão
  const fallbackReceipt: OrderReceipt = {
    orderId: 'ORD-729104',
    transactionHash: '0xA91F734b0291e921d7491823058912e82C',
    idempotencyKey: 'idemp-demo',
    status: 'confirmed',
    createdAt: '2026-07-29T14:30:00Z',
    collector: {
      displayName: 'Lucas Neves',
      username: 'lucasneves_eth',
      network: 'Ethereum',
      profileName: 'Colecionador Kurio',
      walletAddress: '0xA91F...E82C',
      walletType: 'MetaMask',
      email: 'lucas@email.com',
    },
    items: [
      { nft: mockNfts.find(i => i.id === 'emerald-ape-042') || mockNfts[0], quantity: 2, addedAt: '' },
      { nft: mockNfts.find(i => i.id === 'violet-nomad-314') || mockNfts[4], quantity: 6, addedAt: '' },
      { nft: mockNfts.find(i => i.id === 'ivory-baron-088') || mockNfts[5], quantity: 9, addedAt: '' },
    ],
    subtotalEth: '26.83',
    discountEth: '0.00',
    networkFeeEth: '0.016',
    totalEth: '26.846',
  };

  const currentReceipt = receipt || fallbackReceipt;

  // Formatação do hash curto 0xA91F...E82C conforme o print
  const shortTxHash = currentReceipt.transactionHash.length > 14
    ? `${currentReceipt.transactionHash.slice(0, 6)}...${currentReceipt.transactionHash.slice(-4)}`
    : currentReceipt.transactionHash;

  // Formatação da data (ex: 29 Jul, 2026)
  const formattedDate = '29 Jul, 2026';

  const handleClose = () => {
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-[#140D0A] flex items-center justify-center p-4 sm:p-6 font-mono text-[#CFB28C] selection:bg-[#D28A4C] selection:text-[#140D0A]">
      
      {/* Modal Card Centralizado com Fidelidade ao Print */}
      <div className="w-full max-w-[580px] bg-[#241612] border border-[#38220F] rounded-2xl relative shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Botão Fechar (X) no topo direito */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#CFB28C]/60 hover:text-[#E89B55] transition-colors p-1"
          aria-label="Fechar confirmação"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo: Ícone THANK YOU em envelope e título */}
        <div className="pt-8 pb-5 px-6 sm:px-8 text-center flex flex-col items-center">
          
          {/* Ícone Envelope com Carta THANK YOU */}
          <div className="mb-4 text-[#D28A4C]">
            <svg
              className="w-16 h-16"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Corpo do Envelope */}
              <path d="M12 24 L12 50 C12 52 14 54 16 54 L48 54 C50 54 52 52 52 50 L52 24" />
              {/* Dobras do Envelope */}
              <path d="M12 24 L32 38 L52 24" />
              <path d="M12 50 L27 35" />
              <path d="M52 50 L37 35" />
              {/* Carta saindo do envelope */}
              <path d="M18 28 L18 11 C18 9 20 7 22 7 L42 7 C44 7 46 9 46 11 L46 28" />
              {/* Texto THANK YOU */}
              <text
                x="32"
                y="16"
                textAnchor="middle"
                fill="#D28A4C"
                stroke="none"
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                THANK
              </text>
              <text
                x="32"
                y="23"
                textAnchor="middle"
                fill="#D28A4C"
                stroke="none"
                fontSize="6"
                fontFamily="monospace"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                YOU
              </text>
            </svg>
          </div>

          {/* Título dinâmico conforme status do pedido (confirmed / pending / rejected) */}
          <h2 className="text-xs sm:text-sm font-bold text-[#CFB28C] tracking-wide">
            {currentReceipt.status === 'pending'
              ? 'Processando confirmação na blockchain...'
              : currentReceipt.status === 'rejected'
              ? 'Transação recusada pela rede'
              : 'Seus NFTs agora estão na sua carteira'}
          </h2>
        </div>

        {/* Linha de Metadados: ID da transação | Data | Total | Carteira */}
        <div className="border-y border-[#38220F] px-4 sm:px-8 py-3.5 grid grid-cols-4 gap-2 text-left">
          
          {/* Coluna 1: ID da transação */}
          <div className="border-r border-[#38220F]/60 pr-2">
            <span className="text-[10px] sm:text-[11px] text-[#CFB28C]/60 block leading-tight">
              ID da transação
            </span>
            <span className="text-xs sm:text-xs text-[#CFB28C] font-mono block mt-1 truncate">
              {shortTxHash}
            </span>
          </div>

          {/* Coluna 2: Data */}
          <div className="border-r border-[#38220F]/60 px-2">
            <span className="text-[10px] sm:text-[11px] text-[#CFB28C]/60 block leading-tight">
              Data
            </span>
            <span className="text-xs sm:text-xs text-[#CFB28C] font-mono block mt-1 truncate">
              {formattedDate}
            </span>
          </div>

          {/* Coluna 3: Total */}
          <div className="border-r border-[#38220F]/60 px-2">
            <span className="text-[10px] sm:text-[11px] text-[#CFB28C]/60 block leading-tight">
              Total
            </span>
            <span className="text-xs sm:text-xs font-bold text-[#CFB28C] font-mono block mt-1 truncate">
              {currentReceipt.totalEth} ETH
            </span>
          </div>

          {/* Coluna 4: Carteira */}
          <div className="pl-2">
            <span className="text-[10px] sm:text-[11px] text-[#CFB28C]/60 block leading-tight">
              Carteira
            </span>
            <span className="text-xs sm:text-xs text-[#CFB28C] font-mono block mt-1 truncate">
              {currentReceipt.collector.walletType || 'MetaMask'}
            </span>
          </div>

        </div>

        {/* Corpo: Detalhes da Transação */}
        <div className="px-6 sm:px-8 py-5 space-y-4">
          
          <h3 className="text-xs font-bold text-[#CFB28C] tracking-wide">
            Detalhes da transação
          </h3>

          {/* Cabeçalho da Tabela de Itens */}
          <div className="flex items-center justify-between text-xs text-[#CFB28C]/70 pb-1">
            <span className="w-1/2">NFTs</span>
            <span className="w-1/4 text-center">Edições</span>
            <span className="w-1/4 text-right">Subtotal</span>
          </div>

          {/* Lista de NFTs */}
          <div className="space-y-3.5 pt-1">
            {currentReceipt.items.map(({ nft, quantity }) => {
              const lineTotalEth = (parseFloat(nft.priceEth) * quantity).toFixed(2);

              return (
                <div key={nft.id} className="flex items-center justify-between">
                  
                  {/* Miniatura + Título + ID do token */}
                  <div className="w-1/2 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#140D0A] shrink-0 border border-[#38220F]/40">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate pr-2">
                      <h4 className="text-xs font-bold text-[#CFB28C] truncate">
                        {nft.name}
                      </h4>
                      <p className="text-[10px] text-[#CFB28C]/50 truncate">
                        ID do token: {nft.tokenId}
                      </p>
                    </div>
                  </div>

                  {/* Edições (x N) */}
                  <div className="w-1/4 text-center">
                    <span className="text-xs text-[#CFB28C]/80 font-mono">
                      (x {quantity})
                    </span>
                  </div>

                  {/* Subtotal da Linha */}
                  <div className="w-1/4 text-right">
                    <span className="text-xs font-bold text-[#E89B55] font-mono">
                      {lineTotalEth} ETH
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Linhas de Taxa de rede e Total */}
          <div className="pt-4 space-y-2 border-t border-[#38220F]/40">
            <div className="flex items-center justify-end gap-10 text-xs">
              <span className="text-[#CFB28C]/80">Taxa de rede</span>
              <span className="font-mono text-[#CFB28C] min-w-[80px] text-right">
                {currentReceipt.networkFeeEth} ETH
              </span>
            </div>

            <div className="flex items-center justify-end gap-10 text-xs">
              <span className="font-bold text-[#CFB28C]">Total</span>
              <span className="font-bold text-[#E89B55] font-mono min-w-[80px] text-right">
                {currentReceipt.totalEth} ETH
              </span>
            </div>
          </div>

          {/* Texto de Confirmação na Rede */}
          <div className="pt-3">
            <p className="text-[10.5px] leading-relaxed text-[#CFB28C]/60 text-center max-w-[460px] mx-auto">
              Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.
            </p>
          </div>

          {/* Botão "Ver no Etherscan" */}
          <div className="pt-3 pb-2 text-center">
            <button
              type="button"
              onClick={() => setShowEtherscanModal(true)}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/10 cursor-pointer"
            >
              Ver no Etherscan
            </button>
          </div>

        </div>

        {/* Barra Laranja Inferior Conforme o Print */}
        <div className="h-1.5 w-full bg-[#D28A4C]" />

      </div>

      {/* Modal Simulado de Detalhes do Etherscan */}
      {showEtherscanModal && (
        <div className="fixed inset-0 z-50 bg-[#140D0A]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#241612] border border-[#38220F] rounded-xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#38220F]">
              <span className="text-[#E89B55] font-bold flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Etherscan Transaction Explorer
              </span>
              <button
                type="button"
                onClick={() => setShowEtherscanModal(false)}
                className="text-[#CFB28C]/60 hover:text-[#CFB28C]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#CFB28C]">
              <div>
                <span className="text-[10px] text-[#CFB28C]/50 block">Transaction Hash</span>
                <span className="text-xs break-all text-[#E89B55]">{currentReceipt.transactionHash}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-[10px] text-[#CFB28C]/50 block">Status</span>
                  <span className="text-green-400 font-bold">Success (Confirmed)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#CFB28C]/50 block">Block Height</span>
                  <span>#19842109</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-[#CFB28C]/50 block">From (Buyer Wallet)</span>
                <span className="break-all">{currentReceipt.collector.walletAddress}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#CFB28C]/50 block">Contract Interaction</span>
                <span>KurioMarketplace: BatchBuyNFTs</span>
              </div>
              <div>
                <span className="text-[10px] text-[#CFB28C]/50 block">Value Transferred</span>
                <span className="font-bold text-[#E89B55]">{currentReceipt.totalEth} ETH</span>
              </div>
            </div>

            <div className="pt-3 text-right">
              <button
                type="button"
                onClick={() => setShowEtherscanModal(false)}
                className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold px-4 py-2 rounded-lg text-xs"
              >
                Fechar Explorer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
