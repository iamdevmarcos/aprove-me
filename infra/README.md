# IaC

Este diretório contém a definição de infraestrutura como código (IaC) do projeto Aprove-me, utilizando Terraform para provisionar e gerenciar recursos na Google Cloud Platform (GCP).

## Overview

A infraestrutura é gerenciada através de Terraform, permitindo versionamento, reprodutibilidade e automação completa do ambiente de produção. Todos os recursos são definidos declarativamente, garantindo consistência e rastreabilidade de mudanças.

## Structure

```
infra/
├── README.md                    # Esta documentação
├── .gitignore                   # Arquivos ignorados pelo Git
└── terraform/
    └── prod/                    # Ambiente de produção
        ├── main.tf              # Definição dos recursos principais
        ├── variables.tf         # Variáveis do Terraform
        ├── terraform.tfvars.example  # Template de variáveis
        └── .terraform.lock.hcl # Lock de versões dos providers
```

## Provisioned Resources

### Network

- **VPC**: Rede virtual privada customizada (`aproveme-prod-vpc`)
  - Sub-redes não são criadas automaticamente
  - Permite controle granular sobre segmentação de rede

- **Sub-rede**: Sub-rede regional (`aproveme-prod-subnet`)
  - CIDR: `10.10.0.0/24`
  - Região: `us-central1`

### Security

- **Firewall HTTP**: Regra de firewall para tráfego HTTP/HTTPS
  - Portas: `80`, `3000`, `3001`
  - Origem: `0.0.0.0/0` (público)

- **Firewall SSH**: Regra de firewall para acesso SSH
  - Porta: `22`
  - Origem: `0.0.0.0/0` (público)

### Compute

- **Instância de Computação**: Máquina virtual Debian 12
  - Tipo: `e2-micro` (configurável)
  - Disco: 30GB
  - Docker pré-instalado via startup script
  - IP público configurado

### Storage

- **Artifact Registry**: Repositório Docker para imagens de containers
  - Formato: Docker
  - Localização: `us-central1`
  - URI: `us-central1-docker.pkg.dev/{project_id}/aproveme-repo`

## Prerequisites

- Terraform >= 1.5.0
- Conta Google Cloud Platform com projeto configurado
- Permissões adequadas no projeto GCP para criar recursos
- Credenciais do GCP configuradas localmente ou via Workload Identity

## Initial Setup

### 1. Configurar Variáveis

Copie o arquivo de exemplo e configure com seus valores:

```bash
cd terraform/prod
cp terraform.tfvars.example terraform.tfvars
```

Edite `terraform.tfvars` com os valores do seu ambiente:

```hcl
project_id     = "seu-projeto-gcp-id"
project_prefix = "aproveme"
region         = "us-central1"
zone           = "us-central1-a"
machine_type   = "e2-micro"
```

### 2. Inicializar Terraform

```bash
cd terraform/prod
terraform init
```

Este comando baixa os providers necessários e configura o backend.

### 3. Validar Configuração

```bash
terraform validate
terraform plan
```

O comando `plan` mostra um preview das mudanças que serão aplicadas sem modificar a infraestrutura.

### 4. Aplicar Infraestrutura

```bash
terraform apply
```

Confirme a aplicação quando solicitado. Para aplicação automática (não recomendado em produção manual):

```bash
terraform apply -auto-approve
```

## CI/CD Usage

A infraestrutura é aplicada automaticamente via GitHub Actions quando há push na branch `main`. O workflow está configurado em `.github/workflows/deploy-prod.yml`.

O workflow utiliza Workload Identity Federation para autenticação no GCP, eliminando a necessidade de chaves de serviço estáticas.

## State Management

O estado do Terraform (`terraform.tfstate`) contém informações sensíveis sobre os recursos provisionados e não deve ser versionado. O arquivo está configurado no `.gitignore`.

## Variables

### Required

- `project_id`: ID do projeto GCP onde os recursos serão criados

### Optional (with default values)

- `project_prefix`: Prefixo usado nos nomes dos recursos (padrão: `"aproveme"`)
- `region`: Região GCP (padrão: `"us-central1"`)
- `zone`: Zona GCP (padrão: `"us-central1-a"`)
- `machine_type`: Tipo de máquina da VM (padrão: `"e2-micro"`)

## Outputs

Após aplicar a infraestrutura, os seguintes outputs estão disponíveis:

- `prod_vm_external_ip`: IP público da instância de computação
- `docker_repo_uri`: URI do repositório Docker no Artifact Registry

Para visualizar os outputs:

```bash
terraform output
```