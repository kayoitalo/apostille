# Arquitetura do Projeto

Este documento descreve a arquitetura e hierarquia completa do projeto, detalhando suas principais pastas e arquivos.

## Visão Geral

O projeto é uma aplicação Next.js moderna que utiliza TypeScript e segue as melhores práticas de desenvolvimento web. A estrutura do projeto é organizada da seguinte forma:

## Estrutura de Diretórios

### `/app`
- Contém a estrutura principal da aplicação usando o App Router do Next.js
- Responsável pela organização das rotas e páginas da aplicação

### `/components`
- Contém componentes reutilizáveis da interface do usuário
- Utiliza componentes do Radix UI para acessibilidade e consistência

### `/hooks`
- Contém hooks personalizados do React
- Fornece lógica reutilizável para diferentes partes da aplicação

### `/lib`
- Contém utilitários e funções auxiliares
- Bibliotecas e configurações compartilhadas

### `/prisma`
- Contém configurações e modelos do Prisma ORM
- Responsável pela camada de dados e migrações do banco de dados

### `/services`
- Contém serviços e integrações com APIs externas
- Lógica de negócios isolada

### `/src`
- Código-fonte adicional da aplicação
- Recursos complementares

## Arquivos Principais

### Configuração
- `next.config.ts` - Configurações do Next.js
- `tsconfig.json` - Configurações do TypeScript
- `package.json` - Dependências e scripts do projeto
- `tailwind.config.ts` - Configurações do Tailwind CSS
- `postcss.config.js` - Configurações do PostCSS
- `components.json` - Configurações de componentes

### Infraestrutura
- `middleware.ts` - Middleware do Next.js para autenticação e proteção de rotas

## Tecnologias Principais

### Frontend
- Next.js 15.2
- React 18.3
- TypeScript
- Tailwind CSS
- Radix UI (componentes de interface)

### Backend
- Prisma ORM
- NeonDB (PostgreSQL)
- Google Cloud Storage

### Autenticação e Segurança
- JWT (jsonwebtoken)
- bcrypt para criptografia
- Rate limiting com Upstash

### Ferramentas de Desenvolvimento
- ESLint
- Jest para testes
- Husky para git hooks
- PostCSS
- TypeScript

## Dependências Notáveis

### UI/UX
- Diversos componentes Radix UI para interface consistente e acessível
- React Hook Form para gestão de formulários
- Lucide React para ícones
- Next Themes para suporte a temas
- Tailwind para estilização

### Processamento de Dados
- PDF-lib e pdfjs-dist para manipulação de PDFs
- Recharts e react-chartjs-2 para visualização de dados

### Infraestrutura
- Prisma com adaptador Neon para banco de dados
- Google Cloud Storage para armazenamento
- Upstash para rate limiting

## Scripts Importantes

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "npm run migrate && next build",
  "migrate": "prisma generate && prisma migrate deploy",
  "start": "next start",
  "test": "jest"
}
```

## Padrões de Desenvolvimento

- Strict TypeScript com null checks
- ESModule com suporte a importações modernas
- Roteamento baseado em arquivo (Next.js App Router)
- Componentes isolados e reutilizáveis
- Integração contínua com testes automatizados
