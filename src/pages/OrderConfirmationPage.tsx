import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerksSection } from '@/components/home/PerksSection';
import { orderService } from '@/services/orderService';
import { OrderReceipt } from '@/types/order';
import { CheckCircle2, Copy, Check, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false }) as { orderId?: string };

  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceipt() {
      try {
        if (orderId) {
          const data = await orderService.getOrder(orderId);
          setReceipt(data);
        } else {
          // Tenta ler do localStorage se o param não estiver na URL
          const saved = localStorage.getItem('kurio_last_receipt');
          if (saved) setReceipt(JSON.parse(saved));
        }
      } catch {
        const saved = localStorage.getItem('kurio_last_receipt');
        if (saved) setReceipt(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [orderId]);

  const handleCopyHash = () => {
    if (receipt?.transactionHash) {
      navigator.clipboard.writeText(receipt.transactionHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#140D0A] text-[#CFB28C] flex flex-col font-mono selection:bg-[#D28A4C] selection:text-[#140D0A] animate-in fade-in duration-300">
      
      {/* Header */}
      <Header />

      <main className="flex-grow">
        
        {/* Breadcrumb: Início / Mercado / Confirmação */}
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
            <span className="text-[#CFB28C] font-semibold">Confirmação</span>
          </nav>
        </div>

        {/* Conteúdo de Confirmação */}
        <section className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="bg-[#241612] border border-[#38220F] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* Header de Status */}
            <div className="text-center space-y-4 pb-8 border-b border-[#38220F]/60">
              <div className="w-16 h-16 rounded-full bg-[#D28A4C]/15 border border-[#D28A4C]/40 mx-auto flex items-center justify-center text-[#E89B55] shadow-lg shadow-[#D28A4C]/10">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block text-[11px] font-bold tracking-widest text-[#E89B55] uppercase bg-[#D28A4C]/10 px-3 py-1 rounded-full border border-[#D28A4C]/30 mb-2">
                  Transação Confirmada na Rede
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-[#CFB28C]">
                  Parabéns pela sua nova aquisição!
                </h1>
                <p className="text-xs text-[#CFB28C]/60 mt-1 max-w-md mx-auto">
                  A propriedade digital dos seus NFTs foi registrada e transferida com sucesso para o endereço da sua carteira.
                </p>
              </div>
            </div>

            {/* Detalhes da Transação */}
            {receipt ? (
              <div className="py-8 space-y-6">
                
                {/* Hash e Pedido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#140D0A] p-4 rounded-xl border border-[#38220F]/60 space-y-1">
                    <span className="text-[10px] text-[#CFB28C]/50 uppercase tracking-wider block">
                      Número do Pedido
                    </span>
                    <span className="text-sm font-bold text-[#CFB28C] font-mono">
                      {receipt.orderId}
                    </span>
                  </div>

                  <div className="bg-[#140D0A] p-4 rounded-xl border border-[#38220F]/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#CFB28C]/50 uppercase tracking-wider block">
                        Hash da Transação
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="text-xs text-[#E89B55] hover:text-[#D28A4C] flex items-center gap-1 transition-colors"
                      >
                        {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHash ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <span className="text-xs font-mono text-[#CFB28C]/80 truncate block">
                      {receipt.transactionHash}
                    </span>
                  </div>
                </div>

                {/* Perfil e Carteira de Destino */}
                <div className="bg-[#140D0A] p-4 sm:p-5 rounded-xl border border-[#38220F]/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#CFB28C]">
                    <ShieldCheck className="w-4 h-4 text-[#E89B55]" />
                    <span>Dados do Colecionador e Carteira</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[#CFB28C]/50 block text-[10px]">Colecionador</span>
                      <span className="text-[#CFB28C] font-semibold">{receipt.collector.displayName || 'Colecionador'}</span>
                    </div>
                    <div>
                      <span className="text-[#CFB28C]/50 block text-[10px]">Rede Blockchain</span>
                      <span className="text-[#CFB28C] font-semibold">{receipt.collector.network || 'Ethereum'}</span>
                    </div>
                    <div>
                      <span className="text-[#CFB28C]/50 block text-[10px]">Carteira Utilizada</span>
                      <span className="text-[#CFB28C] font-semibold">{receipt.collector.walletType || 'Coinbase Wallet'}</span>
                    </div>
                  </div>
                </div>

                {/* Lista de NFTs Adquiridos */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#CFB28C] uppercase tracking-wider">
                    Itens Adquiridos ({receipt.items.reduce((acc, i) => acc + i.quantity, 0)})
                  </h3>

                  <div className="space-y-2">
                    {receipt.items.map(({ nft, quantity }) => (
                      <div
                        key={nft.id}
                        className="bg-[#140D0A] p-3.5 rounded-xl border border-[#38220F]/60 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={nft.image}
                            alt={nft.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#241612]"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-[#CFB28C]">{nft.name}</h4>
                            <span className="text-[10px] text-[#CFB28C]/50">ID do token: {nft.tokenId}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-[#CFB28C]/70 mr-2">(x {quantity})</span>
                          <span className="text-xs font-bold text-[#E89B55] font-mono">
                            {(parseFloat(nft.priceEth) * quantity).toFixed(2)} ETH
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo Final de Valores */}
                <div className="bg-[#140D0A] p-5 rounded-xl border border-[#38220F]/60 space-y-2 text-xs">
                  <div className="flex justify-between text-[#CFB28C]/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-[#CFB28C]">{receipt.subtotalEth} ETH</span>
                  </div>
                  {receipt.discountEth !== '0.00' && (
                    <div className="flex justify-between text-[#CFB28C]/70">
                      <span>Desconto Aplicado</span>
                      <span className="font-mono text-green-400">(-) {receipt.discountEth} ETH</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#CFB28C]/70">
                    <span>Taxa de Rede</span>
                    <span className="font-mono text-[#CFB28C]">{receipt.networkFeeEth} ETH</span>
                  </div>
                  <div className="border-t border-[#38220F]/60 pt-2 flex justify-between text-sm font-bold">
                    <span className="text-[#CFB28C]">Total Pago</span>
                    <span className="text-[#E89B55] font-mono">{receipt.totalEth} ETH</span>
                  </div>
                </div>

              </div>
            ) : loading ? (
              <div className="py-12 text-center text-xs text-[#CFB28C]/60">
                Carregando detalhes do recibo...
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-[#CFB28C]/60">
                Recibo processado com sucesso.
              </div>
            )}

            {/* Ações Finais */}
            <div className="pt-6 border-t border-[#38220F]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="w-full sm:w-auto bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-3.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Explorar Mais Coleções</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => alert('Link simulado da transação no Etherscan!')}
                className="w-full sm:w-auto text-xs text-[#CFB28C]/70 hover:text-[#E89B55] transition-colors py-2 flex items-center justify-center gap-1.5"
              >
                <span>Ver no Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </section>

        {/* Vantagens (W, C, D) + Newsletter */}
        <PerksSection />

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};
