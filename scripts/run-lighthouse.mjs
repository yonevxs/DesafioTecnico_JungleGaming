import fs from 'node:fs';
import path from 'node:path';

const reportDir = path.resolve(process.cwd(), 'lighthouse-reports');
const summaryPath = path.join(reportDir, 'summary.json');

console.log('==========================================================');
console.log(' Kurio NFT Marketplace — Relatório de Auditoria Lighthouse');
console.log('==========================================================\n');

if (fs.existsSync(summaryPath)) {
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  console.table(
    summary.results.map((r) => ({
      Página: r.page,
      Perfil: r.profile,
      Medições: r.runs,
      Performance: r.median.performance,
      Accessibility: r.median.accessibility,
      'Best Practices': r.median.bestPractices,
      SEO: r.median.seo,
      LCP: r.metrics.lcp,
      CLS: r.metrics.cls,
      TBT: r.metrics.tbt,
    }))
  );
  console.log('\nRelatórios completos disponíveis em: ./lighthouse-reports/');
} else {
  console.log('Arquivo summary.json não encontrado em ./lighthouse-reports/');
}

