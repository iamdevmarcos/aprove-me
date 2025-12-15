# 🐳 Docker Compose - Infraestrutura

## 📦 Serviços Configurados

Ao rodar `docker-compose up`, os seguintes serviços serão iniciados:

### 1. **API Gateway** (Porta 3001)
- Ponto de entrada único para todas as requisições
- Roteia requisições para os microserviços apropriados
- Valida autenticação JWT

### 2. **Auth Service** (Porta 3002)
- Gerencia autenticação e autorização
- Cria e valida tokens JWT
- Banco: SQLite (`auth-db` volume)

### 3. **Integrations Service** (Porta 3003)
- Gerencia Payables e Assignors
- CRUD completo de pagáveis e cedentes
- Banco: SQLite (`integrations-db` volume)

### 4. **Batch Service** (Porta 3004)
- Processa grandes volumes de pagáveis em lote
- Upload de arquivos CSV (até 10.000 itens)
- Processamento assíncrono com filas
- Banco: SQLite (`batch-db` volume)

### 5. **Notification Service** (Porta 3005)
- Serviço simples de envio de notificações (simulado com logs)
- Recebe requisições do Batch e de outros serviços para disparos de e-mail

### 6. **Redis** (Porta 6379)
- Fila de processamento para Batch Service
- Armazena jobs do BullMQ
- Volume: `redis-data`

## 🚀 Como Usar

### Subir todos os serviços:
```bash
cd backend/deploy
docker-compose up -d
```

### Ver logs:
```bash
docker-compose logs -f
```

### Parar todos os serviços:
```bash
docker-compose down
```

### Rebuild após mudanças:
```bash
docker-compose up -d --build
```

## 🔗 Endpoints

- **API Gateway**: http://localhost:3001
- **Auth Service**: http://localhost:3002
- **Integrations Service**: http://localhost:3003
- **Batch Service**: http://localhost:3004
- **Notification Service**: http://localhost:3005
- **Redis**: localhost:6379

## 📊 O que significa "Batch"?

**Batch** = **Lote** em português

O **Batch Service** processa pagáveis em **lotes** (grandes quantidades de uma vez), ao invés de processar um por um de forma síncrona.

**Exemplo prático:**
- ❌ **Sem Batch**: Cliente envia 10.000 pagáveis → API processa um por vez → demora muito, pode dar timeout
- ✅ **Com Batch**: Cliente envia arquivo CSV com 10.000 pagáveis → API recebe, enfileira → processa assincronamente → notifica quando terminar

**Por que "Batch"?**
- Termo comum em sistemas de processamento
- Significa processar múltiplos itens juntos
- Usado em: batch processing, batch jobs, batch uploads

## 🔄 Fluxo de Roteamento

```
Cliente → API Gateway (3001)
  ├─ /integrations/auth → Auth Service (3002)
  ├─ /integrations/payable → Integrations Service (3003)
  ├─ /integrations/payable/batch → Batch Service (3004)
  ├─ /notifications/send → Notification Service (3005)
  └─ /integrations/assignor → Integrations Service (3003)
```

## 💾 Volumes (Persistência)

- `auth-db`: Banco do Auth Service
- `integrations-db`: Banco do Integrations Service  
- `batch-db`: Banco do Batch Service
- `batch-uploads`: Arquivos CSV enviados
- `redis-data`: Dados do Redis

## 🔧 Variáveis de Ambiente

Configure no `.env` ou diretamente no `docker-compose.yml`:

- `CORS_ORIGIN`: Origem permitida para CORS
- `JWT_SECRET`: Chave secreta para JWT
- `JWT_EXPIRATION`: Tempo de expiração do token
- `MAX_BATCH_ITEMS`: Máximo de itens por batch (padrão: 10000)
- `MAX_FILE_SIZE`: Tamanho máximo do arquivo em bytes (padrão: 10MB)
