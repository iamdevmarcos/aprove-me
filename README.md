# Aprove-me

Sistema de gerenciamento de recebíveis e cedentes desenvolvido com arquitetura de microserviços. A aplicação permite cadastro de cedentes, gestão de recebíveis e processamento em lote de operações.

## Overview

O Aprove-me é uma plataforma para gerenciamento de recebíveis, composta por frontend web, backend com microserviços e infraestrutura como código. A arquitetura foi projetada para escalabilidade, manutenibilidade e separação clara de responsabilidades.

## Architecture

### Frontend

Aplicação web desenvolvida com Next.js 16, React 19 e TypeScript. Consome o API Gateway (BFF) para comunicação com os microserviços backend.

**Documentação**: [frontend/README.md](./frontend/README.md)

### Backend

Arquitetura de microserviços construída com NestJS e TypeScript, composta por:

- **API Gateway**: BFF que atua como ponto único de entrada
- **Auth Service**: Gerenciamento de autenticação e autorização
- **Integrations Service**: CRUD de cedentes e recebíveis
- **Batch Service**: Processamento assíncrono em lote
- **Notification Service**: Envio de notificações

**Documentação**: 
- [backend/services/README.md](./backend/services/README.md) - Visão geral dos microserviços
- [backend/deploy/README.md](./backend/deploy/README.md) - Configuração de deploy com Docker Compose

### Infrastructure

Infraestrutura como código utilizando Terraform para provisionamento na Google Cloud Platform (GCP).

**Documentação**: [infra/README.md](./infra/README.md)

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod

### Backend
- NestJS 11
- TypeScript
- Prisma (ORM)
- BullMQ (Filas)
- Redis
- Passport JWT

### Infrastructure
- Terraform
- Google Cloud Platform
- Docker & Docker Compose

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10
- Docker e Docker Compose
- Terraform >= 1.5.0 (para infraestrutura)
- Conta Google Cloud Platform (para deploy)

### Development Setup

1. **Backend Services**

```bash
cd backend/deploy
docker-compose up -d
```

Ver documentação completa em [backend/deploy/README.md](./backend/deploy/README.md).

2. **Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local  # Configure NEXT_PUBLIC_API_URL
npm run dev
```

Ver documentação completa em [frontend/README.md](./frontend/README.md).

3. **Infrastructure** (Opcional)

```bash
cd infra/terraform/prod
cp terraform.tfvars.example terraform.tfvars
# Edite terraform.tfvars com seus valores
terraform init
terraform apply
```

Ver documentação completa em [infra/README.md](./infra/README.md).

## Project Structure

```
aprove-me/
├── frontend/              # Aplicação Next.js
│   ├── app/              # Rotas e páginas
│   ├── src/              # Código fonte
│   │   ├── components/  # Componentes compartilhados
│   │   ├── features/    # Features organizadas por domínio
│   │   └── services/    # Cliente HTTP e APIs
│   └── README.md
├── backend/
│   ├── services/         # Microserviços
│   │   ├── api-gateway/
│   │   ├── auth-service/
│   │   ├── integrations-service/
│   │   ├── batch-service/
│   │   ├── notification-service/
│   │   └── README.md
│   └── deploy/           # Docker Compose
│       ├── docker-compose.yml
│       └── README.md
├── infra/                # Infraestrutura como código
│   ├── terraform/
│   │   └── prod/
│   └── README.md
└── README.md            # Este arquivo
```

## Services Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Aplicação web Next.js |
| API Gateway | 3001 | BFF para frontend |
| Auth Service | 3002 | Autenticação |
| Integrations Service | 3003 | Cedentes e recebíveis |
| Batch Service | 3004 | Processamento em lote |
| Notification Service | 3005 | Notificações |
| Redis | 6379 | Broker de mensagens |

## Development Workflow

### Running Locally

1. Inicie os serviços backend via Docker Compose
2. Configure variáveis de ambiente do frontend
3. Execute o frontend em modo desenvolvimento
4. Acesse `http://localhost:3000`

### Testing

Cada módulo possui sua própria suíte de testes:

- **Frontend**: `npm test` (Jest + React Testing Library)
- **Backend**: `npm test` (Jest) em cada serviço

### Code Quality

- **Linting**: ESLint configurado em todos os projetos
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky para validação pré-commit (frontend)

## Deployment

### CI/CD

O projeto utiliza GitHub Actions para deploy automático:

- Push na branch `main` dispara workflow de deploy
- Terraform aplica infraestrutura no GCP
- Workflow configurado em `.github/workflows/deploy-prod.yml`

### Production

1. Infraestrutura provisionada via Terraform
2. Serviços backend deployados via Docker Compose
3. Frontend buildado e servido via Next.js

Ver documentação específica em:
- [infra/README.md](./infra/README.md) - Provisionamento de infraestrutura
- [backend/deploy/README.md](./backend/deploy/README.md) - Deploy de serviços

Feito com dedicação e esforço por *Marcos Mendes*

