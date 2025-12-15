# Frontend

Aplicação frontend do projeto Aprove-me construída com Next.js, React e TypeScript. A aplicação consome o API Gateway (BFF) para comunicação com os microserviços backend.

## Overview

O frontend é uma aplicação web desenvolvida com Next.js 16 utilizando App Router, React 19, TypeScript e Tailwind CSS. A arquitetura segue padrões de Feature-Based Development, com separação clara de responsabilidades e componentes reutilizáveis.

## Tech Stack

### Core

- **Next.js 16.0.0**
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS**

### State Management & Data Fetching

- **TanStack Query (React Query)**: Gerenciamento de estado servidor e cache
- **React Context API**: Gerenciamento de estado global (autenticação)

### Forms & Validation

- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de schemas
- **@hookform/resolvers**: Integração React Hook Form + Zod

### UI Components

- **Radix UI**: Componentes primitivos acessíveis
- **shadcn/ui**: Sistema de componentes baseado em Radix UI
- **Lucide React**: Biblioteca de ícones
- **Framer Motion**: Animações

### Utilities

- **Axios**: Cliente HTTP
- **date-fns**: Manipulação de datas
- **jwt-decode**: Decodificação de tokens JWT
- **Sonner**: Sistema de notificações toast

### Testing

- **Jest**: Framework de testes
- **React Testing Library**: Utilitários para testes de componentes
- **@testing-library/jest-dom**: Matchers customizados para DOM

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Rotas do dashboard
│   │   ├── assignors/           # Páginas de cedentes
│   │   └── payables/            # Páginas de recebíveis
│   ├── login/                   # Página de login
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Página inicial
├── src/
│   ├── components/              # Componentes compartilhados
│   │   ├── layout/             # Componentes de layout
│   │   └── ui/                 # Componentes UI base (shadcn/ui)
│   ├── features/               # Features organizadas por domínio
│   │   ├── auth/               # Autenticação
│   │   ├── assignors/          # Cedentes
│   │   ├── payables/           # Recebíveis
│   │   ├── batch/              # Processamento em lote
│   │   └── dashboard/          # Dashboard
│   ├── services/               # Serviços de API
│   │   └── api/                # Cliente HTTP e interceptors
│   ├── helpers/                # Utilitários e helpers
│   └── hooks/                  # Custom hooks
├── public/                      # Arquivos estáticos
├── Dockerfile                   # Configuração Docker
├── docker-compose.yml          # Orquestração Docker
└── package.json                # Dependências e scripts
```

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- API Gateway rodando e acessível (padrão: `http://localhost:3001`)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Onde `NEXT_PUBLIC_API_URL` é a URL base do API Gateway (BFF).

### 3. Run Development Server

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

## Available Scripts

### Development

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm start`: Inicia servidor de produção (após build)

### Code Quality

- `npm run lint`: Executa ESLint
- `npm run typecheck`: Verifica tipos TypeScript sem gerar arquivos

### Testing

- `npm test`: Executa testes em modo silencioso
- `npm run test:watch`: Executa testes em modo watch
- `npm run test:coverage`: Executa testes com cobertura

## Architecture

### Feature-Based Structure

Cada feature possui sua própria estrutura organizada:

```
features/
└── [feature-name]/
    ├── components/      # Componentes específicos da feature
    ├── hooks/          # Custom hooks da feature
    ├── services/       # Serviços de API da feature
    └── types/          # Tipos TypeScript da feature
```

### API Client

O cliente HTTP está centralizado em `src/services/api/instances/client.ts` e inclui:

- Interceptor de requisições para adicionar token de autenticação
- Interceptor de respostas para refresh automático de token
- Tratamento centralizado de erros

### Authentication

A autenticação é gerenciada através de Context API (`src/features/auth/context/auth-context.tsx`) e inclui:

- Login e logout
- Refresh automático de tokens
- Proteção de rotas
- Persistência de sessão via localStorage

### State Management

- **Server State**: Gerenciado por React Query (cache, refetch, mutations)
- **Client State**: Gerenciado por React Context (autenticação) e estado local de componentes
- **Form State**: Gerenciado por React Hook Form

## Styling

### Tailwind CSS

O projeto utiliza Tailwind CSS 4 com configuração customizada. Classes utilitárias são utilizadas para estilização rápida e consistente.

### Component System

Componentes base seguem o padrão shadcn/ui, construídos sobre Radix UI para acessibilidade e customização.

## Testing

### Test Structure

Testes são organizados em diretórios `__tests__` próximos aos arquivos testados:

```
components/
└── layout/
    ├── header.tsx
    └── __tests__/
        └── header.test.tsx
```

### Running Tests

```bash
# Executar todos os testes
npm test

# Executar em modo watch
npm run test:watch

# Executar com cobertura
npm run test:coverage
```

### Testing Utilities

Utilitários de teste estão disponíveis em `src/helpers/testing/`:

- `render`: Wrapper customizado do React Testing Library
- `factories`: Factories para criação de dados de teste
- `mocks`: Mocks compartilhados

## Docker

### Development

```bash
docker-compose up
```

### Production Build

```bash
docker build -t aproveme-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api-gateway:3001 aproveme-frontend
```

## Environment Variables

### Required

- `NEXT_PUBLIC_API_URL`: URL base do API Gateway (BFF)

### Type Checking

Verificação de tipos TypeScript:

```bash
npm run typecheck
```

### Git Hooks

Husky está configurado para executar lint e typecheck antes de commits (via lint-staged).

## Deployment

### Build Process

1. Instalação de dependências: `npm ci`
2. Build da aplicação: `npm run build`
3. Servidor de produção: `npm start`

### Dockerfile

O Dockerfile utiliza multi-stage build:

- **Builder stage**: Instala dependências e cria build de produção
- **Runner stage**: Copia apenas arquivos necessários e executa servidor
