# Microservices

Arquitetura de microserviços do projeto Aprove-me construída com NestJS e TypeScript. Cada serviço possui responsabilidades específicas e se comunica através do API Gateway.

## Services Overview

### API Gateway (Porta 3001)

**Responsabilidade**: BFF (Backend for Frontend) que atua como ponto único de entrada para o frontend, roteando requisições para os microserviços apropriados.

**Tecnologias**: NestJS, Axios, Passport JWT

**Funcionalidades**:
- Proxy de requisições para microserviços
- Validação centralizada de autenticação JWT
- Roteamento baseado em path
- Logging de requisições

**Dependências**: auth-service, integrations-service, batch-service, notification-service

**Banco de Dados**: Nenhum

---

### Auth Service (Porta 3002)

**Responsabilidade**: Gerenciamento de autenticação, autorização e tokens JWT.

**Tecnologias**: NestJS, Prisma, bcrypt, Passport JWT

**Funcionalidades**:
- Registro e login de usuários
- Geração e validação de tokens JWT
- Refresh token
- Hash de senhas com bcrypt

**Dependências**: Nenhuma

**Banco de Dados**: SQLite (Prisma)

**Endpoints Principais**:
- `POST /auth/login` - Autenticação
- `POST /auth/refresh` - Refresh token
- `POST /auth/register` - Registro (se implementado)

---

### Integrations Service (Porta 3003)

**Responsabilidade**: Gerenciamento de entidades de negócio (cedentes e recebíveis).

**Tecnologias**: NestJS, Prisma, Passport JWT

**Funcionalidades**:
- CRUD de cedentes (assignors)
- CRUD de recebíveis (payables)
- Validação de dados de negócio
- Relacionamentos entre entidades

**Dependências**: auth-service (para validação de JWT)

**Banco de Dados**: SQLite (Prisma)

**Endpoints Principais**:
- `GET/POST/PUT/DELETE /assignors` - Gerenciamento de cedentes
- `GET/POST/PUT/DELETE /payables` - Gerenciamento de recebíveis

---

### Batch Service (Porta 3004)

**Responsabilidade**: Processamento assíncrono de operações em lote, especialmente upload e processamento de arquivos CSV.

**Tecnologias**: NestJS, BullMQ, Redis, Prisma, csv-parse, Multer

**Funcionalidades**:
- Upload de arquivos CSV
- Parsing e validação de CSV
- Processamento assíncrono via filas Redis
- Retry automático de itens com falha
- Tracking de status de processamento

**Dependências**: Redis, integrations-service, notification-service

**Banco de Dados**: SQLite (Prisma) para tracking de jobs

**Endpoints Principais**:
- `POST /integrations/payable/batch` - Upload de CSV para processamento
- `GET /integrations/payable/batch/:id` - Status do processamento

---

### Notification Service (Porta 3005)

**Responsabilidade**: Envio de notificações e comunicação com sistemas externos.

**Tecnologias**: NestJS

**Funcionalidades**:
- Envio de notificações
- Integração com sistemas externos
- Webhooks (se implementado)

**Dependências**: Nenhuma

**Banco de Dados**: Nenhum

**Endpoints Principais**:
- Endpoints de notificação (específicos conforme implementação)

---

## Architecture

### Communication Flow

```
Frontend → API Gateway → [Auth Service | Integrations Service | Batch Service | Notification Service]
```

### Service Dependencies

- **API Gateway** depende de todos os outros serviços
- **Integrations Service** depende de **Auth Service** (validação JWT)
- **Batch Service** depende de **Integrations Service** e **Notification Service**
- **Auth Service** e **Notification Service** são independentes

### Data Storage

- **Auth Service**: SQLite (usuários e tokens)
- **Integrations Service**: SQLite (cedentes e recebíveis)
- **Batch Service**: SQLite (jobs e status) + Redis (filas)
- **API Gateway**: Stateless
- **Notification Service**: Stateless

## Technology Stack

### Common

- **NestJS 11**: Framework Node.js
- **TypeScript 5**: Linguagem
- **Prisma 6**: ORM (onde aplicável)
- **Passport JWT**: Autenticação

### Service-Specific

- **BullMQ**: Filas de processamento (batch-service)
- **Redis**: Broker de mensagens (batch-service)
- **bcrypt**: Hash de senhas (auth-service)
- **csv-parse**: Parsing de CSV (batch-service)
- **Multer**: Upload de arquivos (batch-service, api-gateway)
- **Axios**: Cliente HTTP (api-gateway)

## Development

### Prerequisites

- Node.js >= 20
- Docker e Docker Compose (para Redis e deploy)
- SQLite (ou migrar para PostgreSQL em produção)

### Running Services

Cada serviço pode ser executado independentemente:

```bash
cd api-gateway
npm install
npm run start:dev
```

Ou via Docker Compose (ver `../deploy/README.md`):

```bash
cd ../deploy
docker-compose up
```

### Database Migrations

Serviços com Prisma:

```bash
# Auth Service
cd auth-service
npm run prisma:migrate

# Integrations Service
cd integrations-service
npm run prisma:migrate

# Batch Service
cd batch-service
npm run prisma:migrate
```

## Ports

| Service | Port | Protocol |
|---------|------|----------|
| API Gateway | 3001 | HTTP |
| Auth Service | 3002 | HTTP |
| Integrations Service | 3003 | HTTP |
| Batch Service | 3004 | HTTP |
| Notification Service | 3005 | HTTP |
| Redis | 6379 | TCP |

## Production Considerations

### Security

- Todos os serviços validam JWT via Passport
- Secrets devem ser gerenciados via variáveis de ambiente
- CORS configurado no API Gateway
- Senhas hasheadas com bcrypt (10 rounds)

### Scalability

- **Stateless Services**: API Gateway, Notification Service podem ser escalados horizontalmente
- **Stateful Services**: Auth Service, Integrations Service requerem banco de dados compartilhado
- **Batch Service**: Pode escalar workers, mas requer Redis compartilhado

### Database

- **Desenvolvimento**: SQLite (arquivos locais)
- **Produção**: Migrar para PostgreSQL ou MySQL
- **Redis**: Necessário para Batch Service (pode usar Redis Cloud ou instância gerenciada)

### Monitoring

- Implementar health checks em todos os serviços
- Logging centralizado recomendado
- Métricas de performance e erro
- Monitoramento de filas Redis (Batch Service)

## Testing

Cada serviço possui testes unitários e E2E:

```bash
# Executar testes
npm test

# Testes com cobertura
npm run test:cov

# Testes E2E
npm run test:e2e
```

## References

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [BullMQ Documentation](https://docs.bullmq.io)

