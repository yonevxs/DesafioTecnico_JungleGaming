import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#140D0A] text-[#CFB28C] border-t border-[#38220F]/80">
      
      {/* Contact & Brand Bar from Print 5 */}
      <div className="bg-[#241612] border-b border-[#38220F] py-4 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[#CFB28C]/80 gap-3">
          <span className="font-bold tracking-widest text-[#CFB28C]">KURIO</span>
          <span className="hidden md:inline text-center">Feito para colecionadores, criadores e cultura</span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#CFB28C]/90 font-mono">
            <a href="mailto:contato@email.com" className="hover:text-[#E89B55] transition-colors">
              contato@email.com
            </a>
            <span>+55 11 4002 8922</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Meu Perfil */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#CFB28C] mb-1">
              Meu perfil
            </h4>
            <ul className="space-y-2 text-xs text-[#CFB28C]/70">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Meu perfil</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Minha coleção</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Atividade</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Estúdio do criador</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Lista de interesse</a></li>
            </ul>
          </div>

          {/* Col 2: Central de Ajuda */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#CFB28C] mb-1">
              Central de ajuda
            </h4>
            <ul className="space-y-2 text-xs text-[#CFB28C]/70">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Como comprar NFTs</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Carteira e segurança</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Política do mercado</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Denunciar item</a></li>
            </ul>
          </div>

          {/* Col 3: Coleções */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-sm font-bold text-[#CFB28C] mb-1">
              Coleções
            </h4>
            <ul className="space-y-2 text-xs text-[#CFB28C]/70">
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Arte digital</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Fotografia</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Música</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Arte 3D</a></li>
              <li><a href="#" className="hover:text-[#E89B55] transition-colors">Utilidade</a></li>
            </ul>
          </div>

          {/* Col 4 & 5: Redes Sociais & Carteiras */}
          <div className="col-span-2 flex flex-col space-y-6">
            
            {/* Social Icons with SVG */}
            <div>
              <h4 className="text-sm font-bold text-[#CFB28C] mb-3">
                Redes sociais
              </h4>
              <div className="flex items-center space-x-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook da Kurio"
                  className="w-8 h-8 rounded-lg bg-[#241612] border border-[#38220F] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7v-3h3V9.5C10 6.46 11.82 5 14.54 5c1.3 0 2.43.1 2.76.14v3.2h-1.89c-1.47 0-1.76.7-1.76 1.73V12h3.55l-.46 3h-3.09v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram da Kurio"
                  className="w-8 h-8 rounded-lg bg-[#241612] border border-[#38220F] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                {/* Twitter / X */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter) da Kurio"
                  className="w-8 h-8 rounded-lg bg-[#241612] border border-[#38220F] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn da Kurio"
                  className="w-8 h-8 rounded-lg bg-[#241612] border border-[#38220F] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube da Kurio"
                  className="w-8 h-8 rounded-lg bg-[#241612] border border-[#38220F] flex items-center justify-center text-[#CFB28C] hover:text-[#E89B55] hover:border-[#D28A4C] transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Compatible Wallets */}
            <div>
              <h4 className="text-sm font-bold text-[#CFB28C] mb-2">
                Carteiras compatíveis
              </h4>
              <div className="inline-block bg-[#241612] border border-[#38220F] rounded-lg px-4 py-2 text-[10px] tracking-wider text-[#CFB28C]/80 font-mono">
                METAMASK • WALLETCONNECT • COINBASE
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-[#38220F]/60 mt-12 pt-8 text-center text-xs text-[#CFB28C]/60">
          <p>© 2026 Kurio. Propriedade digital para todos.</p>
        </div>

      </div>

    </footer>
  );
};
