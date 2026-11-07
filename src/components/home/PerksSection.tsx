import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export const PerksSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="w-full bg-[#1c110d] border-t border-b border-[#38220F]/60 py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Perks Columns (W, C, D) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            {/* Perk 1: W */}
            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-lg shadow-md shadow-[#D28A4C]/20">
                W
              </div>
              <h3 className="text-sm font-bold text-[#CFB28C]">
                Segurança da carteira
              </h3>
              <p className="text-xs text-[#CFB28C]/70 leading-relaxed">
                Proteja sua carteira e colecione arte digital verificada com confiança.
              </p>
            </div>

            {/* Perk 2: C */}
            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-lg shadow-md shadow-[#D28A4C]/20">
                C
              </div>
              <h3 className="text-sm font-bold text-[#CFB28C]">
                Criadores em destaque
              </h3>
              <p className="text-xs text-[#CFB28C]/70 leading-relaxed">
                Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
              </p>
            </div>

            {/* Perk 3: D */}
            <div className="flex flex-col items-start space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#D28A4C] text-[#140D0A] flex items-center justify-center font-bold text-lg shadow-md shadow-[#D28A4C]/20">
                D
              </div>
              <h3 className="text-sm font-bold text-[#CFB28C]">
                Alertas de lançamentos
              </h3>
              <p className="text-xs text-[#CFB28C]/70 leading-relaxed">
                Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
              </p>
            </div>

          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-5 flex flex-col justify-center bg-[#241612]/70 border border-[#38220F] rounded-2xl p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-[#CFB28C] mb-3">
              Antecipe-se ao próximo lançamento
            </h3>

            {subscribed ? (
              <div className="flex items-center gap-2 text-green-400 text-sm py-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Obrigado! Seu e-mail foi cadastrado com sucesso na lista VIP da Kurio.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="email"
                  required
                  placeholder="digite seu e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#140D0A] border border-[#38220F] focus:border-[#D28A4C] rounded-lg px-4 py-2.5 text-xs text-[#CFB28C] placeholder-[#CFB28C]/40 outline-none flex-grow"
                />
                <button
                  type="submit"
                  className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold text-xs px-6 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-[#D28A4C]/10"
                >
                  Enviar
                </button>
              </form>
            )}

            <p className="text-[11px] text-[#CFB28C]/60 leading-relaxed">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
