# Deployment

Este diretório contém a configuração de deploy da arquitetura de microserviços do projeto Aprove-me utilizando Docker Compose. A configuração orquestra múltiplos serviços backend, garantindo comunicação entre eles e gerenciamento de dependências.

## Overview

A arquitetura é composta por microserviços independentes que se comunicam através de uma rede Docker isolada. Cada serviço possui responsabilidades específicas e pode ser escalado independentemente conforme necessário.

## Architecture

### Services

#### API Gateway (Porta 3001)

Serviço que funciona como BFF (Backend for Frontend), responsável por rotear requisições para os microserviços apropriados, gerenciar autenticação centralizada e fornecer uma interface unificada para consumo pelo frontend.

- **Context**: `../services/api-gateway`
- **Port**: `3001`
- **Dependencies**: auth-service, integrations-service, notification-service
- **Environment Variables**:
  - `CORS_ORIGIN`: Origem permitida para CORS (padrão: `*`)
  - `AUTH_SERVICE_URL`: URL do serviço de autenticação
  - `INTEGRATIONS_SERVICE_URL`: URL do serviço de integrações
  - `BATCH_SERVICE_URL`: URL do serviço de processamento em lote
  - `NOTIFICATION_SERVICE_URL`: URL do serviço de notificações

#### Auth Service (Porta 3002)

Serviço responsável por gerenciar autenticação, autorização e tokens JWT.

- **Context**: `../services/auth-service`
- **Port**: `3002`
- **Database**: SQLite (volume persistente `auth-db`)
- **Environment Variables**:
  - `JWT_SECRET`: Chave secreta para assinatura de tokens (padrão: `marcos-token`)
  - `JWT_EXPIRATION`: Tempo de expiração do token JWT (padrão: `1m`)
  - `JWT_REFRESH_EXPIRATION`: Tempo de expiração do refresh token (padrão: `7d`)
  - `BCRYPT_SALT_ROUNDS`: Rodadas de salt para hash de senhas (padrão: `10`)

#### Integrations Service (Porta 3003)

Serviço responsável por gerenciar entidades de negócio (cedentes, recebíveis) e suas integrações.

- **Context**: `../services/integrations-service`
- **Port**: `3003`
- **Database**: SQLite (volume persistente `integrations-db`)

#### Batch Service (Porta 3004)

Serviço responsável por processar operações em lote, utilizando filas Redis para gerenciamento assíncrono.

- **Context**: `../services/batch-service`
- **Port**: `3004`
- **Database**: SQLite (volume persistente `batch-db`)
- **Dependencies**: redis, integrations-service, notification-service
- **Volumes**:
  - `batch-db`: Dados do banco de dados
  - `batch-uploads`: Arquivos enviados para processamento
- **Environment Variables**:
  - `REDIS_HOST`: Host do Redis (padrão: `redis`)
  - `REDIS_PORT`: Porta do Redis (padrão: `6379`)
  - `UPLOAD_PATH`: Caminho para armazenamento de uploads (padrão: `/app/uploads`)

#### Notification Service (Porta 3005)

Serviço responsável por enviar notificações e comunicação com sistemas externos.

- **Context**: `../services/notification-service`
- **Port**: `3005`

#### Redis (Porta 6379)

Servidor Redis utilizado para filas de processamento e cache.

- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Persistence**: AOF (Append Only File) habilitado
- **Volume**: `redis-data` para persistência de dados

### Network

Todos os serviços estão conectados à rede Docker `microservices-network` com driver bridge, permitindo comunicação interna entre containers através de nomes de serviço.

### Volumes

Volumes nomeados são utilizados para persistência de dados:

- `auth-db`: Banco de dados do serviço de autenticação
- `integrations-db`: Banco de dados do serviço de integrações
- `batch-db`: Banco de dados do serviço de processamento em lote
- `batch-uploads`: Arquivos de upload do serviço de processamento em lote
- `redis-data`: Dados persistidos do Redis

## Prerequisites

- Docker >= 20.10
- Docker Compose >= 2.0
- Acesso aos diretórios dos serviços em `../services/`

## Quick Start

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto ou exporte as variáveis necessárias:

```bash
export JWT_SECRET="seu-jwt-secret-aqui"
export JWT_EXPIRATION="1h"
export JWT_REFRESH_EXPIRATION="7d"
export CORS_ORIGIN="https://seu-dominio.com"
```

### 2. Iniciar Todos os Serviços

```bash
cd backend/deploy
docker-compose up -d
```

O flag `-d` inicia os containers em modo detached (background).

### 3. Verificar Status

```bash
docker-compose ps
```

### 4. Visualizar Logs

Todos os serviços:
```bash
docker-compose logs -f
```

Serviço específico:
```bash
docker-compose logs -f api-gateway
```

### Parar e Remover Volumes

**Atenção**: Isso remove todos os dados persistidos.

```bash
docker-compose down -v
```

## Development

### Rebuild After Code Changes

Após alterações no código dos serviços, reconstrua as imagens:

```bash
docker-compose up -d --build
```

### Acessar Container

Para acessar o shell de um container específico:

```bash
docker-compose exec api-gateway sh
```

### Executar Comandos no Container

```bash
docker-compose exec auth-service npm run prisma:migrate
```