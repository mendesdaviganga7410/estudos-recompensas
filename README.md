# NeuroFlow

Gerenciador de tarefas gamificado e focado em produtividade.

## Estrutura do Projeto

Este projeto utiliza uma arquitetura Web Vanilla profissional, estruturada em:

- `/src/core` - Configurações centrais, Firebase, Router e State.
- `/src/features` - Lógica de negócio e funcionalidades principais (Notificações, Onboarding).
- `/src/pages` - Scripts específicos por página (Hub, Panel, Comunidade).
- `/src/shared` - UI components, templates, modais e estilos compartilhados.
- `/src/styles` - Organização avançada de CSS globais, componentes e páginas.
- `/scripts` - Scripts utilitários do repositório.
- `/docs` - Documentação da arquitetura.

## Dependências
- Firebase (via CDN)
- CropperJS (via CDN)
- Google Fonts

## Hospedagem / Execução

Este projeto agora utiliza **Vite** como servidor de desenvolvimento e bundler para otimização em produção.

### Desenvolvimento Local
Para desenvolver com Hot Module Replacement (HMR) e atualizações automáticas, utilize:
```bash
npm install
npm run dev
```

### Build para Produção
Para gerar os arquivos otimizados, minificados e prontos para deploy:
```bash
npm run build
```
O Vite irá gerar uma pasta `dist/` com arquivos HTML, CSS e JS puros. Basta hospedar o conteúdo dessa pasta em serviços como GitHub Pages, Vercel ou Netlify.
