# Como criar um usuário administrador

## Pré-requisitos

- Ambiente em execução (`docker compose up --build`)
- Ter em mãos as duas chaves de acesso (definidas pelo responsável técnico)

---

## Passo a passo

### 1. Acesse a página de cadastro

```
http://localhost:8080/admin/gerenciamento/register-operator
```

### 2. Informe a Senha de Acesso

Na primeira tela, insira a **Senha de Acesso** (definida na variável `GATE_PASSWORD` do frontend).  
Sem essa senha, o formulário de cadastro não é exibido.

### 3. Preencha o formulário

| Campo | Descrição |
|---|---|
| Nome completo | Nome de exibição do usuário |
| Usuário | Login que será usado no sistema |
| Senha | Senha de acesso ao painel admin |
| Chave de Cadastro | Valor definido em `SIGNUP_SECRET` no `docker-compose.yml` |

### 4. Clique em **Criar Usuário**

Se as chaves estiverem corretas e o usuário não existir, o cadastro será confirmado na tela.

---

## Onde ficam as chaves

| Chave | Onde alterar |
|---|---|
| Senha de Acesso (portão) | `app/pages/CreateUser.tsx` — variável `GATE_PASSWORD` |
| Chave de Cadastro (backend) | `docker-compose.yml` — variável `SIGNUP_SECRET` |

> Sempre troque os valores padrão antes de ir para produção.
